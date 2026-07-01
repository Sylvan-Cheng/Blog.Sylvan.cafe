import { initScript, onSwap, throttleRAF } from "./lifecycle";

const signal = initScript("__bttAC");

let lastVisible: boolean | null = null;

function handleScroll(): void {
  const rootElement = document.documentElement;
  const container = document.querySelector("#btt-btn-container");
  const progressIndicator = document.querySelector("#progress-indicator");
  if (!rootElement || !container || !progressIndicator) return;

  const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
  if (scrollTotal <= 0) return;
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

throttleRAF(handleScroll, signal);

function initBackToTop(): void {
  const rootElement = document.documentElement;
  const backToTopBtn = document.querySelector<HTMLButtonElement>(
    "[data-button='back-to-top']",
  );
  if (!rootElement || !backToTopBtn) return;

  backToTopBtn.addEventListener(
    "click",
    () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.body.scrollTop = 0;
      rootElement.scrollTop = 0;
    },
    { signal },
  );

  lastVisible = null;
  handleScroll();
}

onSwap(initBackToTop, signal);
