// Footer "orchard floor": the apple tree's ground, continued. Same dot-matrix look as the hero.
// Dotted soil, swaying grass, apples you can hover (wobble) and click (hop), and the cat wandering along.
// Plain script, no dependencies. Needs <canvas id="footer-scene"> inside an element with class "apple-footer".
(() => {
  const canvas = document.getElementById("footer-scene");
  if (!canvas) return;
  const host = canvas.closest(".apple-footer") || canvas;
  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const octx = off.getContext("2d", { willReadFrequently: true });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2, FPS = 30;
  const COLORS = ["#3a3a3a", "#d3a0a0", "#d9272e", "#70b074", "#a51d24", "#4f8f55", "#f2c94c", "#E7CFCD", "#D4E1E9", "#D2D79F", "#D5D9A3"];
  // grid values: 1 ink, 2 pink (apple highlight), 3 apple red, 4 leaf green, 5 (unused), 6 deep green, 7 flower centre, 8-10 flower petals, 11 floor / soil dots
  const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v => (v + 0.5) / 16);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let W, H, u, ds, dpr, PITCH, GAP, CELL_W, CELL_H, cols, rows, g, groundY, sprites, base, dyn;
  let tufts = [], apples = [], mouse = { x: null, vx: 0 }, mousePx = null;

  const put = (arr, i, j, v) => { i = Math.round(i); if (i >= 0 && i < cols && j >= 0 && j < rows) arr[j * cols + i] = v; };
  const dotX = (i) => i * PITCH + (i >> 1) * GAP + PITCH / 2;
  const dotY = (j) => j * PITCH + (j >> 2) * GAP + PITCH / 2;

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


  function drawApple(arr, ci, cj, r) {
    for (let dj = -5; dj <= 5; dj++) for (let di = -5; di <= 5; di++) if (di * di + dj * dj <= r * r) put(arr, ci + di, cj + dj, 3);
    put(arr, ci - Math.round(r * 0.45), cj - Math.round(r * 0.45), 2);          // highlight
    const top = cj - Math.round(r);
    put(arr, ci, top - 1, 4); put(arr, ci, top - 2, 4); put(arr, ci + 1, top - 3, 4);   // stem
    put(arr, ci + 2, top - 2, 4); put(arr, ci + 3, top - 2, 4);                          // leaf
  }

  function makeSprites() {                                                       // pre-rendered dots: drawImage is much cheaper than arcs
    sprites = COLORS.map(col => [0, 1, 2, 3, 4].map(l => {
      const rad = (0.6 + ((l + 0.5) / 5) * 1.1) * ds, size = Math.ceil(rad * 2 + 2);
      const c = document.createElement("canvas"); c.width = c.height = Math.ceil(size * dpr);
      const k = c.getContext("2d"); k.scale(dpr, dpr); k.fillStyle = col;
      k.beginPath(); k.arc(size / 2, size / 2, rad, 0, TAU); k.fill();
      return { c, s: size };
    }));
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
    ds = W < 600 ? 0.8 : 1; u = ds;
    PITCH = 4 * ds; GAP = 3 * ds; CELL_W = 2 * PITCH + GAP; CELL_H = 4 * PITCH + GAP;
    cols = Math.floor(W / CELL_W) * 2; rows = Math.floor(H / CELL_H) * 4;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    off.width = cols; off.height = rows;
    g = rows - 8; groundY = (g + 0.5) * CELL_H / 4;
    makeSprites();

    let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;     // seeded: same layout on every load
    base = new Uint8Array(cols * rows); dyn = new Uint8Array(cols * rows);
    for (let i = 0; i < cols; i++) {                                              // ground line, then soil that thins out downward
      if (r() < 0.93) put(base, i, g, 11);
      [0.55, 0.38, 0.26, 0.16, 0.09, 0.04].forEach((p, k) => { if (r() < p) put(base, i, g + 1 + k, 11); });
    }
    for (let n = 0; n < cols / 40; n++) {                                         // fallen leaves
      const i0 = r() * cols, dir = r() < 0.5 ? -1 : 1;
      put(base, i0, g - 1, 4); put(base, i0 + dir, g - 1, 4); put(base, i0 + 2 * dir, g - 2, 4); put(base, i0 + dir, g - 2, 4);
    }
    tufts = [];
    for (let n = 0; n < cols / 3; n++) {                                          // lots of grass: short, medium and tall blades (they sway in frame())
      const i = Math.floor(r() * cols), q = r();
      const h = q < 0.4 ? 2 + ((r() * 3) | 0) : q < 0.78 ? 5 + ((r() * 4) | 0) : 9 + ((r() * 6) | 0);
      const flower = (h >= 9 ? r() < 0.55 : h >= 5 && r() < 0.12) ? 8 + ((r() * 3) | 0) : 0;   // some stems carry a flower (pale pink, pale blue or pale olive)
      tufts.push({ i, px: dotX(i), lean: (r() - 0.5) * (h > 8 ? 0.5 : 0.9), ph: r() * TAU, flower,
        col: Array.from({ length: h }, () => { const z = r(); return z < 0.65 ? 4 : 6; }) });
    }
    apples = [0.08, 0.26, 0.5, 0.72, 0.9].map((fx, n) => {
      const rad = n % 2 ? 3.4 : 4.2, ci = Math.round(fx * cols + (r() - 0.5) * 6), cj = g - Math.round(rad);
      return { ci, cj, r: rad, wob: 0, hop: 0, hover: false, px: dotX(ci), py: dotY(cj), pr: rad * PITCH * 1.15 + 6 };
    });
    cat.x = clamp(cat.x || W * 0.4, 40, W - 40); cat.target = cat.x;
  }

  function frame(t, dt) {
    dyn.set(base);
    const push = (px) => (mouse.x === null ? 0 : mouse.vx * Math.exp(-(((px - mouse.x) / 90) ** 2)) * 0.03);
    for (const tf of tufts) {
      const lean = tf.lean + Math.sin(t * 1.3 + tf.ph) * 0.28 + push(tf.px);
      for (let k = 1; k <= tf.col.length; k++) put(dyn, tf.i + lean * k, g - k, tf.col[k - 1]);
      if (tf.flower) {                                                            // flower head: 3x3 petals around a yellow centre
        const h = tf.col.length + 1, fx = tf.i + lean * h, fy = g - h;
        for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) put(dyn, fx + di, fy + dj, di || dj ? tf.flower : 7);
      }
    }
    mouse.vx *= 0.9 ** (dt * 60);
    for (const a of apples) {
      a.wob = Math.max(0, a.wob - dt * 1.5);
      let lift = 0;
      if (a.hop > 0) { const p = 1 - a.hop; lift = Math.round(4 * p * (1 - p) * 7); a.hop = Math.max(0, a.hop - dt * 2.2); }
      drawApple(dyn, a.ci + Math.round(Math.sin(t * 18) * a.wob * 1.2), a.cj - lift, a.r);
    }
    updateCat(dt);
    octx.setTransform(1, 0, 0, 1, 0, 0); octx.globalCompositeOperation = "source-over"; octx.fillStyle = "#000"; octx.fillRect(0, 0, cols, rows);
    octx.setTransform(2 / CELL_W, 0, 0, 4 / CELL_H, 0, 0);
    drawCat(t);
    const data = octx.getImageData(0, 0, cols, rows).data;
    ctx.clearRect(0, 0, W, H);
    for (let j = 0; j < rows; j++) {
      const cy = dotY(j), by = (j & 3) * 4, row = j * cols;
      for (let i = 0; i < cols; i++) {
        const v = data[(row + i) * 4] / 255, gv = dyn[row + i];
        let sp = null;
        if (v > 0.06 && v > BAYER[by + (i & 3)] * 0.95) sp = sprites[0][Math.min(4, (v * 5) | 0)];   // the cat (dithered ink)
        else if (gv) sp = sprites[gv - 1][gv === 1 ? 2 : 4];
        if (sp) ctx.drawImage(sp.c, Math.round(dotX(i) - sp.s / 2), Math.round(cy - sp.s / 2), sp.s, sp.s);
      }
    }
  }

  const redraw = () => { resize(); if (reduced && W) frame(1, 0); };
  let rz = 0, raf = 0, last = performance.now();
  const step = 1000 / FPS - 2;
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    const acc = now - last; if (acc < step) return;                               // ~30fps
    last = now; frame(now / 1000, Math.min(0.05, acc / 1000));
  };
  const start = () => { if (!raf && !reduced && W) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const hit = (x, y) => apples.find(a => Math.hypot(x - a.px, y - a.py) <= a.pr);
  addEventListener("pointermove", (e) => {
    const o = canvas.getBoundingClientRect(), hr = host.getBoundingClientRect(), x = e.clientX - o.left, y = e.clientY - o.top;
    if (e.clientY >= hr.top && e.clientY <= hr.bottom) {
      if (mousePx !== null) mouse.vx = clamp(mouse.vx + (x - mousePx) * 0.6, -40, 40);
      mousePx = x; mouse.x = x;
    } else mouse.x = null;
    if (reduced) return;
    const over = y >= 0 && y <= o.height ? hit(x, y) : null;
    canvas.style.cursor = over ? "pointer" : "";
    for (const a of apples) { const h = a === over; if (h && !a.hover) a.wob = 1; a.hover = h; }
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (reduced) return;
    const o = canvas.getBoundingClientRect(), a = hit(e.clientX - o.left, e.clientY - o.top);
    if (a && !a.hop) { a.hop = 1; a.wob = 1; }                                    // click an apple: it hops
  });

  redraw();
  if (document.fonts) document.fonts.ready.then(redraw);
  if ("ResizeObserver" in window) new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(redraw, 120); }).observe(canvas);
  else addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(redraw, 120); });
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(host);   // no work while off-screen
  else start();
})();
