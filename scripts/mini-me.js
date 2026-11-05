// A tiny dot-matrix Livianne who strolls along the "Hi there!" line of the About intro.
// She wanders, stops to wave, walks toward your cursor when it's near, hops when you click her, and
// shows the egg tart's caption in a speech bubble above her head (listens for the "tart-hover" event).
// Same 2x4 dot-cluster look as the rest of the site. Needs <canvas class="mini-me"> inside .about-hero. No dependencies.
(() => {
  const canvas = document.querySelector(".mini-me");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2, FPS = 30;
  const EYE = 1, SKIN = 2, TOP = 3, SHORTS = 4, FLOOR = 5, HAIR = 6, CLIP = 7, BLUSH = 8, SHOE = 9, SOCK = 10, MOUTH = 11, WHITE = 12, HAIRL = 13, BROW = 14, PBLUE = 15, PCUP = 16, PBROWN = 17, PYEL = 18, PPINK = 19, PBAND = 20, WING = 21, TGREEN = 22, TGREENL = 23, TPINK = 24, CLOUD = 25, STAR = 26, MOON = 27;
  const COLORS = ["#2a1f1c", "#f2c7a8", "#f3e8b8", "#a9d6dc", "#D5D9A3", "#3a3131", "#f08fa0", "#f4a39a", "#d9a3a3", "#e6e0f0", "#c98a84", "#ffffff", "#5a4541", "#4a3a37", "#6fa8b0", "#efdcc4", "#8a5a44", "#f2c94c", "#f08fa0", "#d9a07a", "#c9e0ee", "#70b074", "#a3d19f", "#e9a9ad", "#b3cde2", "#e3b93f", "#ecd98f"];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let W, H, dpr, ds, k, PITCH, GAP, CELL_W, CELL_H, cols, rows, sprites, groundRow, groundY;
  const me = { x: 0, dir: 1, mode: "idle", timer: 1.2, target: 0, phase: 0, wave: 0, jump: 0 };
  let mouseX = null, mouseY = null, tartOn = false, minX = 30, maxX = 0, tartX = 0, step = 0, stepX = 1e9;
  const groundOff = (x) => { const u = clamp((x - stepX) / 36, 0, 1); return step * u * u * (3 - 2 * u); };
  const hero = canvas.parentElement, bubble = hero.querySelector(".mini-bubble");

  const dotX = (i) => i * PITCH + (i >> 1) * GAP + PITCH / 2;
  const dotY = (j) => j * PITCH + (j >> 2) * GAP + PITCH / 2;

  // distance from point to segment
  const seg = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1, t = clamp(((px - ax) * dx + (py - ay) * dy) / l, 0, 1); return Math.hypot(px - (ax + dx * t), py - (ay + dy * t)); };
  const ell = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

  // colour of a point of the figure. x: from her centre (mirrored for facing), y: up from her feet. Simple pixel-art chibi (~76 units tall):
  // long brown hair, big eyes, cream camisole, light-blue shorts, white socks.
  const sup = (x, y, cx, cy, rx, ry) => Math.abs((x - cx) / rx) ** 3 + Math.abs((y - cy) / ry) ** 3 <= 1;   // rounded-square blob
  function colorAt(x, y, t) {
    const walking = me.mode === "walk", ph = me.phase, sw = walking ? 1 : 0.15;
    const raised = me.wave > 0 || me.jump > 0, wv = me.wave > 0 ? Math.sin(t * 11) * 4 : 0;
    const ax = Math.abs(x);
    // face details
    if (ell(ax, y, 5.2, 54.5, 2, 2.7)) return EYE;                       // simple one-colour eyes                       // simple one-colour eyes
    if (ell(ax, y, 8.2, 49.8, 2.7, 1.8)) return BLUSH;
    if (sup(x, y, 0, 55, 11.6, 10.8) && y < 63 - 0.3 * Math.max(0, ax - 2)) return SKIN;   // face; the hair sweeps over the forehead as bangs
    // arms and hands (bare), in front of the hair
    const hand = raised ? [17.5 + wv, 64] : [13.5 + Math.sin(ph + Math.PI) * 5 * sw, 25];
    if (Math.hypot(x - hand[0], y - hand[1]) < 3.2 || seg(x, y, 9.5, 41, hand[0], hand[1]) < 2.4) return SKIN;
    const hand2 = [-13.5 - Math.sin(ph + Math.PI) * 5 * sw, 25];
    if (Math.hypot(x - hand2[0], y - hand2[1]) < 3.2 || seg(x, y, -9.5, 41, hand2[0], hand2[1]) < 2.4) return SKIN;
    // heart clip, then long hair (parted, shoulder length, flicked ends)
    const flick = y < 44 ? (44 - y) * 0.3 : 0;                             // bob: ends just below the chin, flicking out a little
    if (sup(x, y, 0, 61, 16.8, 14.5) || (ax > 10.4 && ax < 16.8 + flick && y > 39 && y < 60)) return HAIR;
    // camisole (slight A-line), shorts, legs
    if (y > 20 && y < 46 && ax < 8.8 + Math.max(0, 40 - y) * 0.1) return TOP;
    if (y > 13 && y <= 20 && ax < 10.2) return SHORTS;
    const jumping = me.jump > 0;
    for (const [hx, off] of [[-4.6, 0], [4.6, Math.PI]]) {
      const fx = hx + (walking ? Math.sin(ph + off) * 4 : 0), fy = jumping ? 4 : (walking ? Math.max(0, Math.cos(ph + off)) * 3 : 0);
      if (seg(x, y, hx, 17, fx, fy + 2.8) < 3.7) {
        const r = y - fy;
        return r > 13 ? SHORTS : r > 8.5 ? SKIN : r > 3.4 ? SOCK : SHOE;
      }
    }
    return 0;
  }

  // put her feet on the baseline of the "Hi there!" heading and walk her on the free space to its right
  function layout() {
    if (!W) return;
    const h1 = hero.querySelector(".about-greeting"), col = hero.querySelector(".about-hero-text") || hero;
    const hr = hero.getBoundingClientRect(), cr = col.getBoundingClientRect();
    let base = 90, textRight = 0;
    if (h1) {
      const r = document.createRange(); r.selectNodeContents(h1);
      const b = r.getBoundingClientRect(), fs = parseFloat(getComputedStyle(h1).fontSize) || 60;
      base = b.bottom - hr.top - 0.23 * fs; textRight = b.right - hr.left;
    }
    const frame = hero.querySelector(".about-image-frame"), tart = hero.querySelector(".egg-tart");
    const fr = frame ? frame.getBoundingClientRect() : null;
    minX = textRight + 40; maxX = (fr ? fr.right : cr.right) - hr.left - 34;
    tartX = tart ? clamp(tart.getBoundingClientRect().left + tart.getBoundingClientRect().width / 2 - hr.left, minX, maxX) : maxX;
    // photo beside the text (desktop): she walks along its top edge, same line as "Hi there!"
    // the photo's top edge can sit a little lower than the heading baseline: the path steps down onto it
    step = 0; stepX = 1e9;
    if (maxX - minX < 110) {                       // stacked layout (narrow screens): walk the line just above the heading
      const t = h1 ? h1.getBoundingClientRect().top - hr.top : 90;
      base = t - 6; step = 0; stepX = 1e9; minX = 30; maxX = Math.max(60, cr.right - hr.left - 30); tartX = maxX;
    }
    groundRow = rows - 2 - Math.ceil(step / (CELL_H / 4)); groundY = dotY(groundRow) - 0.5 * PITCH;
    canvas.style.top = Math.round(base - groundY + 1) + "px";
    treeX = minX + (maxX - minX) * 0.68;
    me.x = clamp(me.x, minX, maxX); me.target = clamp(me.target, minX, maxX);
    placeBubble();
  }

  function placeBubble() {
    if (!bubble) return;
    const bw = bubble.offsetWidth, bh = bubble.offsetHeight, hw = hero.clientWidth;
    const headTop = parseFloat(canvas.style.top || 0) + groundY - 1 + groundOff(me.x) - 76 * k;
    bubble.style.left = Math.round(clamp(me.x - bw / 2, 0, Math.max(0, hw - bw))) + "px";
    bubble.style.top = Math.round(headTop - bh - 6) + "px";
  }

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight; if (!W || !H) return;
    dpr = Math.min(devicePixelRatio || 1, 1.5); ds = W < 500 ? 0.8 : 1;
    PITCH = 4 * ds; GAP = 3 * ds; CELL_W = 2 * PITCH + GAP; CELL_H = 4 * PITCH + GAP;
    cols = Math.floor(W / CELL_W) * 2; rows = Math.floor(H / CELL_H) * 4;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sprites = COLORS.map((col) => { const rad = 1.4 * ds, sz = Math.ceil(rad * 2 + 2), c = document.createElement("canvas"); c.width = c.height = Math.ceil(sz * dpr); const g = c.getContext("2d"); g.scale(dpr, dpr); g.fillStyle = col; g.beginPath(); g.arc(sz / 2, sz / 2, rad, 0, TAU); g.fill(); return { c, s: sz }; });
    groundRow = rows - 2; groundY = dotY(groundRow) - 0.5 * PITCH;
    bee.x = bee.tx = bee.x || W * 0.3; bee.y = bee.ty = bee.y || 40;
    k = clamp((H - 20) / 86, 0.7, 1.3);
    me.x = me.x || W * 0.5; layout(); me.target = me.x;
    draw(performance.now() / 1000, 0);
  }

  function update(dt) {
    const speed = 46 * k;
    if (me.wave > 0) me.wave -= dt;
    if (me.jump > 0) me.jump -= dt;
    if (me.mode === "walk") {
      if (tartOn) { me.target = tartX; me.dir = Math.sign(tartX - me.x) || 1; }
      me.x += me.dir * speed * dt; me.phase += dt * 9;
      if ((me.dir > 0 && me.x >= me.target) || (me.dir < 0 && me.x <= me.target)) { me.mode = "idle"; me.timer = rnd(1.2, 3.2); if (Math.random() < 0.55) me.wave = 1.6; }
    } else if (tartOn) {
      if (Math.abs(tartX - me.x) > 6) { me.target = tartX; me.dir = 1; me.mode = "walk"; } else { me.dir = 1; if (me.wave <= 0) me.wave = 1; }
    } else if ((me.timer -= dt) <= 0 && me.jump <= 0) {
      const toMouse = mouseX !== null && Math.random() < 0.7;
      me.target = toMouse ? clamp(mouseX, minX, maxX) : rnd(minX, maxX);
      if (Math.abs(me.target - me.x) > 28) { me.dir = Math.sign(me.target - me.x); me.mode = "walk"; } else me.timer = 1;
    }
  }

  // dotted weather: a few clouds drift by in the daytime, stars (and a moon) come out at night, going by the viewer's own clock
  // (add ?sky=night or ?sky=day to the address to preview)
  const skyParam = (location.search.match(/[?&]sky=(day|night)/) || [])[1];
  const isNight = skyParam ? skyParam === "night" : (() => { const h = new Date().getHours(); return h < 6 || h >= 19; })();
  const CLOUDS = [{ x: 0.16, y: 52, s: 1.9, v: 5 }, { x: 0.5, y: 30, s: 1.4, v: 3.5 }, { x: 0.8, y: 56, s: 2.1, v: 4.2 }];
  const cloudAt = (dx, dy) => ell(dx, dy, 0, 0, 15, 4.6) || ell(dx, dy, -8, -4, 7, 5.2) || ell(dx, dy, 5, -5.5, 9, 6.2);
  const hash = (n) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const STARS = Array.from({ length: 24 }, (_, i) => ({ x: hash(i + 1), y: hash(i * 3.3 + 9), p: i * 1.7, big: i % 4 === 0 }));
  function drawSky(t) {
    const top = 6, bottom = Math.max(30, groundY - 112);
    if (!isNight) {
      for (const c of CLOUDS) {
        const wrap = W + 120, cx = ((c.x * W + (reduced ? 0 : t * c.v)) % wrap + wrap) % wrap - 60, cy = c.y;
        const x0 = Math.floor((cx - 22 * c.s) / (CELL_W / 2)), x1 = Math.ceil((cx + 22 * c.s) / (CELL_W / 2)), y0 = Math.floor((cy - 16 * c.s) / (CELL_H / 4)), y1 = Math.ceil((cy + 8 * c.s) / (CELL_H / 4));
        for (let j = Math.max(0, y0); j <= Math.min(rows - 1, y1); j++) for (let i = Math.max(0, x0); i <= Math.min(cols - 1, x1); i++) {
          const px = dotX(i), py = dotY(j); if (!cloudAt((px - cx) / c.s, (py - cy) / c.s)) continue;
          const sp = sprites[CLOUD - 1]; ctx.drawImage(sp.c, Math.round(px - sp.s / 2), Math.round(py - sp.s / 2), sp.s, sp.s);
        }
      }
      return;
    }
    // stars: snapped onto the dot grid, twinkling
    for (const st of STARS) {
      const i = Math.round((st.x * (W - 20) + 10) / (CELL_W / 2)), j = Math.round((top + st.y * (bottom - top)) / (CELL_H / 4));
      if (i < 0 || i >= cols || j < 0 || j >= rows) continue;
      const tw = reduced ? 0.8 : 0.45 + 0.55 * Math.abs(Math.sin(t * 1.3 + st.p)), sp = sprites[STAR - 1];
      ctx.globalAlpha = tw; ctx.drawImage(sp.c, Math.round(dotX(i) - sp.s / 2), Math.round(dotY(j) - sp.s / 2), sp.s, sp.s);
      if (st.big) for (const [di, dj] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { if (i + di < 0 || i + di >= cols || j + dj < 0 || j + dj >= rows) continue; ctx.globalAlpha = tw * 0.55; ctx.drawImage(sp.c, Math.round(dotX(i + di) - sp.s / 2), Math.round(dotY(j + dj) - sp.s / 2), sp.s, sp.s); }
    }
    ctx.globalAlpha = 1;
    // crescent moon
    const mx = W * 0.8, my = 44, x0 = Math.floor((mx - 22) / (CELL_W / 2)), x1 = Math.ceil((mx + 22) / (CELL_W / 2)), y0 = Math.floor((my - 22) / (CELL_H / 4)), y1 = Math.ceil((my + 22) / (CELL_H / 4));
    for (let j = Math.max(0, y0); j <= Math.min(rows - 1, y1); j++) for (let i = Math.max(0, x0); i <= Math.min(cols - 1, x1); i++) {
      const px = dotX(i), py = dotY(j);
      if (Math.hypot(px - mx, py - my) < 16 && Math.hypot(px - mx - 8, py - my + 4) >= 13.5) { const sp = sprites[MOON - 1]; ctx.drawImage(sp.c, Math.round(px - sp.s / 2), Math.round(py - sp.s / 2), sp.s, sp.s); }
    }
  }

  // a small blossom tree standing on the path (she walks in front of it)
  let treeX = 0;
  const TS = 1.12;
  const blobs = [[0, 46, 16, 13], [-12, 38, 11, 9.5], [12, 38, 11, 9.5], [0, 58, 10.5, 8.5], [-9, 52, 9, 8], [9, 52, 9, 8]];
  function treeAt(x0, y0, t) {
    const x = x0 / TS, y = y0 / TS;
    if (y < 0 || y > 70) return 0;
    const sway = Math.sin(t * 1.1) * (y / 70) * 1.6;
    const cx = x - sway;
    for (const [bx, by, rx, ry] of blobs) if (ell(cx, y, bx, by, rx, ry)) {
      const h = (Math.floor((cx + 30) / 3.4) * 7 + Math.floor(y / 3.4) * 13) % 11;
      if (h === 0 || h === 5) return TPINK;
      return Math.sin(cx * 0.35 + y * 0.28) > 0.25 ? TGREENL : TGREEN;
    }
    if (Math.abs(x - sway * 0.25 + (y > 26 ? (y - 26) * 0.12 : 0)) < 3.1 + Math.max(0, 8 - y) * 0.5 && y < 40) return PBROWN;   // trunk with a little flare
    if (y > 24 && y < 34 && Math.abs(Math.abs(x) - (y - 24) * 0.9) < 1.2) return PBROWN;                                      // branches
    return 0;
  }
  function drawTree(t) {
    const base = groundY - 1, x0 = Math.floor((treeX - 30 * TS * k) / (CELL_W / 2)), x1 = Math.ceil((treeX + 30 * TS * k) / (CELL_W / 2));
    const y0 = Math.floor((base - 70 * TS * k) / (CELL_H / 4)), y1 = Math.ceil((base + 2) / (CELL_H / 4));
    for (let j = Math.max(0, y0); j <= Math.min(rows - 1, y1); j++) for (let i = Math.max(0, x0); i <= Math.min(cols - 1, x1); i++) {
      const px = dotX(i), py = dotY(j), c = treeAt((px - treeX) / k, (base - py) / k, t); if (!c) continue;
      const sp = sprites[c - 1]; ctx.drawImage(sp.c, Math.round(px - sp.s / 2), Math.round(py - sp.s / 2), sp.s, sp.s);
    }
  }

  // petals drifting down from the tree
  const petals = []; let petalT = 1;
  function petalUpdate(dt, t) {
    if ((petalT -= dt) <= 0) { petalT = rnd(1.2, 2.8); if (petals.length < 9) petals.push({ x: treeX + rnd(-14, 14) * 1.12 * k, y: groundY - rnd(40, 70) * 1.12 * k, p: rnd(0, 6), vy: rnd(12, 20) }); }
    for (let n = petals.length - 1; n >= 0; n--) { const q = petals[n]; q.y += q.vy * dt; q.x += Math.sin(t * 1.6 + q.p) * 10 * dt + 3 * dt; if (q.y > groundY - 2) petals.splice(n, 1); }
  }
  function drawPetals() {
    const sp = sprites[TPINK - 1];
    for (const q of petals) {
      const i = Math.round(q.x / (CELL_W / 2)), j = Math.round(q.y / (CELL_H / 4)); if (i < 0 || i >= cols || j < 0 || j >= rows) continue;
      ctx.globalAlpha = clamp((groundY - q.y) / 14, 0, 1); ctx.drawImage(sp.c, Math.round(dotX(i) - sp.s / 2), Math.round(dotY(j) - sp.s / 2), sp.s, sp.s);
    }
    ctx.globalAlpha = 1;
  }

  // a little bee that wanders around the top of the intro (and likes to follow your cursor)
  const bee = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, timer: 0, dir: 1 };
  const beeMaxY = () => groundY - 26;
  function beeUpdate(dt, t) {
    if ((bee.timer -= dt) <= 0) {
      bee.timer = rnd(1.6, 3.6);
      if (mouseX !== null && mouseY !== null && Math.random() < 0.45) { bee.tx = clamp(mouseX + rnd(-30, 30), 16, W - 16); bee.ty = clamp(mouseY - 14, 10, beeMaxY()); }
      else { bee.tx = rnd(16, W - 16); bee.ty = rnd(10, beeMaxY()); }
    }
    bee.vx += ((bee.tx - bee.x) * 2.2 - bee.vx * 1.5) * dt; bee.vy += ((bee.ty - bee.y) * 2.2 - bee.vy * 1.5) * dt;
    const sp = Math.hypot(bee.vx, bee.vy); if (sp > 95) { bee.vx *= 95 / sp; bee.vy *= 95 / sp; }
    bee.x += bee.vx * dt; bee.y += bee.vy * dt + Math.sin(t * 9) * 0.3;
    if (Math.abs(bee.vx) > 10) bee.dir = Math.sign(bee.vx);
  }
  function drawBee(t) {
    const flap = Math.sin(t * 38) * 1.6;
    const x0 = Math.floor((bee.x - 26) / (CELL_W / 2)), x1 = Math.ceil((bee.x + 26) / (CELL_W / 2)), y0 = Math.floor((bee.y - 26) / (CELL_H / 4)), y1 = Math.ceil((bee.y + 20) / (CELL_H / 4));
    for (let j = Math.max(0, y0); j <= Math.min(rows - 1, y1); j++) for (let i = Math.max(0, x0); i <= Math.min(cols - 1, x1); i++) {
      const px = dotX(i), py = dotY(j), dx = ((px - bee.x) * bee.dir) / 1.7, dy = (py - bee.y) / 1.7;
      let c = 0;
      if (ell(dx, dy, -1.5, -7 + flap, 5, 3.2)) c = WING;
      if (ell(dx, dy, 0, 0, 8.2, 5.2)) c = Math.floor((dx + 7) / 4) % 2 === 0 && dx < 6 ? PYEL : EYE;
      else if (dx < -8 && dx > -11 && Math.abs(dy) < 1.4) c = EYE;
      if (!c) continue;
      const sp = sprites[c - 1]; ctx.drawImage(sp.c, Math.round(px - sp.s / 2), Math.round(py - sp.s / 2), sp.s, sp.s);
    }
  }

  function draw(t, dt) {
    if (!W) return;
    if (dt) { update(dt); beeUpdate(dt, t); petalUpdate(dt, t); }
    ctx.clearRect(0, 0, W, H);
    drawSky(t);
    // the faint dotted path
    for (let i = 0; i < cols; i++) { if (dotX(i) < minX - 24 || dotX(i) > maxX + 24) continue; const h = ((i * 73856093) >>> 0) % 100; if (h < 70) { const sp = sprites[FLOOR - 1]; ctx.drawImage(sp.c, Math.round(dotX(i) - sp.s / 2), Math.round(dotY(groundRow) + groundOff(dotX(i)) - sp.s / 2), sp.s, sp.s); } }
    if (bubble && tartOn) placeBubble();
    drawTree(t);
    drawPetals();
    // her
    const bob = me.mode === "walk" ? Math.abs(Math.sin(me.phase)) * 1.6 * k : 0;
    const jumpY = me.jump > 0 ? Math.sin((1 - me.jump / 0.55) * Math.PI) * 22 * k : 0;
    const feetY = groundY - 1 + groundOff(me.x) - bob - jumpY;
    const x0 = Math.floor((me.x - 34 * k) / (CELL_W / 2)), x1 = Math.ceil((me.x + 26 * k) / (CELL_W / 2));
    const y0 = Math.floor((feetY - 90 * k) / (CELL_H / 4)), y1 = Math.ceil((feetY + 4) / (CELL_H / 4));
    for (let j = Math.max(0, y0); j <= Math.min(rows - 1, y1); j++) for (let i = Math.max(0, x0); i <= Math.min(cols - 1, x1); i++) {
      const px = dotX(i), py = dotY(j);
      const x = ((px - me.x) / k) * me.dir, y = (feetY - py) / k;
      if (y < -1 || y > 88) continue;
      const c = colorAt(x, y, t); if (!c) continue;
      const sp = sprites[c - 1]; ctx.drawImage(sp.c, Math.round(px - sp.s / 2), Math.round(py - sp.s / 2), sp.s, sp.s);
    }
    drawBee(t);
  }

  addEventListener("pointermove", (e) => {
    const o = canvas.getBoundingClientRect();
    if (e.clientY > o.top - 80 && e.clientY < o.bottom + 40 && e.clientX > hero.getBoundingClientRect().left) { mouseX = e.clientX - o.left; mouseY = e.clientY - o.top; } else { mouseX = null; mouseY = null; }
  });
  // the canvas ignores the pointer, so hit-test her at document level
  document.addEventListener("pointerdown", (e) => {
    const o = canvas.getBoundingClientRect(), x = e.clientX - o.left, y = e.clientY - o.top;
    if (Math.abs(x - me.x) < 30 * k && y > groundY - 76 * k && y < groundY + 6 && me.jump <= 0) { me.jump = 0.55; me.wave = 1.4; me.mode = "idle"; me.timer = 1.4; if (reduced) draw(performance.now() / 1000, 0); }
  });
  document.addEventListener("tart-hover", (e) => {
    tartOn = !!(e.detail && e.detail.on);
    if (reduced) { me.x = tartX; me.dir = 1; me.wave = 0; }
    if (bubble) { placeBubble(); bubble.classList.toggle("show", tartOn); }
    if (!tartOn) { me.timer = 1.2; me.wave = 0; }
    if (reduced) draw(performance.now() / 1000, 0);
  });

  let raf = 0, last = performance.now(), clock = 0;
  const loop = (now) => { raf = requestAnimationFrame(loop); const acc = now - last; if (acc < 1000 / FPS - 2) return; last = now; const dt = Math.min(0.05, acc / 1000); clock += dt; draw(clock, dt); };
  const start = () => { if (!raf && !reduced && W) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  let rz = 0;
  resize();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  addEventListener("load", layout);
  if ("ResizeObserver" in window) new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(resize, 120); }).observe(hero); else addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(resize, 120); });
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas); else start();
})();
