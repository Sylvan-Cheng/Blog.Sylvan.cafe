function initBackToTop(): void {
  const rootElement = document.documentElement;
  const btnContainer = document.querySelector("#btt-btn-container");
  const backToTopBtn = document.querySelector<HTMLButtonElement>(
    "[data-button='back-to-top']",
  );
  const progressIndicator = document.querySelector("#progress-indicator");

  if (!rootElement || !btnContainer || !backToTopBtn || !progressIndicator)
    return;

  const container = btnContainer;

  backToTopBtn.addEventListener("click", () => {
    document.body.scrollTop = 0;
    rootElement.scrollTop = 0;
  });

  let lastVisible: boolean | null = null;
  function handleScroll(): void {
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

  let ticking = false;
  document.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

document.addEventListener("astro:after-swap", initBackToTop);
initBackToTop();
