// A dotted second frame peeking out from behind the profile photo (top and right edges only),
// with a little pink blossom and two leaves where it turns the corner. Static, same dot-cluster grid as the rest of the site.
// Needs <canvas class="photo-deco"> placed before .about-image-frame inside .about-hero-image. No dependencies.
(() => {
  const canvas = document.querySelector(".photo-deco");
  if (!canvas) return;
  const frame = canvas.parentElement.querySelector(".about-image-frame");
  if (!frame) return;
  const ctx = canvas.getContext("2d");
  const TAU = Math.PI * 2, OFF = 16, PAD = 32;
  const LINE = "#d6b8b3", PETAL = "#e9a9ad", PETALD = "#d3a0a0", CORE = "#e3b93f", LEAF = "#8fc08c", LEAFL = "#b9d9b5";

  function draw() {
    const fw = frame.offsetWidth, fh = frame.offsetHeight; if (!fw || !fh) return;
    const rad = parseFloat(getComputedStyle(frame).borderTopLeftRadius) || 28;
    const W = fw + PAD, H = fh + PAD, dpr = Math.min(devicePixelRatio || 1, 1.5), ds = fw < 300 ? 0.8 : 1;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const PITCH = 4 * ds, GAP = 3 * ds, CELL_W = 2 * PITCH + GAP, CELL_H = 4 * PITCH + GAP;
    const cols = Math.floor(W / CELL_W) * 2, rows = Math.floor(H / CELL_H) * 4;
    const dotX = (i) => i * PITCH + (i >> 1) * GAP + PITCH / 2, dotY = (j) => j * PITCH + (j >> 2) * GAP + PITCH / 2;
    const mk = (col, r) => { const sz = Math.ceil(r * 2 + 2), c = document.createElement("canvas"); c.width = c.height = Math.ceil(sz * dpr); const g = c.getContext("2d"); g.scale(dpr, dpr); g.fillStyle = col; g.beginPath(); g.arc(sz / 2, sz / 2, r, 0, TAU); g.fill(); return { c, s: sz }; };
    const sp = { l: mk(LINE, 1.4 * ds), p: mk(PETAL, 1.7 * ds), d: mk(PETALD, 1.5 * ds), k: mk(CORE, 1.4 * ds), g: mk(LEAF, 1.4 * ds), h: mk(LEAFL, 1.3 * ds) };
    const put = (s, i, j) => { if (i < 0 || i >= cols || j < 0 || j >= rows) return; ctx.drawImage(s.c, Math.round(dotX(i) - s.s / 2), Math.round(dotY(j) - s.s / 2), s.s, s.s); };
    // the frame sits at (0, PAD) in this canvas; the second frame is shifted right by OFF and up by OFF
    const cx = fw / 2 + OFF, cy = PAD + fh / 2 - OFF, hw = fw / 2, hh = fh / 2;
    const sd = (x, y) => { const qx = Math.abs(x - cx) - (hw - rad), qy = Math.abs(y - cy) - (hh - rad); return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - rad; };
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = dotX(i), y = dotY(j);
      if (x < fw * 0.35) continue;                                   // start the line partway along the top; the rest is hidden behind the photo
      if (Math.abs(sd(x, y)) < PITCH * 0.62) put(sp.l, i, j);
    }
    // blossom where the top-right corner turns (a bit outside the line), two leaves along the top edge
    const bx = cx + hw - rad * 0.25, by = cy - hh + rad * 0.25;
    const bi = Math.round(bx / (CELL_W / 2)), bj = Math.round(by / (CELL_H / 4));
    put(sp.k, bi, bj);
    [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b], n) => put(n < 4 ? sp.p : sp.d, bi + a, bj + b));
    const ly = Math.round((cy - hh - 3) / (CELL_H / 4));
    [[cx + hw - rad - 46, 1], [cx + hw - rad - 78, -1]].forEach(([lx, s], n) => { const li = Math.round(lx / (CELL_W / 2)); put(sp.g, li, ly - 1); put(sp.h, li + s, ly - 2); put(sp.g, li + 2 * s, ly - 1 - (n ? 0 : 0)); });
  }
  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  addEventListener("load", draw);
  let rz = 0;
  if ("ResizeObserver" in window) new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(draw, 120); }).observe(frame); else addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(draw, 120); });
})();
