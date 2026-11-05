// A tiny dot-matrix kitchen: dotted Livianne whisking a bowl, a steaming coffee, and headphones on:
// music notes float up while she bobs to the beat.
// Same 2x4 dot-cluster look as the rest of the site. Needs <canvas class="kitchen-scene">. No dependencies.
(() => {
  const canvas = document.querySelector(".kitchen-scene");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2, FPS = 30;
  const NAMES = ["EYE", "SKIN", "TOP", "SHORTS", "FLOOR", "HAIR", "CLIP", "BLUSH", "SHOE", "SOCK", "WOOD", "WOODD", "BOWL", "BOWLD", "BATTER", "SILVER", "MUG", "COFFEE", "RADIO", "RADIOL", "PINK", "YEL", "BLUE", "STEAM", "PHONE", "PHONED"];
  const COLORS = ["#2a1f1c", "#f2c7a8", "#f3e8b8", "#a9d6dc", "#D5D9A3", "#3a3131", "#f08fa0", "#f4a39a", "#d9a3a3", "#e6e0f0", "#e2b88e", "#c99a6e", "#a9d6dc", "#6fa8b0", "#f6e7b4", "#8f999f", "#eab4b4", "#6b4332", "#4a3d3a", "#8a7a77", "#f08fa0", "#e3b93f", "#8fb9d6", "#aeb4b8", "#b9bec4", "#9aa0a7"];
  const C = {}; NAMES.forEach((n, i) => (C[n] = i + 1));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let W, H, dpr, ds, k, PITCH, GAP, CELL_W, CELL_H, cols, rows, sprites, groundRow, groundY, originX;

  const dotX = (i) => i * PITCH + (i >> 1) * GAP + PITCH / 2;
  const dotY = (j) => j * PITCH + (j >> 2) * GAP + PITCH / 2;
  const seg = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1, t = clamp(((px - ax) * dx + (py - ay) * dy) / l, 0, 1); return Math.hypot(px - (ax + dx * t), py - (ay + dy * t)); };
  const ell = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  const sup = (x, y, cx, cy, rx, ry, p = 3) => Math.abs((x - cx) / rx) ** p + Math.abs((y - cy) / ry) ** p <= 1;

  const BOWL = { x: 40, y: 34 };
  let notes = [], nextNote = 0, al = 1;

  // her, standing at the counter (units: x from her centre, y up from her feet; ~76 tall)
  function figure(x, y0, t, b) {
    const ax = Math.abs(x), y = y0 > 16 ? y0 - b : y0;
    const th = t * 9;
    const hand = [33 + Math.cos(th) * 2.2, 44 + Math.sin(th) * 1.2];
    const tip = [BOWL.x + Math.cos(th) * 3.2, 30 + Math.sin(th) * 1.2];
    if (ell(ax, y, 5.2, 54.5, 2, 2.7)) return C.EYE;
    if (ell(ax, y, 8.2, 49.8, 2.7, 1.8)) return C.BLUSH;
    if (sup(x, y, 0, 55, 11.6, 10.8) && y < 63 - 0.3 * Math.max(0, ax - 2)) return C.SKIN;
    // right hand holds the whisk, left arm sways
    if (Math.hypot(x - hand[0], y - hand[1]) < 3.4 || seg(x, y, 9.5, 41, hand[0], hand[1]) < 2.4) return C.SKIN;
    const sway = Math.sin(t * 5.2) * 1.5;
    const h2 = [-13.5 - sway, 26];
    if (Math.hypot(x - h2[0], y - h2[1]) < 3.2 || seg(x, y, -9.5, 41, h2[0], h2[1]) < 2.4) return C.SKIN;
    // whisk (handle + wire head), clipped to what's above the bowl floor
    if (y > 29 && (seg(x, y, hand[0], hand[1], tip[0], tip[1]) < 1.9 || ell(x, y, tip[0], tip[1] + 1, 4.4, 4.6))) return seg(x, y, hand[0], hand[1], tip[0], tip[1]) < 1.9 ? C.SILVER : C.SILVER;
    // headphones: band over the hair + ear cups
    { const d = Math.hypot(x / 19, (y - 58) / 19), d2 = Math.hypot(x / 15.2, (y - 58) / 15.2);
      if (y > 56 && d <= 1 && d2 >= 1) return C.PHONE; }
    if (ell(ax, y, 17.4, 54, 5, 7)) return ax > 18.4 ? C.PHONED : C.PHONE;
    const flick = y < 44 ? (44 - y) * 0.3 : 0;
    if (sup(x, y, 0, 61, 16.8, 14.5) || (ax > 10.4 && ax < 16.8 + flick && y > 39 && y < 60)) return C.HAIR;
    if (y > 20 && y < 46 && ax < 8.8 + Math.max(0, 40 - y) * 0.1) return C.TOP;
    if (y > 13 && y <= 20 && ax < 10.2) return C.SHORTS;
    for (const hx of [-4.6, 4.6]) {
      if (seg(x, y0, hx, 17, hx, 5.6) < 3.7) { return y0 > 13 ? C.SHORTS : y0 > 8.5 ? C.SKIN : y0 > 3.4 ? C.SOCK : C.SHOE; }
    }
    return 0;
  }

  function props(x, y, t, beat) {
    // counter
    if (x > 20 && x < 106 && y > 21.5 && y < 25.5) return y > 23.6 ? C.WOOD : C.WOODD;
    if (((x > 24 && x < 28) || (x > 98 && x < 102)) && y >= 0 && y <= 21.5) return C.WOODD;
    // bowl with batter
    if (y <= BOWL.y && ell(x, y, BOWL.x, BOWL.y, 13, 10)) return y > 31.4 && Math.abs(x - BOWL.x) < 11 ? C.BATTER : (y > 26 && y < 28 ? C.BOWLD : C.BOWL);
    // mug of coffee
    if (x > 72 && x < 86 && y > 25.5 && y < 40) return y > 37.6 && x > 73.6 && x < 84.4 ? C.COFFEE : C.MUG;
    { const dx = x - 88.5, dy = y - 32.5, r = Math.hypot(dx, dy); if (x > 85 && r < 5.4 && r > 2.8) return C.MUG; }
    return 0;
  }

  // steam and notes: translucent, drawn on top
  function airy(x, y, t) {
    for (let w = 0; w < 2; w++) {
      if (y > 42 && y < 66) {
        const sx = 79 + (w ? 3.4 : -3.4) + Math.sin(y * 0.22 - t * 2.4 + w * 2) * 2.4;
        if (Math.abs(x - sx) < 1.9) { al = 0.75 * (1 - (y - 42) / 24); return C.STEAM; }
      }
    }
    for (const n of notes) {
      const a = t - n.born; if (a < 0 || a > 3.2) continue;
      const nx = 22 + a * 11 + Math.sin(a * 2.6 + n.s) * 5, ny = 66 + a * 13;
      const f = Math.min(1, a * 2.5) * clamp((3.2 - a) / 1.2, 0, 1);
      if (ell(x, y, nx, ny, 3.1, 2.5) || (x > nx + 1.4 && x < nx + 3.6 && y > ny && y < ny + 9) || ell(x, y, nx + 5.2, ny + 8, 2.4, 1.6)) { al = f; return n.c; }
    }
    return 0;
  }

  function draw(t, dt) {
    if (!W) return;
    if (!reduced) {
      notes = notes.filter((n) => t - n.born < 3.3);
      if (t >= nextNote) { nextNote = t + 0.85; const i = notes.length + Math.floor(t); notes.push({ born: t, s: i * 1.7, c: [C.PINK, C.YEL, C.BLUE][i % 3] }); }
    }
    ctx.clearRect(0, 0, W, H);
    const beat = 0.5 + 0.5 * Math.sin(t * 10.5), bob = beat * 2;
    const x0 = Math.max(0, Math.floor((originX - 40 * k) / (CELL_W / 2))), x1 = Math.min(cols - 1, Math.ceil((originX + 112 * k) / (CELL_W / 2)));
    // floor
    for (let i = x0; i <= x1; i++) { const h = ((i * 73856093) >>> 0) % 100; if (h < 70) { const sp = sprites[C.FLOOR - 1]; ctx.drawImage(sp.c, Math.round(dotX(i) - sp.s / 2), Math.round(dotY(groundRow) - sp.s / 2), sp.s, sp.s); } }
    for (let j = 0; j < rows; j++) for (let i = x0; i <= x1; i++) {
      const px = dotX(i), py = dotY(j), x = (px - originX) / k, y = (groundY - py) / k;
      if (y < -1 || y > 130) continue;
      al = 1;
      let c = airy(x, y, t) || figure(x, y, t, bob) || props(x, y, t, beat);
      if (!c) continue;
      const sp = sprites[c - 1];
      if (al < 1) ctx.globalAlpha = Math.max(0, al);
      ctx.drawImage(sp.c, Math.round(px - sp.s / 2), Math.round(py - sp.s / 2), sp.s, sp.s);
      if (al < 1) ctx.globalAlpha = 1;
    }
  }

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
    dpr = Math.min(devicePixelRatio || 1, 1.5); ds = W < 500 ? 0.8 : 1;
    PITCH = 4 * ds; GAP = 3 * ds; CELL_W = 2 * PITCH + GAP; CELL_H = 4 * PITCH + GAP;
    cols = Math.floor(W / CELL_W) * 2; rows = Math.floor(H / CELL_H) * 4;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sprites = COLORS.map((col) => { const rad = 1.4 * ds, sz = Math.ceil(rad * 2 + 2), c = document.createElement("canvas"); c.width = c.height = Math.ceil(sz * dpr); const g = c.getContext("2d"); g.scale(dpr, dpr); g.fillStyle = col; g.beginPath(); g.arc(sz / 2, sz / 2, rad, 0, TAU); g.fill(); return { c, s: sz }; });
    groundRow = rows - 2; groundY = dotY(groundRow) - 0.5 * PITCH;
    k = Math.min(clamp((H - 24) / 112, 0.7, 2.3), W / 130);
    originX = (W - 122 * k) / 2 + 20 * k;       // centre the scene
    if (reduced) { notes = [{ born: -0.9, s: 1, c: C.PINK }, { born: -1.9, s: 3, c: C.YEL }]; }
    draw(reduced ? 0.4 : performance.now() / 1000, 0);
  }

  let raf = 0, last = performance.now(), clock = 0;
  const loop = (now) => { raf = requestAnimationFrame(loop); const acc = now - last; if (acc < 1000 / FPS - 2) return; last = now; const dt = Math.min(0.05, acc / 1000); clock += dt; draw(clock, dt); };
  const start = () => { if (!raf && !reduced && W) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  let rz = 0;
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(resize, 120); }).observe(canvas); else addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(resize, 120); });
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas); else start();
})();
