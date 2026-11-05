// Dot-matrix apple tree for the homepage hero (#home-hero / #hero-tree-canvas).
// Plain script, no dependencies: loaded by <script src="hero-background.js"></script>.
(() => {
  const hero = document.getElementById("home-hero");
  const canvas = document.getElementById("hero-tree-canvas");
  if (!hero || !canvas) return;
  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const octx = off.getContext("2d", { willReadFrequently: true });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const FPS = 30;                                           // dot-matrix look doesn't need 60fps; halves the work

  let PITCH = 4, GAP_X = 3, GAP_Y = 3, DOT = 2, CELL_W = 11, CELL_H = 19, ds = 1;
  const DOT_COLOR = "#3a3a3a", ACCENT_PINK = "#d3a0a0", BG = "#fffbfb";
  const RED = "#d9272e", LEAF = "#70b074";                 // apples and their leaves
  const CAT_COLOR = "#1c1c1c";
  const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v => (v + 0.5) / 16);

  let W, H, u, dpr, cols, rows, petalGrad, haze, groundY, sprites;
  let flowers = [], petals = [], segs = [], apples = [], appleMask, catMask, mouseX = 0.5, mousePx = null, shake = 0;
  const brush = { x: -999, y: -999, vx: 0 };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const PETAL = [[0,1],[.45,.8],[.8,.3],[.85,-.3],[.55,-.85],[.28,-1],[0,-.6],[-.28,-1],[-.55,-.85],[-.85,-.3],[-.8,.3],[-.45,.8]];
  const PETAL_P = (() => {
    const p = new Path2D(), n = PETAL.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const s = mid(PETAL[n - 1], PETAL[0]); p.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) { const q = PETAL[i], e = mid(q, PETAL[(i + 1) % n]); p.quadraticCurveTo(q[0], q[1], e[0], e[1]); }
    p.closePath(); return p;
  })();
  function petal(s, bright) {
    octx.save(); octx.scale(s, s); octx.globalAlpha = bright;
    octx.fillStyle = petalGrad; octx.fill(PETAL_P);
    octx.lineWidth = 2.4 / s; octx.strokeStyle = "rgba(54,116,60,0.75)"; octx.stroke(PETAL_P); octx.restore();
  }
  function blossom(f, t) {
    octx.save(); octx.translate(f.x + f.dx, f.y); octx.rotate(Math.sin(t * 0.7 + f.ph) * 0.12 + f.dx * 0.01);
    for (let i = 0; i < 5; i++) { octx.save(); octx.rotate(i * TAU / 5); octx.translate(0, -f.s * 0.95); petal(f.s * 0.95, 0.8); octx.restore(); }
    octx.fillStyle = "#fff";
    octx.beginPath();                                       // all centre dots in one path
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6, r = f.s * 0.3, rr = f.s * 0.07 + 1; octx.moveTo(Math.cos(a) * r + rr, Math.sin(a) * r); octx.arc(Math.cos(a) * r, Math.sin(a) * r, rr, 0, TAU); }
    octx.fill();
    octx.restore();
  }

  function measure() {
    const o = canvas.getBoundingClientRect();
    let left = W, right = 0, top = H;
    hero.querySelectorAll(".hero-headline, .hero-tagline, .matrix-label, .matrix-value").forEach(el => {
      const r = document.createRange(); r.selectNodeContents(el);
      const b = r.getBoundingClientRect(); if (!b.width) return;
      left = Math.min(left, b.left - o.left); right = Math.max(right, b.right - o.left); top = Math.min(top, b.top - o.top);
    });
    return { left, right, top };
  }

  function makeTree(W, H, u, m) {
    let seed = 5; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const segs = [], flowers = [], apples = [], tt = m.top / H;
    const E = { l: m.left - W * 0.03, r: m.right + W * 0.04, t: m.top - H * 0.05 };
    const yMax = H * 0.965 - H * 0.12;
    const inE = (x, y) => x > E.l && x < E.r && y > E.t;
    const bad = (x, y) => x < -30 || x > W + 30 || y < -H * 0.04 || y > yMax || inE(x, y);
    let ox = -0.03 * W, oy = 0.5 * H, droop = 0.1, clumpN = 1, strandP = 0.3, subP = 0.3, hang = true;
    const LS = 1.3;                                         // twig length multiplier: fuller, bigger canopy
    const kOf = (x, y) => clamp(Math.hypot(x - ox, y - oy) / (W * 0.5), 0, 1);
    const add = (x, y, s) => { if (!bad(x, y)) flowers.push({ x, y, s: s * u, ph: r() * TAU, k: kOf(x, y), dx: 0 }); };
    const seg = (x, y, x2, y2, w, b) => {
      const cx = (x + x2) / 2, cy = (y + y2) / 2;
      segs.push({ x, y, x2, y2, cx, cy, w, b, k0: kOf(x, y), kc: kOf(cx, cy), k1: kOf(x2, y2) });
    };
    const lerp = (a, b, t) => a + (b - a) * t;

    const spline = (P, step) => {
      const out = [];
      for (let i = 0; i < P.length - 1; i++) {
        const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
        const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
        for (let j = 0; j < n; j++) {
          const t = j / n, t2 = t * t, t3 = t2 * t, c = (k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
          out.push([c(0), c(1)]);
        }
      }
      out.push(P[P.length - 1]); return out;
    };

    const strand = (x, y) => {
      let px = x, py = y, a = Math.PI + (r() - 0.5) * 0.3;
      const n = 3 + ((r() * 8) | 0);
      for (let i = 0; i < n; i++) {
        a += (r() - 0.5) * 0.35; const L = (20 + r() * 16) * u;
        const x2 = px + Math.sin(a) * L, y2 = py - Math.cos(a) * L;
        if (bad(x2, y2)) break;
        seg(px, py, x2, y2, 2.2 * u);
        if (i % 2 === 1 && r() < 0.6) add(x2, y2, 6 + r() * 3);
        px = x2; py = y2;
      }
      add(px, py, 8 + r() * 4);
    };

    const twig = (x, y, a, len, w, d) => {
      let px = x, py = y; const n = Math.max(2, Math.round(len / (18 * u)));
      for (let i = 0; i < n; i++) {
        a += (r() - 0.5) * 0.35 + (Math.sin(a) >= 0 ? 1 : -1) * droop;
        const x2 = px + Math.sin(a) * 18 * u, y2 = py - Math.cos(a) * 18 * u;
        if (bad(x2, y2)) break;
        seg(px, py, x2, y2, Math.max(w * (1 - 0.5 * i / n), 1.8 * u));
        if (d < 2 && i > 0 && i < n - 1 && r() < subP) twig(x2, y2, a + (r() < 0.5 ? -1 : 1) * (0.6 + r() * 0.5), len * 0.55, w * 0.6, d + 1);
        if (r() < 0.25) add(x2, y2, 8 + r() * 3);
        px = x2; py = y2;
      }
      add(px, py, 13 + r() * 4);
      const h = Math.abs(Math.sin(px * 0.37 + py * 0.91) * 43758.5453) % 1;               // position-based, so apples don't change the tree's layout
      if (d < 2 && h < 0.4) { const ar = (11 + h * 12) * u, ay = py + ar + 4 * u; if (!bad(px, ay + ar)) apples.push({ x: px, y: ay, r: ar, k: kOf(px, ay), state: 0, grow: 1, delay: 0, vy: 0, fx: 0, fy: 0, rest: 0 }); }   // an apple hanging from the twig tip
      for (let k = 0; k < clumpN; k++) if (r() < 0.75) { const q = r() * TAU, dd = (22 + r() * 14) * u; add(px + Math.cos(q) * dd, py + Math.sin(q) * dd * 0.8, 9 + r() * 4); }
      if (r() < strandP) strand(px, py);
    };

    const fy = clamp((tt - 0.06) / 0.18, 0.45, 1.15);
    const treeHeight = 1.15;
    const limb = (P, w0, w1, gap, decor, map) => {
      let pts = spline(P.map(map || (([x, y]) => [x * W, (0.66 + (y - 0.66) * treeHeight) * (1 + (fy - 1) * clamp((0.6 - x) / 0.2, 0, 1)) * H])), 20 * u);
      const n = pts.length, thick = w0 >= 14, ph = [r() * 6, r() * 6, r() * 6];
      const knots = [0.2, 0.45, 0.7].map(k => (k + (r() - 0.5) * 0.15) * n);
      const Wd = pts.map((_, i) => {
        let w = lerp(w0, w1, i / (n - 1)) * u;
        if (thick) { w *= 1 + 0.14 * Math.sin(i * 0.6 + ph[0]) + 0.08 * Math.sin(i * 1.7 + ph[1]); for (const k of knots) w *= 1 + 0.32 * Math.exp(-(((i - k) / 1.6) ** 2)); }
        return Math.max(w, 2.6 * u);
      });
      const nrm = (i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / L, (b[0] - a[0]) / L]; };
      if (thick) pts = pts.map((p, i) => {
        const q = nrm(i), o = (Math.sin(i * 0.5 + ph[1]) * 0.16 + Math.sin(i * 1.3 + ph[2]) * 0.07) * Wd[i] * Math.sin(Math.PI * i / (n - 1));
        return [p[0] + q[0] * o, p[1] + q[1] * o];
      });
      let side = 1, since = 0, last = n - 1;
      for (let i = 0; i < n - 1; i++) {
        const t = i / (n - 1), w = Wd[i];
        if (decor && t > 0.3 && inE(pts[i + 1][0], pts[i + 1][1])) { last = i; break; }
        seg(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], w, thick ? 0.3 + r() * 0.3 : undefined);
        if (!decor) continue;
        since += 20 * u;
        if (t > 0.18 && since > gap * u) {
          since = 0; side = -side;
          const ta = Math.atan2(pts[i + 1][0] - pts[i][0], -(pts[i + 1][1] - pts[i][1])), down = side > 0;
          const sgn = ((-Math.cos(ta + 0.7)) > 0) === down ? 1 : -1;
          const len = (hang ? (down ? 70 + r() * 80 : 40 + r() * 50) : 55 + r() * 65) * LS;
          twig(pts[i][0], pts[i][1], ta + sgn * (0.55 + r() * 0.5), len * u, Math.max(w * 0.4, 3 * u), 0);
          if (r() < strandP) strand(pts[i][0], pts[i][1]);
        }
        if (r() < 0.1) add(pts[i][0], pts[i][1], 10 + r() * 4);
      }
      if (thick) for (const lane of [-0.3, 0.02, 0.3]) {
        let on = false, prev = null;
        for (let i = 0; i <= last; i++) {
          const q = nrm(i), o = lane * Wd[i] + Math.sin(i * 0.9 + lane * 7) * 0.06 * Wd[i];
          const p = [pts[i][0] + q[0] * o, pts[i][1] + q[1] * o];
          if (on && prev) seg(prev[0], prev[1], p[0], p[1], 2 * u);
          on = on ? r() > 0.16 : r() < 0.3; prev = p;
        }
      }
      if (decor) { const e = pts[last]; add(e[0], e[1], 15 + r() * 4); add(e[0] + (r() - 0.5) * 40 * u, e[1] + r() * 24 * u, 11 + r() * 3); }
    };

    const wide = W - m.right > Math.max(200, W * 0.26);
    if (wide) {
      // bigger tree: crown starts closer to the text and fills nearly the full remaining width and height
      const gx0 = m.right + W * 0.01, gx1 = W * 0.995, hw = (gx1 - gx0) / 2, cx = (gx0 + gx1) / 2;
      const gy = H * 0.965, th = (gy - H * 0.02) * treeHeight;
      ox = cx; oy = gy; droop = 0.03; clumpN = 2; strandP = 0.1; subP = 0.35; hang = false;
      const crown = ([xn, yn]) => [cx + xn * hw * 0.97, gy - yn * th];
      const g = (P, w0, w1, gap, decor) => limb(P, w0 * 1.25, w1 * 1.15, gap, decor, crown);
      limb([[cx - 8 * u, gy - 20 * u], [cx - 32 * u, gy - 6 * u], [cx - 80 * u, gy + 2 * u]], 20, 5, 0, false, (p) => p);
      limb([[cx + 8 * u, gy - 20 * u], [cx + 32 * u, gy - 6 * u], [cx + 72 * u, gy + 2 * u]], 20, 5, 0, false, (p) => p);
      g([[0, 0], [-0.04, 0.1], [0.04, 0.22], [-0.02, 0.33], [0.03, 0.43], [0.02, 0.47]], 36, 22, 0, false);
      g([[0.02, 0.47], [-0.16, 0.58], [-0.36, 0.7], [-0.58, 0.78], [-0.74, 0.8]], 16, 4, 52, true);
      g([[0.02, 0.47], [0.26, 0.55], [0.5, 0.68], [0.76, 0.76], [1.0, 0.72]], 17, 4, 52, true);
      g([[0.02, 0.47], [-0.06, 0.6], [0.05, 0.73], [-0.03, 0.87], [0.07, 0.97]], 14, 3.5, 52, true);
      g([[0.0, 0.4], [0.1, 0.52], [0.2, 0.66], [0.32, 0.8], [0.3, 0.93]], 11, 3, 52, true);
      g([[0.0, 0.34], [-0.24, 0.43], [-0.48, 0.5], [-0.7, 0.5], [-0.84, 0.43]], 10, 3, 52, true);
      g([[0.02, 0.32], [0.3, 0.42], [0.6, 0.47], [0.84, 0.44], [0.97, 0.35]], 10, 3, 52, true);
      droop = 0.05; hang = true; strandP = 0.1; clumpN = 1;
      const Er = m.right + W * 0.04, fyf = clamp((tt - 0.06) / 0.17, 0.4, 1.1), q = (x, y) => [x * W, y * H * fyf];
      limb([crown([-0.36, 0.7]), [Er + 0.08 * W, 0.12 * H * fyf], [Er - 0.02 * W, 0.075 * H * fyf], q(0.32, 0.055), q(0.2, 0.065)], 12, 3.5, 90, true, (p) => p);
    } else {
      limb([[-0.035, 0.66], [-0.008, 0.54], [0.016, 0.42], [0.006, 0.31], [0.03, 0.21], [0.048, 0.13], [0.09, 0.08]], 50, 30, 0, false);
      limb([[0.09, 0.08], [0.2, 0.045], [0.31, 0.06], [0.44, 0.03], [0.58, 0.07], [0.72, 0.13], [0.82, 0.24], [0.88, 0.38]], 30, 5, 58, true);
      limb([[0.02, 0.24], [0.06, 0.16], [0.15, 0.12], [0.27, 0.13], [0.38, 0.1], [0.5, 0.15], [0.6, 0.25], [0.66, 0.38], [0.67, 0.5]], 24, 5, 58, true);
    }
    return { segs, flowers, apples };
  }

  function buildTree() {
    groundY = H * 0.965;
    const t = makeTree(W, H, u, measure());
    segs = t.segs; flowers = t.flowers; apples = t.apples;
    for (const s of segs) {
      const h2 = Math.abs(Math.sin(s.x * 0.53 + s.y * 0.29) * 9371.7) % 1;
      if (s.w >= 2.5 * u && s.w < 10 * u && h2 < 0.3) flowers.push({ x: s.x, y: s.y, s: (8 + h2 * 20) * u, ph: h2 * TAU * 3, k: s.k0, dx: 0 });
    }
  }

  const BR2 = 170 * 170;
  function swayX(x, y, k, t) {
    if (k < 0.02) return 0;                                 // trunk base barely moves
    const gust = 0.65 + 0.35 * Math.sin(t * 0.23);
    const wave = Math.sin(t * 0.55 + x * 0.003) * 12 + Math.sin(t * 1.4 + y * 0.012 + x * 0.002) * 4;
    let push = 0;
    if (brush.vx > 0.5 || brush.vx < -0.5) {                // skip the exp() unless the cursor is actually moving
      const d2 = (x - brush.x) ** 2 + (y - brush.y) ** 2;
      if (d2 < BR2 * u * u * 4) push = brush.vx * Math.exp(-d2 / (BR2 * u * u)) * 0.45;
    }
    return k * k * (wave * gust + (mouseX - 0.5) * 24 + (shake > 0 ? shake * Math.sin(t * 16 + y * 0.01) * 16 : 0)) * u + push * k;
  }

  const cat = { x: 0, dir: 1, mode: "sit", target: 0, timer: 1.5, phase: 0 };
  function updateCat(dt) {
    if (cat.mode === "walk") {
      cat.x += cat.dir * 60 * u * dt; cat.phase += dt * 11;
      if ((cat.dir > 0 && cat.x >= cat.target) || (cat.dir < 0 && cat.x <= cat.target)) { cat.mode = "sit"; cat.timer = rnd(1.5, 4); }
    } else if ((cat.timer -= dt) <= 0) {
      cat.target = mousePx !== null && Math.random() < 0.6 ? clamp(mousePx, 40, W - 40) : rnd(0.06, 0.94) * W;
      if (Math.abs(cat.target - cat.x) > 30) { cat.dir = Math.sign(cat.target - cat.x); cat.mode = "walk"; } else cat.timer = 1;
    }
  }
  function drawCat(t) {
    const s = 56 * u, sit = cat.mode === "sit";
    octx.save(); octx.translate(cat.x, groundY); octx.scale(cat.dir, 1);
    octx.fillStyle = octx.strokeStyle = "rgba(255,255,255,0.92)"; octx.lineCap = "round"; octx.lineWidth = 0.1 * s;
    const ell = (x, y, rx, ry) => { octx.beginPath(); octx.ellipse(x * s, y * s, rx * s, ry * s, 0, 0, TAU); octx.fill(); };
    const line = (x1, y1, x2, y2) => { octx.beginPath(); octx.moveTo(x1 * s, y1 * s); octx.lineTo(x2 * s, y2 * s); octx.stroke(); };
    const head = (hx, hy) => {
      ell(hx, hy, 0.2, 0.17);
      for (const k of [-1, 1]) { octx.beginPath(); octx.moveTo((hx + k * 0.18) * s, (hy - 0.05) * s); octx.lineTo((hx + k * 0.13) * s, (hy - 0.34) * s); octx.lineTo(hx * s, (hy - 0.15) * s); octx.fill(); }
    };
    octx.beginPath();
    if (sit) {
      ell(0, -0.42, 0.26, 0.42); head(0.06, -0.98); line(0.12, -0.3, 0.12, -0.02);
      octx.moveTo(-0.2 * s, -0.08 * s); octx.quadraticCurveTo(-0.6 * s, -0.02 * s, (-0.5 + Math.sin(t * 2) * 0.06) * s, -0.5 * s); octx.stroke();
    } else {
      ell(0, -0.55, 0.5, 0.2); ell(0.45, -0.64, 0.2, 0.16); head(0.62, -0.78);
      octx.moveTo(-0.5 * s, -0.6 * s); octx.quadraticCurveTo(-0.85 * s, -0.55 * s, -0.9 * s, (-0.95 + Math.sin(t * 3) * 0.08) * s); octx.stroke();
      for (const [x, off] of [[-0.38, 0], [-0.2, Math.PI], [0.28, Math.PI], [0.42, 0]]) {
        const ph = cat.phase + off; line(x, -0.42, x + Math.sin(ph) * 0.14, -Math.max(0, Math.cos(ph)) * 0.1);
      }
    }
    octx.restore();
  }

  function shakeApples() {
    for (const a of apples) if (a.state === 0 && a.grow >= 1 && Math.random() < 0.5) {
      a.state = 1;
      a.delay = rnd(0, 0.7);
      a.rotation = [Math.PI / 2, Math.PI, Math.PI * 1.5][Math.floor(Math.random() * 3)];
    }
  }

  function spawn(anywhere, once) {
    const f = flowers[(Math.random() * flowers.length) | 0]; if (!f) return;
    const depth = Math.random();
    petals.push({
      x: f.x + f.dx + rnd(-8, 8), y: anywhere ? rnd(0, H) : f.y + rnd(0, 10), s: (9 + depth * 12) * u, b: 0.45 + depth * 0.55, once,
      vy: 18 + depth * 34, drift: -(6 + depth * 20), sway: rnd(14, 40), freq: rnd(0.5, 1.4), ph: rnd(0, TAU),
      rot: rnd(0, TAU), spin: rnd(-1.2, 1.2), flip: rnd(0, TAU), flipV: rnd(1, 2.6),
    });
  }

  function makeSprites() {                                  // pre-rendered dots: drawImage is far cheaper than thousands of arc() paths
    sprites = [DOT_COLOR, ACCENT_PINK, RED, LEAF, CAT_COLOR].map(col => [0, 1, 2, 3, 4].map(l => {
      const rad = (0.6 + ((l + 0.5) / 5) * 1.1) * ds, size = Math.ceil(rad * 2 + 2);
      const c = document.createElement("canvas"); c.width = c.height = Math.ceil(size * dpr);
      const g = c.getContext("2d"); g.scale(dpr, dpr); g.fillStyle = col;
      g.beginPath(); g.arc(size / 2, size / 2, rad, 0, TAU); g.fill();
      return { c, s: size };
    }));
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);             // capped: dots are tiny, extra pixels are wasted work
    W = Math.max(1, canvas.clientWidth); H = Math.max(1, canvas.clientHeight); u = Math.max(0.6, Math.min(W, H) / 720);
    ds = clamp(u, 0.65, 1.3); PITCH = 4 * ds; GAP_X = GAP_Y = 3 * ds; DOT = 2 * ds; CELL_W = 2 * PITCH + GAP_X; CELL_H = 4 * PITCH + GAP_Y;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / CELL_W) * 2; rows = Math.ceil(H / CELL_H) * 4;
    off.width = cols; off.height = rows; appleMask = new Uint8Array(cols * rows); catMask = new Uint8Array(cols * rows);
    petalGrad = octx.createLinearGradient(0, 1, 0, -1);
    petalGrad.addColorStop(0, "rgba(112,176,116,0.45)"); petalGrad.addColorStop(1, "rgba(112,176,116,1)");
    haze = document.createElement("canvas"); haze.width = haze.height = 64;
    const hg = haze.getContext("2d"), g = hg.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,0.07)"); g.addColorStop(1, "rgba(255,255,255,0)");
    hg.fillStyle = g; hg.fillRect(0, 0, 64, 64);
    makeSprites();
    buildTree();
    cat.x = clamp(cat.x || W * 0.55, 40, W - 40); cat.target = cat.x;
    petals = [];
    const n = Math.round((W * H) / 45000);                  // fewer falling petals
    for (let i = 0; i < n; i++) spawn(true);
  }

  function frame(t, dt) {
    shake = Math.max(0, shake - dt * 0.8); brush.vx *= 0.9 ** (dt * 60);
    updateCat(dt);
    for (const f of flowers) f.dx = swayX(f.x, f.y, f.k, t);
    octx.setTransform(1, 0, 0, 1, 0, 0); octx.globalCompositeOperation = "source-over"; octx.fillStyle = "#000"; octx.fillRect(0, 0, cols, rows);
    octx.globalCompositeOperation = "lighten";
    octx.setTransform(2 / CELL_W, 0, 0, 4 / CELL_H, 0, 0);
    octx.lineCap = "round";
    octx.strokeStyle = "rgba(255,255,255,0.2)"; octx.lineWidth = 4;
    octx.beginPath(); octx.moveTo(0, groundY + 4); octx.lineTo(W, groundY + 4); octx.stroke();
    for (const s of segs) {                                 // stroke directly: no Path2D allocation per segment per frame
      const x1 = s.x + swayX(s.x, s.y, s.k0, t), cx = s.cx + swayX(s.cx, s.cy, s.kc, t), x2 = s.x2 + swayX(s.x2, s.y2, s.k1, t);
      octx.beginPath(); octx.moveTo(x1, s.y); octx.quadraticCurveTo(cx, s.cy, x2, s.y2);
      octx.strokeStyle = s.w > 12 ? `rgba(255,255,255,${s.b || 0.4})` : "rgba(255,255,255,0.95)";
      octx.lineWidth = s.w; octx.stroke();
    }
    drawCat(t);

    const wind = (mouseX - 0.5) * 40;
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.vy * dt; p.x += (p.drift + wind + Math.sin(t * p.freq + p.ph) * p.sway) * dt;
      p.rot += p.spin * dt; p.flip += p.flipV * dt;
      if (p.y > H + 40 || p.x < -40 || p.x > W + 40) { petals.splice(i, 1); i--; if (!p.once) spawn(false); continue; }
      octx.save(); octx.translate(p.x, p.y); octx.rotate(p.rot);
      octx.scale(1, Math.max(0.2, Math.abs(Math.cos(p.flip)))); petal(p.s, p.b); octx.restore();
    }

    appleMask.fill(0);                                      // apples: solid red dots (1) with a small green leaf (2), swaying with the branches
    const disc = (cx, cy, rad, val) => {
      const x0 = Math.max(0, Math.floor((cx - rad) * 2 / CELL_W)), x1 = Math.min(cols - 1, Math.ceil((cx + rad) * 2 / CELL_W));
      const y0 = Math.max(0, Math.floor((cy - rad) * 4 / CELL_H)), y1 = Math.min(rows - 1, Math.ceil((cy + rad) * 4 / CELL_H));
      for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) {
        const dx = (xx + 0.5) * CELL_W / 2 - cx, dy = (yy + 0.5) * CELL_H / 4 - cy;
        if (dx * dx + dy * dy <= rad * rad) appleMask[yy * cols + xx] = val;
      }
    };
    for (const f of flowers) {                              // leaves: a dappled green cluster wherever a blossom used to be
      const fx = f.x + f.dx;
      for (let i = 0; i < 4; i++) { const an = f.ph + i * 1.6; disc(fx + Math.cos(an) * f.s * 0.6, f.y + Math.sin(an) * f.s * 0.55, f.s * 0.72, 3); }
    }
    const appleMark = (x, y, rr, angle) => {
      disc(x, y, rr, 1);
      const sx = Math.sin(angle), sy = -Math.cos(angle);
      disc(x + sx * (rr + 2 * u), y + sy * (rr + 2 * u), 3.4 * u, 2);
      disc(x + sx * (rr + 7 * u), y + sy * (rr + 7 * u), 3.4 * u, 2);
      disc(x + sx * (rr + 5 * u) + Math.cos(angle) * 3 * u,
        y + sy * (rr + 5 * u) + Math.sin(angle) * 3 * u, 2.8 * u, 2);
    };
    for (const a of apples) {
      if (a.state === 1) {
        if (a.delay > 0) { a.delay -= dt; if (a.delay <= 0) { a.fx = a.x + swayX(a.x, a.y, a.k, t); a.fy = a.y; a.vy = 0; } }
        else {
          a.vy += 1100 * u * dt; a.fy += a.vy * dt;           // gravity
          if (a.fy + a.r >= groundY) { a.fy = groundY - a.r; a.state = 2; a.rest = 6 + Math.random() * 4; }
        }
      } else if (a.state === 2) { if ((a.rest -= dt) <= 0) { a.state = 0; a.grow = 0; } }   // fallen apple vanishes, a new one grows back
      else if (a.grow < 1) a.grow = Math.min(1, a.grow + dt * 0.4);
      const off = a.state === 2 || (a.state === 1 && a.delay <= 0), rr = a.r * a.grow;
      if (off) appleMark(a.fx, a.fy, rr, a.rotation || 0);
      else appleMark(a.x + swayX(a.x, a.y, a.k, t), a.y, rr, 0);
    }
    const data = octx.getImageData(0, 0, cols, rows).data;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    catMask.fill(0);
    for (let y = 0; y < rows; y++) {
      const row = y * cols;
      for (let x = 0; x < cols; x++) {
        const index = row + x, pixel = index * 4;
        const sourceX = x * CELL_W / 2, sourceY = y * CELL_H / 4;
        if (appleMask[index] === 0 && Math.abs(sourceX - cat.x) < 62 * u &&
          sourceY > groundY - 78 * u && sourceY < groundY &&
          data[pixel] > 200 && data[pixel + 1] > 200 && data[pixel + 2] > 200) catMask[index] = 1;
      }
    }
    for (let y = 0; y < rows; y++) {
      const cy = y * PITCH + (y >> 2) * GAP_Y + DOT / 2, by = (y & 3) * 4, row = y * cols;
      for (let x = 0; x < cols; x++) {
        const am = appleMask[row + x], leaf = am === 3, solid = am === 1 || am === 2;
        const pixel = (row + x) * 4;
        const isCat = catMask[row + x] === 1;
        const isFallingLeaf = !solid && !leaf &&
          data[pixel + 1] > data[pixel] * 1.2 && data[pixel + 1] > data[pixel + 2] * 1.15;
        const v = solid ? 1 : leaf ? 0.45 + ((x * 5 + y * 11) % 7) / 14 : data[pixel] / 255;
        if (solid || (v > 0.06 && v > BAYER[by + (x & 3)] * 0.95)) {
          const color = isCat ? 4 : solid ? am + 1 : leaf || isFallingLeaf ? 3 : (x * 7 + y * 13) % 9 === 0 ? 1 : 0;
          const sp = sprites[color][Math.min(4, (v * 5) | 0)];
          ctx.drawImage(sp.c, Math.round(x * PITCH + (x >> 1) * GAP_X + DOT / 2 - sp.s / 2), Math.round(cy - sp.s / 2), sp.s, sp.s);
        }
      }
    }
  }

  const redraw = () => { resize(); if (reduced) frame(1, 0); };
  let rz = 0, raf = 0, last = performance.now();
  const step = 1000 / FPS - 2;
  const onResize = () => { clearTimeout(rz); rz = setTimeout(redraw, 120); };
  const onMove = (e) => {
    const o = canvas.getBoundingClientRect(), x = e.clientX - o.left, y = e.clientY - o.top;
    mouseX = clamp(x / W, 0, 1);
    if (mousePx !== null) brush.vx = clamp(brush.vx + (x - mousePx) * 0.6, -40, 40);
    mousePx = x; brush.x = x; brush.y = y;
  };
  const onDown = (e) => {
    if (reduced) return;
    const o = canvas.getBoundingClientRect();
    if (e.clientY < o.top || e.clientY > o.bottom) return;   // only react to taps inside the hero
    shake = 1; shakeApples(); for (let i = 0; i < 20 && petals.length < 200; i++) spawn(false, true);
  };
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    const acc = now - last;
    if (acc < step) return;                                 // cap at ~30fps
    last = now; frame(now / 1000, Math.min(0.05, acc / 1000));
  };
  const start = () => { if (!raf && !reduced) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  redraw();
  if (document.fonts) document.fonts.ready.then(redraw);
  if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(hero); else addEventListener("resize", onResize);
  addEventListener("pointermove", onMove);
  addEventListener("pointerdown", onDown);
  const header = document.querySelector(".site-header");
  if (header) {
    const updateHeader = () => {
      const bounds = hero.getBoundingClientRect();
      header.classList.toggle("over-hero", bounds.top < header.offsetHeight && bounds.bottom > header.offsetHeight);
      header.classList.toggle("scrolled", window.scrollY > 0);
    };
    updateHeader();
    addEventListener("scroll", updateHeader, { passive: true });
    if ("IntersectionObserver" in window) {
      const headerObserver = new IntersectionObserver(([entry]) => {
        header.classList.toggle("over-hero", entry.isIntersecting);
      }, { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` });
      headerObserver.observe(hero);
    } else {
      addEventListener("resize", updateHeader);
    }
  }
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(hero);   // no work while scrolled past
  else start();
})();
