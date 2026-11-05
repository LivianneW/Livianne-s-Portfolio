// "The ridiculous burger": a dot-matrix toy in the same style as the tree and the footer.
// Click to stack ingredients. At 12 layers it wobbles and topples, then you can build another.
// Plain script, no dependencies. Needs <canvas id="burger-scene"> inside an element with class "bs".
(() => {
  const canvas = document.getElementById("burger-scene");
  if (!canvas) return;
  const host = canvas.closest(".bs") || canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const octx = off.getContext("2d", { willReadFrequently: true });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2, FPS = 30, MAX = 12;
  const INK = 1, PINK = 2, RED = 3, GREEN = 4, DRED = 5, DGREEN = 6, YEL = 7, BROWN = 8, BUN = 9, ROSE = 10, SKY = 11, SAGE = 12, FLOOR = 13;
  const COLORS = ["#3a3a3a", "#d3a0a0", "#d9272e", "#70b074", "#a51d24", "#4f8f55", "#f2c94c", "#8a5a44", "#e2a85c", "#E7CFCD", "#D4E1E9", "#D2D79F", "#D5D9A3"];
  const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v => (v + 0.5) / 16);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hs = (i, j) => (((i * 73856093) ^ (j * 19349663)) >>> 0) % 100;

  const DEFS = {
    patty:   { w: 200, h: 24, name: "a patty" },
    cheese:  { w: 214, h: 10, name: "cheese" },
    lettuce: { w: 236, h: 16, name: "lettuce" },
    tomato:  { w: 196, h: 12, name: "tomato" },
    pickle:  { w: 210, h: 14, name: "pickles" },
    apple:   { w: 188, h: 20, name: "apples" },
    flower:  { w: 200, h: 22, name: "flowers" },
  };
  const KEYS = Object.keys(DEFS);
  const SEEDS = [[-.42,.45],[-.2,.7],[.05,.55],[.3,.72],[.45,.4],[-.05,.25],[.22,.32]];

  let W, H, u, ds, dpr, PITCH, GAP, CELL_W, CELL_H, cols, rows, g, groundY, cx, sprites, base, blv, dyn, dlv;
  let tufts = [], mouse = { x: null, vx: 0 }, mousePx = null;
  let stack = [], parts = [], state = "build", stateT = 0, restedCount = 0, built = 0, wobble = 0, lastKey = "", clicked = false;
  const el = (k) => host.querySelector(k);
  const hud = { layers: el("[data-bs-layers]"), built: el("[data-bs-built]"), hint: el("[data-bs-hint]"), pops: el("[data-bs-pops]") };

  const dotX = (i) => i * PITCH + (i >> 1) * GAP + PITCH / 2;
  const dotY = (j) => j * PITCH + (j >> 2) * GAP + PITCH / 2;
  const set = (A, L, i, j, v, l = 3) => { i = Math.round(i); if (i >= 0 && i < cols && j >= 0 && j < rows) { A[j * cols + i] = v; L[j * cols + i] = l; } };

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



  // ---- shapes: given a point relative to the layer (lx from its centre, ly upward from its base) return a colour or 0
  const rr = (lx, ly, w, h, r) => { if (ly < 0 || ly > h || Math.abs(lx) > w / 2) return false; const dx = Math.abs(lx) - (w / 2 - r), dy = Math.abs(ly - h / 2) - (h / 2 - r); return dx <= 0 || dy <= 0 || dx * dx + dy * dy <= r * r; };
  function shape(p, lx, ly) {
    const { w, h } = p, q = hs(Math.round(lx / 4), Math.round(ly / 4));
    switch (p.type) {
      case "bunBottom": return rr(lx, ly, w, h, h * 0.45) ? BUN : 0;
      case "bunTop": {
        if (ly < 0) return 0;
        if ((lx / (w / 2)) ** 2 + (ly / h) ** 2 > 1) return 0;
        for (const [sx, sy] of SEEDS) if (Math.hypot(lx - sx * w / 2, ly - sy * h) < 2.7 * u) return BROWN;
        return BUN;
      }
      case "patty": return rr(lx, ly, w, h, h / 2) ? (Math.round(lx / (5 * u)) % 4 === 0 && ly > h * 0.3 && ly < h * 0.8 ? INK : BROWN) : 0;
      case "cheese": {
        if (rr(lx, ly - h * 0.3, w, h * 0.7, 2 * u)) return YEL;
        const len = h * 1.9;
        for (const d of [-w * 0.28, w * 0.1, w * 0.36]) if (ly < h * 0.3 && ly > -len && Math.abs(lx - d) <= 7 * u * (1 - Math.max(0, h * 0.3 - ly) / (len + h * 0.3) * 0.7)) return YEL;
        return 0;
      }
      case "lettuce": return Math.abs(lx) <= w / 2 && ly >= 0 && ly <= h * (0.55 + 0.45 * Math.sin(lx / u * 0.13)) ? (q < 35 ? DGREEN : GREEN) : 0;
      case "tomato": return rr(lx, ly, w, h, h / 2) ? (q < 8 ? ROSE : RED) : 0;
      case "pickle": for (const c of [-0.3, 0, 0.3]) { const e = ((lx - c * w) / (w * 0.13)) ** 2 + ((ly - h / 2) / (h / 2)) ** 2; if (e <= 1) return e <= 0.2 ? GREEN : DGREEN; } return 0;
      case "apple": {
        const r = h * 0.55;
        for (const c of [-0.33, -0.11, 0.11, 0.33]) {
          const cxp = c * w;
          if (Math.hypot(lx - cxp, ly - h * 0.45) <= r) return RED;
          if (Math.abs(lx - cxp) < 1.6 * u && ly > h * 0.45 + r - 1 && ly < h * 0.45 + r + 6 * u) return DGREEN;
        }
        return 0;
      }
      case "flower": for (const c of [-0.28, 0, 0.28]) {
        const dx = lx - c * w, dy = ly - h * 0.5, d = Math.hypot(dx, dy);
        if (d <= h * 0.16) return p.col === YEL ? BROWN : YEL;
        if (d <= h * 0.5 * (0.65 + 0.35 * Math.abs(Math.cos(2.5 * Math.atan2(dy, dx))))) return p.col;
      } return 0;
    }
    return 0;
  }
  function paint(p, px, baseY) {
    const x0 = Math.floor((px - p.w / 2 - 8 * u) * 2 / CELL_W), x1 = Math.ceil((px + p.w / 2 + 8 * u) * 2 / CELL_W);
    const y0 = Math.floor((baseY - p.h - 22 * u) * 4 / CELL_H), y1 = Math.ceil((baseY + 34 * u) * 4 / CELL_H);
    for (let j = Math.max(0, y0); j <= Math.min(rows - 1, y1); j++) for (let i = Math.max(0, x0); i <= Math.min(cols - 1, x1); i++) {
      const c = shape(p, dotX(i) - px, baseY - dotY(j));
      if (c) set(dyn, dlv, i, j, c, 3);
    }
  }

  // ---- building and toppling
  function relayout() {
    const top = { type: "bunTop", w: 216 * u * 1.3, h: 76 * u * 1.2 };
    parts = [{ type: "bunBottom", w: 212 * u * 1.3, h: 26 * u * 1.25, ox: 0, oy: 0 }, ...stack, top];
    top.ox = top.ox || 0; top.oy = top.oy || 0;
    let y = groundY - 5 * u;
    parts.forEach((p, k) => { if (p.ox === undefined) { p.ox = 0; p.oy = 0; } p.baseY = y; y -= p.h * 0.88; });
  }
  function sway(k, t) {
    if (state === "topple" || state === "rest") return 0;
    const amp = Math.pow(k, 1.35) * 0.55 * u;
    return Math.sin(t * 1.7 + k * 0.5) * amp * 0.45 + Math.sin(t * 13 + k * 0.9) * wobble * k * 1.1 * u;
  }
  function hudUpdate() {
    if (hud.layers) hud.layers.textContent = stack.length + " / " + MAX;
    if (hud.built) hud.built.textContent = built;
  }
  function pop(text) {
    if (!hud.pops) return;
    const top = parts[parts.length - 1], d = document.createElement("span");
    d.className = "bs-pop"; d.textContent = text;
    d.style.left = Math.round(cx + rnd(-30, 30) * u) + "px"; d.style.top = Math.max(8, Math.round(top.baseY - top.h - 26)) + "px";
    hud.pops.appendChild(d); setTimeout(() => d.remove(), 1300);
  }
  function addLayer() {
    if (state !== "build" || stack.length >= MAX || !W) return;
    let key; do { key = KEYS[(Math.random() * KEYS.length) | 0]; } while (key === lastKey);
    lastKey = key; const d = DEFS[key];
    stack.push({ type: key, w: d.w * u * 1.3, h: d.h * u * 1.25, col: [PINK, PINK, DRED, YEL][(Math.random() * 4) | 0], ox: 0, oy: 0 });
    relayout(); wobble = 1; clicked = true;
    if (hud.hint) hud.hint.textContent = stack.length >= MAX ? "Uh oh..." : "This is getting ridiculous...";
    pop("+ " + d.name); hudUpdate();
    if (stack.length >= MAX) {
      if (reduced) { setTimeout(() => { built++; stack = []; relayout(); hudUpdate(); if (hud.hint) hud.hint.textContent = "Click to stack another."; draw(); }, 1200); }
      else { state = "wobbling"; stateT = 0; }
    }
    if (reduced) draw();
  }
  function startTopple() {
    state = "topple"; stateT = 0; restedCount = 0;
    const n = parts.length, t = performance.now() / 1000;
    parts.forEach((p, k) => {
      if (k === 0) return;
      p.ox = Math.sin(t * 1.7 + k * 0.5) * Math.pow(k, 1.35) * 0.55 * u * 0.45;
      p.vx = (k % 2 ? -1 : 1) * rnd(0.6, 1.4) * rnd(40, 150) * u; p.vy = -rnd(60, 260) * u; p.rest = false; p.delay = (n - 1 - k) * 0.045;
    });
    pop("Whoa!");
    cat.target = clamp(cx + 170 * u, 40, W - 40);
    if (Math.abs(cat.target - cat.x) > 30) { cat.dir = Math.sign(cat.target - cat.x); cat.mode = "walk"; }
  }
  function physics(dt) {
    stateT += dt;
    if (state === "wobbling") { wobble = 1 + stateT * 3.5; if (stateT > 1.1) startTopple(); }
    else if (state === "topple") {
      let all = true;
      parts.forEach((p, k) => {
        if (k === 0 || p.rest) return;
        all = false;
        if ((p.delay -= dt) > 0) return;
        p.vy += 1500 * u * dt; p.oy += p.vy * dt; p.ox += p.vx * dt; p.vx *= 0.995;
        const land = groundY - 5 * u - restedCount * 3 * u;
        if (p.baseY + p.oy >= land) { p.oy = land - p.baseY; p.rest = true; restedCount++; }
      });
      if (all) { state = "rest"; stateT = 0; if (hud.hint) hud.hint.textContent = "Creative ingenuity"; }
    } else if (state === "rest" && stateT > 2.6) {
      built++; stack = []; state = "build"; wobble = 0; relayout(); hudUpdate();
      if (hud.hint) hud.hint.textContent = "Click to stack another";
    } else wobble = Math.max(0, wobble - dt * 1.6);
  }

  function makeSprites() {
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
    ds = W < 600 ? 0.8 : 1; u = Math.min(clamp(W / 1000, 0.6, 1.05), (H - 70) / 350);
    PITCH = 4 * ds; GAP = 3 * ds; CELL_W = 2 * PITCH + GAP; CELL_H = 4 * PITCH + GAP;
    cols = Math.floor(W / CELL_W) * 2; rows = Math.floor(H / CELL_H) * 4;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    off.width = cols; off.height = rows;
    g = rows - 8; groundY = (g + 0.5) * CELL_H / 4; cx = W * 0.5;
    makeSprites();

    let s = 23; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    base = new Uint8Array(cols * rows); blv = new Uint8Array(cols * rows); dyn = new Uint8Array(cols * rows); dlv = new Uint8Array(cols * rows);
    for (let i = 0; i < cols; i++) {                                              // ground line, then soil that thins out downward
      if (r() < 0.93) set(base, blv, i, g, FLOOR, 2);
      [0.55, 0.38, 0.26, 0.16, 0.09, 0.04].forEach((p, k) => { if (r() < p) set(base, blv, i, g + 1 + k, FLOOR, 2); });
    }
    for (let n = 0; n < cols / 40; n++) {                                         // fallen leaves
      const i0 = r() * cols, dir = r() < 0.5 ? -1 : 1;
      set(base, blv, i0, g - 1, GREEN); set(base, blv, i0 + dir, g - 1, GREEN); set(base, blv, i0 + 2 * dir, g - 2, GREEN); set(base, blv, i0 + dir, g - 2, GREEN);
    }
    tufts = [];
    for (let n = 0; n < cols / 4; n++) {                                          // grass, with the odd flower
      const i = Math.floor(r() * cols), q = r();
      const h = q < 0.45 ? 2 + ((r() * 3) | 0) : q < 0.82 ? 5 + ((r() * 4) | 0) : 9 + ((r() * 6) | 0);
      const flower = (h >= 9 ? r() < 0.5 : h >= 5 && r() < 0.1) ? ROSE + ((r() * 3) | 0) : 0;
      tufts.push({ i, px: dotX(i), lean: (r() - 0.5) * (h > 8 ? 0.5 : 0.9), ph: r() * TAU, flower, col: Array.from({ length: h }, () => (r() < 0.65 ? GREEN : DGREEN)) });
    }
    cat.x = clamp(cat.x || W * 0.2, 40, W - 40); cat.target = cat.x;
    relayout();
  }

  function frame(t, dt) {
    if (!W) return;
    physics(dt);
    dyn.set(base); dlv.set(blv);
    const push = (px) => (mouse.x === null ? 0 : mouse.vx * Math.exp(-(((px - mouse.x) / 90) ** 2)) * 0.03);
    for (const tf of tufts) {
      const lean = tf.lean + Math.sin(t * 1.3 + tf.ph) * 0.28 + push(tf.px);
      for (let k = 1; k <= tf.col.length; k++) set(dyn, dlv, tf.i + lean * k, g - k, tf.col[k - 1]);
      if (tf.flower) { const h = tf.col.length + 1, fx = tf.i + lean * h, fy = g - h; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) set(dyn, dlv, fx + di, fy + dj, di || dj ? tf.flower : YEL); }
    }
    mouse.vx *= 0.9 ** (dt * 60);
    parts.forEach((p, k) => paint(p, cx + p.ox + sway(k, t), p.baseY + p.oy));
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
        if (v > 0.06 && v > BAYER[by + (i & 3)] * 0.95) sp = sprites[0][Math.min(4, (v * 5) | 0)];   // the cat
        else if (gv) sp = sprites[gv - 1][dlv[row + i]];
        if (sp) ctx.drawImage(sp.c, Math.round(dotX(i) - sp.s / 2), Math.round(cy - sp.s / 2), sp.s, sp.s);
      }
    }
  }
  const draw = () => frame(performance.now() / 1000, 0);

  const redraw = () => { resize(); if (reduced && W) draw(); };
  let rz = 0, raf = 0, last = performance.now();
  const step = 1000 / FPS - 2;
  const loop = (now) => { raf = requestAnimationFrame(loop); const acc = now - last; if (acc < step) return; last = now; frame(now / 1000, Math.min(0.05, acc / 1000)); };
  const start = () => { if (!raf && !reduced && W) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  addEventListener("pointermove", (e) => {
    const o = canvas.getBoundingClientRect(), x = e.clientX - o.left;
    if (e.clientY >= o.top && e.clientY <= o.bottom) { if (mousePx !== null) mouse.vx = clamp(mouse.vx + (x - mousePx) * 0.6, -40, 40); mousePx = x; mouse.x = x; } else mouse.x = null;
  });
  canvas.addEventListener("pointerdown", addLayer);
  const btn = host.querySelector("[data-bs-add]"); if (btn) btn.addEventListener("click", addLayer);
  const stageEl = host.querySelector(".bs-stage"); if (stageEl) stageEl.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); addLayer(); } });

  redraw(); hudUpdate();
  if (document.fonts) document.fonts.ready.then(redraw);
  if ("ResizeObserver" in window) new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(redraw, 120); }).observe(canvas);
  else addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(redraw, 120); });
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(host); else start();
})();
