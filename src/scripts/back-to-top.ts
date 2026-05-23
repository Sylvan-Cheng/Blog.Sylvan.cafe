(() => {
  if (window.__bttAC) window.__bttAC.abort();
  const ac = new AbortController();
  window.__bttAC = ac;

  let lastVisible: boolean | null = null;
  let ticking = false;

  function handleScroll(): void {
    const rootElement = document.documentElement;
    const container = document.querySelector("#btt-btn-container");
    const progressIndicator = document.querySelector("#progress-indicator");
    if (!rootElement || !container || !progressIndicator) return;

    const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
    const scrollTop = rootElement.scrollTop;
    const scrollPercent = Math.floor((scrollTop / scrollTotal) * 100);

    (progressIndicator as HTMLElement).style.setProperty(
      "background-image",
      `conic-gradient(var(--accent), var(--accent) ${scrollPercent}%, transparent ${scrollPercent}%)`,
    );

    const isVisible = scrollTop / scrollTotal > 0.3;

    if (isVisible !== lastVisible) {
      container.classList.toggle("opacity-100", isVisible);
      container.classList.toggle("translate-y-0", isVisible);
      container.classList.toggle("opacity-0", !isVisible);
      container.classList.toggle("translate-y-14", !isVisible);
      lastVisible = isVisible;
    }
  }

  document.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true, signal: ac.signal },
  );

  function initBackToTop(): void {
    const rootElement = document.documentElement;
    const backToTopBtn = document.querySelector<HTMLButtonElement>(
      "[data-button='back-to-top']",
    );
    if (!rootElement || !backToTopBtn) return;

    backToTopBtn.addEventListener(
      "click",
      () => {
        document.body.scrollTop = 0;
        rootElement.scrollTop = 0;
      },
      { signal: ac.signal },
    );

    lastVisible = null;
    handleScroll();
  }

  document.addEventListener("astro:after-swap", initBackToTop);
  initBackToTop();
})();

export {};
