(() => {
  const footerMarkup = `
    <footer class="apple-footer">
      <canvas id="footer-scene" aria-hidden="true"></canvas>

      <div class="af-inner">
        <p class="af-thanks">Thank you for viewing!</p>

        <div class="af-cols">
          <div class="af-col">
            <span class="af-label">Contact</span>
            <a class="af-email" href="mailto:liviwong123@gmail.com">liviwong123@gmail.com</a>
          </div>
          <nav class="af-col" aria-label="Profiles">
            <span class="af-label">Elsewhere</span>
            <a href="https://www.linkedin.com/in/livianne-wong-b3b724205/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://drive.google.com/file/d/1uY5DvgihQv_6BxHrdHPwktoVfEQGerwh/view" target="_blank" rel="noreferrer">Resume</a>
            <a href="https://github.com/LivianneW" target="_blank" rel="noreferrer">Github</a>
          </nav>
        </div>

        <div class="af-bottom">
          <span class="af-copy">Designed & Coded by Livianne </span>
          <button class="af-up" id="scrollUpBtn" type="button">Scroll up <span aria-hidden="true">↑</span></button>
        </div>
      </div>
    </footer>`;

  document.body.insertAdjacentHTML("beforeend", footerMarkup);

  document.getElementById("scrollUpBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
