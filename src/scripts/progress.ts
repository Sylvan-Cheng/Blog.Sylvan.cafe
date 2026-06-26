import { initScript, throttleRAF } from "./lifecycle";

const signal = initScript("__progressAC");

const BAR_ID = "reading-progress-bar";
const CONTAINER_CLASS = "progress-container";

function removeProgressBar() {
  document.querySelector(`.${CONTAINER_CLASS}`)?.remove();
}

function syncProgressBar() {
  if (!document.getElementById("article")) {
    removeProgressBar();
    return;
  }

  const existing = document.querySelector(`.${CONTAINER_CLASS}`);
  if (existing) {
    const bar = existing.querySelector<HTMLElement>(".progress-bar");
    if (bar) {
      bar.style.width = "0%";
      bar.setAttribute("aria-valuenow", "0");
    }
    return;
  }
  const progressContainer = document.createElement("div");
  progressContainer.className = `${CONTAINER_CLASS} fixed z-20 h-1 w-full bg-background`;
  progressContainer.style.top = "var(--header-h)";
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar h-1 w-0 bg-accent";
  progressBar.id = BAR_ID;
  progressBar.setAttribute("role", "progressbar");
  progressBar.setAttribute("aria-valuemin", "0");
  progressBar.setAttribute("aria-valuemax", "100");
  progressBar.setAttribute("aria-valuenow", "0");
  progressBar.setAttribute(
    "aria-label",
    document.body.dataset.readingProgressLabel || "Reading progress",
  );
  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);
}

function updateScrollProgress() {
  if (!document.getElementById("article")) {
    removeProgressBar();
    return;
  }

  const bar = document.getElementById(BAR_ID);
  if (!bar) return;
  const winScroll = document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  if (height <= 0) {
    bar.style.width = "0%";
    bar.setAttribute("aria-valuenow", "0");
    return;
  }
  const pct = Math.round((winScroll / height) * 100);
  bar.style.width = `${pct}%`;
  bar.setAttribute("aria-valuenow", String(pct));
}

throttleRAF(updateScrollProgress, signal);

document.addEventListener(
  "astro:after-swap",
  () => {
    requestAnimationFrame(syncProgressBar);
  },
  { signal },
);

syncProgressBar();
