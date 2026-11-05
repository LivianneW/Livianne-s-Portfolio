// Shuffle pile: the photos sit in a loose, tilted pile. Click (or press Enter / Space / →) and the top one
// slides off and tucks in at the back, revealing the next. No dependencies.
(() => {
  const pile = document.querySelector(".photo-strip");
  if (!pile) return;
  const cards = [...pile.querySelectorAll(".photo-item")];
  const n = cards.length;
  const POS = [[0, 0, -1.2], [16, -10, 3], [-14, -18, -3.5]];   // x, y, rotation for depth 0, 1, 2 (deeper cards hide behind depth 2)
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let order = cards.map((_, i) => i), busy = false;

  const place = (el, d) => { const p = POS[Math.min(d, 2)]; el.style.transform = `translate(${p[0]}px, ${p[1]}px) rotate(${p[2]}deg)`; el.style.zIndex = n - d; el.style.opacity = d > 3 ? 0 : 1; el.tabIndex = d === 0 ? 0 : -1; el.setAttribute("aria-hidden", d === 0 ? "false" : "true"); };
  const render = () => order.forEach((ci, d) => place(cards[ci], d));
  pile.style.setProperty("--n", n);

  function next() {
    if (busy || n < 2) return;
    busy = true;
    const top = cards[order[0]];
    if (reduced) { order.push(order.shift()); render(); busy = false; top.focus(); return; }
    top.classList.add("leaving");
    top.style.transform = "translate(62%, 26px) rotate(14deg)";
    order.slice(1).forEach((ci, d) => place(cards[ci], d));
    setTimeout(() => {
      top.classList.add("notrans");
      order.push(order.shift());
      place(top, n - 1);
      void top.offsetWidth;
      top.classList.remove("notrans", "leaving");
      busy = false;
      cards[order[0]].focus({ preventScroll: true });
    }, 300);
  }
  cards.forEach((c) => {
    c.addEventListener("click", () => { if (c === cards[order[0]]) next(); });
    c.addEventListener("keydown", (e) => { if (c === cards[order[0]] && (e.key === "Enter" || e.key === " " || e.key === "ArrowRight")) { e.preventDefault(); next(); } });
  });
  render();
})();
