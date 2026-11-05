// A drift of pink petals floating across: the divider between the intro and "My story".
// Same dot-cluster grid as the rest of the site. Needs <canvas class="story-divider">. No dependencies.
(() => {
  const canvas = document.querySelector(".story-divider");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2, FPS = 30;
  const STREAM = "#8fb9d6", STREAML = "#b9d4e6", PETAL = "#e9a9ad", PETALD = "#d3a0a0";
  let W, H, dpr, ds, PITCH, GAP, CELL_W, CELL_H, cols, rows, sprites, base;
  const dotX = (i) => i * PITCH + (i >> 1) * GAP + PITCH / 2;
  const dotY = (j) => j * PITCH + (j >> 2) * GAP + PITCH / 2;
  const wave = (x, t) => Math.sin(x * 0.012 - t * 0.9) * 8 + Math.sin(x * 0.031 + t * 0.5) * 2.5;
  const mk = (col, rad) => { const sz = Math.ceil(rad * 2 + 2), c = document.createElement("canvas"); c.width = c.height = Math.ceil(sz * dpr); const g = c.getContext("2d"); g.scale(dpr, dpr); g.fillStyle = col; g.beginPath(); g.arc(sz / 2, sz / 2, rad, 0, TAU); g.fill(); return { c, s: sz }; };
  const PETALS = Array.from({ length: 16 }, (_, n) => ({ p: (n * 0.0715 + ((n * 37) % 7) * 0.004) % 1, v: 12 + (n % 4) * 4, amp: 5 + (n % 3) * 3, ph: n * 1.9, big: n % 2 === 0 }));

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
    dpr = Math.min(devicePixelRatio || 1, 1.5); ds = W < 500 ? 0.8 : 1;
    PITCH = 4 * ds; GAP = 3 * ds; CELL_W = 2 * PITCH + GAP; CELL_H = 4 * PITCH + GAP;
    cols = Math.floor(W / CELL_W) * 2; rows = Math.floor(H / CELL_H) * 4;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sprites = { s: mk(STREAM, 1.4 * ds), l: mk(STREAML, 1.2 * ds), p: mk(PETAL, 1.7 * ds), d: mk(PETALD, 1.5 * ds) };
    base = H / 2;
    draw(performance.now() / 1000);
  }
  const put = (sp, i, j) => { if (i < 0 || i >= cols || j < 0 || j >= rows) return; ctx.drawImage(sp.c, Math.round(dotX(i) - sp.s / 2), Math.round(dotY(j) - sp.s / 2), sp.s, sp.s); };

  function draw(t) {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    // petals drifting across, bobbing gently on the breeze
    for (const q of PETALS) {
      const x = (((q.p * W + t * q.v) % (W + 40)) + W + 40) % (W + 40) - 20;
      const i = Math.round(x / (CELL_W / 2)), y = base + Math.sin(x * 0.014 + q.ph + t * 0.8) * q.amp;
      const j = Math.round(y / (CELL_H / 4));
      if (q.big) { put(sprites.d, i, j); put(sprites.p, i - 1, j); put(sprites.p, i + 1, j); put(sprites.p, i, j - 1); put(sprites.p, i, j + 1); }
      else { put(sprites.p, i, j); put(sprites.d, i + 1, j + 1); put(sprites.p, i - 1, j + 1); }
    }
  }

  let raf = 0, last = performance.now(), clock = 0;
  const loop = (now) => { raf = requestAnimationFrame(loop); const acc = now - last; if (acc < 1000 / FPS - 2) return; last = now; clock += Math.min(0.05, acc / 1000); draw(clock); };
  const start = () => { if (!raf && !reduced && W) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  let rz = 0;
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(resize, 120); }).observe(canvas); else addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(resize, 120); });
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas); else start();
})();
