(() => {
  if (window.__progressAC) window.__progressAC.abort();
  const ac = new AbortController();
  window.__progressAC = ac;

  const BAR_ID = "reading-progress-bar";
  const CONTAINER_CLASS = "progress-container";

  function createProgressBar() {
    const existing = document.querySelector("." + CONTAINER_CLASS);
    if (existing) {
      const bar = existing.querySelector<HTMLElement>(".progress-bar");
      if (bar) {
        bar.style.width = "0%";
        bar.setAttribute("aria-valuenow", "0");
      }
      return;
    }
    const progressContainer = document.createElement("div");
    progressContainer.className =
      CONTAINER_CLASS + " fixed top-0 z-10 h-1 w-full bg-background";
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar h-1 w-0 bg-accent";
    progressBar.id = BAR_ID;
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    progressBar.setAttribute("aria-valuenow", "0");
    progressBar.setAttribute("aria-label", "Reading progress");
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
  }

  function updateScrollProgress() {
    let ticking = false;
    document.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const bar = document.getElementById(BAR_ID);
          if (!bar) { ticking = false; return; }
          const winScroll = document.documentElement.scrollTop;
          const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          if (height <= 0) {
            bar.style.width = "0%";
            bar.setAttribute("aria-valuenow", "0");
            ticking = false;
            return;
          }
          const pct = Math.round((winScroll / height) * 100);
          bar.style.width = pct + "%";
          bar.setAttribute("aria-valuenow", String(pct));
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true, signal: ac.signal });
  }

  document.addEventListener("astro:after-swap", () => {
    if (!document.getElementById("main-content")) return;
    window.scrollTo({ left: 0, top: 0, behavior: "instant" });
    requestAnimationFrame(createProgressBar);
  });

  createProgressBar();
  updateScrollProgress();
})();

export {};
