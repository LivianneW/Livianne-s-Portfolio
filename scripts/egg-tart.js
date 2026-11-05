// A dot-matrix Hong Kong egg tart for the About page.
// Fluted golden crust, glossy yellow custard, steam rising. Hover to jiggle the custard, click for a bite
// (crumbs fall); after a few bites a fresh one pops back. Same 2x4 dot-cluster look as the tree, footer and burger.
// Needs <canvas class="egg-tart"> inside .about-hero-image. No dependencies.
(() => {
  const canvas = document.querySelector(".egg-tart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2, FPS = 30;
  const CRUST = 1, CRUSTD = 2, CRUSTL = 3, CUST = 4, CUSTL = 5, TOAST = 6, STEAM = 7, FLOOR = 8, TOASTD = 9;
  const COLORS = ["#e2a85c", "#c98a3f", "#f0c57e", "#f2c94c", "#f9e6a0", "#b8692f", "#b3adad", "#D5D9A3", "#6b3319"];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let W, H, dpr, ds, PITCH, GAP, CELL_W, CELL_H, cols, rows, sprites, s, cx, baseY, ground;
  let jig = 0, bites = 0, regrow = 0, steam = [], crumbs = [], spawn = 0, t0 = 0, hovered = false;
  const hint = canvas.parentElement.querySelector("[data-tart-hint]");
  let capTimer = 0;
  const showCap = (on, ms) => { document.dispatchEvent(new CustomEvent("tart-hover", { detail: { on } })); clearTimeout(capTimer); if (on && ms) capTimer = setTimeout(() => document.dispatchEvent(new CustomEvent("tart-hover", { detail: { on: false } })), ms); };

  const dotX = (i) => i * PITCH + (i >> 1) * GAP + PITCH / 2;
  const dotY = (j) => j * PITCH + (j >> 2) * GAP + PITCH / 2;

  // bites: where each one lands, as fractions of the tart width (x from centre, y up from the base)
  const BITES = [[0.3, 0.36, 0.2], [-0.27, 0.34, 0.19], [0.02, 0.32, 0.25]];
  // soft pseudo-noise so the caramelised blisters look organic but stay put
  const noise = (x, y) => Math.sin(x * 0.21 + Math.sin(y * 0.27) * 2.1) + Math.sin(y * 0.33 - x * 0.13) * 0.8 + Math.sin((x + y) * 0.09);

  function colorAt(x, y, t) {                       // x from centre, y up from base, in px
    const hb = 0.3 * s, rx = 0.5 * s, ry = 0.2 * s;
    for (let k = 0; k < bites; k++) { const [bx, by, br] = BITES[k]; if (Math.hypot(x - bx * s, y - by * s) < br * s) return 0; }
    // custard (glossy, jiggles even when idle)
    const wob = 1 + 0.05 * Math.sin(t * 4.2) + 0.15 * jig * Math.sin(t * 22);
    const cxr = rx - 0.075 * s, cyr = (ry - 0.05 * s) * wob;
    const dy = y - (hb + 0.01 * s);
    const d = Math.hypot(x / cxr, dy / cyr);
    if (d <= 1) {
      const n = noise(x, dy);
      if (d > 0.8 && n > -0.2) return n > 0.9 ? TOASTD : TOAST;                       // caramelised edge
      if (Math.hypot((x - 0.09 * s) / (0.15 * s), (dy + 0.015 * s) / (0.035 * s)) < 1) return TOASTD;   // dark blister in the middle
      if (Math.hypot((x + 0.12 * s) / (0.07 * s), (dy + 0.05 * s) / (0.025 * s)) < 1) return TOAST;
      if (Math.hypot((x + 0.14 * s) / (0.12 * s), (dy - 0.05 * s) / (0.04 * s)) < 1) return CUSTL; // shine
      return CUST;
    }
    if (Math.hypot(x / rx, (y - hb) / ry) <= 1) {                         // thick rolled rim, toasted where it meets the custard
      const rimN = noise(x * 1.3, y);
      if (d < 1.12 && rimN > 0.1) return TOAST;
      return rimN > 1.1 ? CRUSTD : CRUSTL;
    }
    if (y >= 0 && y <= hb) {                                              // flared, flaky layered bowl
      const half = (0.27 + 0.23 * Math.sqrt(y / hb)) * s;
      if (Math.abs(x) <= half) {
        const layer = Math.floor((y + Math.sin(x * 0.12) * 2.2) / (0.034 * s)) % 2 === 0;
        return layer ? CRUST : CRUSTD;
      }
    }
    return 0;
  }

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
    dpr = Math.min(devicePixelRatio || 1, 1.5); ds = W < 260 ? 0.8 : 1;
    PITCH = 4 * ds; GAP = 3 * ds; CELL_W = 2 * PITCH + GAP; CELL_H = 4 * PITCH + GAP;
    cols = Math.floor(W / CELL_W) * 2; rows = Math.floor(H / CELL_H) * 4;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sprites = COLORS.map((col) => [0, 1, 2, 3, 4].map((l) => { const rad = (0.55 + ((l + 0.5) / 5) * 1.0) * ds * 1.35, sz = Math.ceil(rad * 2 + 2), c = document.createElement("canvas"); c.width = c.height = Math.ceil(sz * dpr); const k = c.getContext("2d"); k.scale(dpr, dpr); k.fillStyle = col; k.beginPath(); k.arc(sz / 2, sz / 2, rad, 0, TAU); k.fill(); return { c, s: sz }; }));
    s = W * 0.74; cx = W / 2; baseY = H - 34; ground = (rows - 7);
    draw(performance.now() / 1000, 0);
  }

  const put = (c, l, px, py) => { const sp = sprites[c - 1][l]; ctx.drawImage(sp.c, Math.round(px - sp.s / 2), Math.round(py - sp.s / 2), sp.s, sp.s); };

  function draw(t, dt) {
    if (!W) return;
    if (dt) {
      jig = Math.max(0, jig - dt * (hovered ? 0.25 : 0.9));
      if (regrow > 0) regrow = Math.max(0, regrow - dt * 1.4);
      if (!reduced && bites < 3 && (spawn -= dt) <= 0) { spawn = rnd(0.12, 0.25); steam.push({ x: rnd(-0.16, 0.16) * s, y: 0, ph: rnd(0, TAU), life: 0, max: rnd(2.2, 3.2) }); }
      steam.forEach((p) => { p.life += dt; p.y += 30 * dt; });
      steam = steam.filter((p) => p.life < p.max);
      crumbs.forEach((c) => { c.vy -= 520 * dt; c.x += c.vx * dt; c.y += c.vy * dt; if (c.y <= 0) { c.y = 0; c.vy = 0; c.vx = 0; c.rest += dt; } else c.rest = 0; c.age += dt; });
      crumbs = crumbs.filter((c) => c.age < 2.6);
    }
    ctx.clearRect(0, 0, W, H);
    // ground dots
    for (let i = Math.round(cols * 0.1); i < cols * 0.9; i++) { const h = ((i * 73856093) >>> 0) % 100; if (h < 78) put(FLOOR, 3, dotX(i), dotY(ground)); if (h < 30) put(FLOOR, 2, dotX(i), dotY(ground + 1)); if (h < 10) put(FLOOR, 1, dotX(i), dotY(ground + 2)); }
    // tart
    const sc = regrow > 0 ? 0.55 + 0.45 * (1 - regrow) : 1;
    const bounce = reduced ? 0 : Math.max(0, Math.sin(t * 2.4)) * 5, rock = reduced ? 0 : Math.sin(t * 1.5) * 0.035, squash = reduced ? 1 : 1 - Math.max(0, Math.sin(t * 2.4 + 1.2)) * 0.03;
    const x0 = Math.floor((cx - s * 0.6) / (CELL_W / 2)), x1 = Math.ceil((cx + s * 0.6) / (CELL_W / 2));
    const y0 = Math.floor((baseY - s * 0.75) / (CELL_H / 4)), y1 = Math.ceil((baseY + 6) / (CELL_H / 4));
    for (let j = Math.max(0, y0); j <= Math.min(rows - 1, y1); j++) for (let i = Math.max(0, x0); i <= Math.min(cols - 1, x1); i++) {
      const px = dotX(i), py = dotY(j), y = ((baseY - bounce - py) / sc) / squash, x = (px - cx) / sc - rock * y;
      const c = colorAt(x, y, t); if (c) put(c, 4, px, py);
    }
    // steam
    if (!reduced) for (const p of steam) {
      const a = p.life / p.max, l = a < 0.12 ? 2 : a > 0.75 ? 1 : 3;
      put(STEAM, l, cx + p.x + Math.sin(p.ph + p.life * 2.2) * 10, baseY - 0.5 * s - p.y);
    }
    // crumbs
    for (const c of crumbs) put(c.col, clamp(3 - Math.floor(c.age), 1, 3), cx + c.x, baseY - c.y);
  }

  function bite() {
    if (regrow > 0) return;
    if (bites >= 3) return;
    const [bx, by] = BITES[bites]; bites++;
    jig = 1;
    for (let k = 0; k < 14; k++) crumbs.push({ x: bx * s + rnd(-14, 14), y: by * s + rnd(-6, 10), vx: rnd(-60, 60) + bx * 80, vy: rnd(60, 190), col: [CRUST, CRUSTL, CRUSTD, CUST][(Math.random() * 4) | 0], age: 0, rest: 0 });
    if (bites >= 3) setTimeout(() => { bites = 0; regrow = 1; if (reduced) { regrow = 0; draw(performance.now() / 1000, 0); } }, reduced ? 1400 : 1700);
    if (reduced) draw(performance.now() / 1000, 0);
  }

  canvas.addEventListener("pointerenter", (e) => { hovered = true; jig = 1; showCap(true, e.pointerType === "mouse" ? 0 : 3500); });
  canvas.addEventListener("pointerleave", () => { hovered = false; showCap(false); });
  canvas.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") showCap(true, 3500); bite(); });
  canvas.addEventListener("focus", () => showCap(true));
  canvas.addEventListener("blur", () => showCap(false));
  canvas.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bite(); } });

  let raf = 0, last = performance.now(), clock = 0;
  const loop = (now) => { raf = requestAnimationFrame(loop); const acc = now - last; if (acc < 1000 / FPS - 2) return; last = now; const dt = Math.min(0.05, acc / 1000); clock += dt; draw(clock, dt); };
  const start = () => { if (!raf && !reduced && W) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  let rz = 0;
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(resize, 120); }).observe(canvas); else addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(resize, 120); });
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas); else start();
})();
