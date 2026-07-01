import { initInteraction, onSwap } from "./lifecycle";

const { signal, onCleanup } = initInteraction("__deferredInteractionsAC");

let backToTopReady: Promise<void> | null = null;
let shareReady: Promise<void> | null = null;
let tooltipReady: Promise<void> | null = null;
let codeCopyReady: Promise<void> | null = null;
let codeFoldingReady: Promise<void> | null = null;
const pageCleanups: Array<() => void> = [];

function addPageCleanup(fn: () => void): void {
  pageCleanups.push(fn);
}

function cleanupPageLoaders(): void {
  while (pageCleanups.length > 0) pageCleanups.pop()?.();
}

onCleanup(cleanupPageLoaders);

function loadBackToTop() {
  backToTopReady ??= import("./back-to-top").then(() => {});
  return backToTopReady;
}

function loadShare() {
  shareReady ??= import("./share").then(() => {});
  return shareReady;
}

function loadTooltip() {
  tooltipReady ??= import("./tooltip").then(() => {});
  return tooltipReady;
}

function loadCodeCopy() {
  codeCopyReady ??= import("./code-copy").then(() => {});
  return codeCopyReady;
}

function loadCodeFolding() {
  codeFoldingReady ??= import("./code-folding").then(() => {});
  return codeFoldingReady;
}

function onFirstIntent(
  target: EventTarget,
  events: readonly string[],
  callback: (event: Event) => void,
  options: AddEventListenerOptions = {},
): void {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  addPageCleanup(() => {
    signal.removeEventListener("abort", abort);
    abort();
  });

  const listener = (event: Event) => {
    controller.abort();
    callback(event);
  };

  for (const eventName of events) {
    target.addEventListener(eventName, listener, {
      ...options,
      signal: controller.signal,
    });
  }
}

function onFirstMatchingIntent(
  target: EventTarget,
  events: readonly string[],
  predicate: (event: Event) => boolean,
  callback: (event: Event) => void,
  options: AddEventListenerOptions = {},
): void {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  addPageCleanup(() => {
    signal.removeEventListener("abort", abort);
    abort();
  });

  const listener = (event: Event) => {
    if (!predicate(event)) return;
    controller.abort();
    callback(event);
  };

  for (const eventName of events) {
    target.addEventListener(eventName, listener, {
      ...options,
      signal: controller.signal,
    });
  }
}

function observeOnce(
  elements: Iterable<Element>,
  callback: () => void,
  rootMargin = "800px 0px",
): void {
  const elementList = [...elements];
  if (elementList.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    callback();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      callback();
    },
    { rootMargin },
  );

  for (const element of elementList) observer.observe(element);
  addPageCleanup(() => observer.disconnect());
}

function initBackToTopLoader(): void {
  const button = document.querySelector<HTMLButtonElement>(
    "[data-button='back-to-top']",
  );
  if (!button || backToTopReady) return;

  onFirstIntent(window, ["scroll"], () => void loadBackToTop(), {
    passive: true,
  });
  onFirstIntent(button, ["click"], async () => {
    await loadBackToTop();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

function initShareLoader(): void {
  const container = document.querySelector<HTMLElement>(
    "[data-share-container]",
  );
  if (!container || shareReady) return;

  observeOnce([container], () => void loadShare(), "600px 0px");
  onFirstIntent(container, ["pointerover", "focusin"], () => void loadShare(), {
    passive: true,
  });
  onFirstIntent(
    container,
    ["click"],
    async (event) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-share-btn], [data-share-toggle]",
      );
      if (!target) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      await loadShare();
      if (document.contains(target)) target.click();
    },
    { capture: true },
  );
}

function initTooltipLoader(): void {
  if (tooltipReady || !document.querySelector(".tooltip-wrap")) return;

  onFirstMatchingIntent(
    document,
    ["pointerover", "focusin"],
    (event) =>
      Boolean((event.target as Element | null)?.closest(".tooltip-wrap")),
    async (event) => {
      const wrap = (event.target as Element | null)?.closest<HTMLElement>(
        ".tooltip-wrap",
      );
      if (!wrap) return;

      await loadTooltip();
      if (document.contains(wrap)) {
        wrap.dispatchEvent(new MouseEvent("mouseenter"));
      }
    },
    { passive: true, capture: true },
  );
}

function initCodeLoader(): void {
  const codeBlocks = document.querySelectorAll("pre");
  if (codeBlocks.length === 0 || (codeCopyReady && codeFoldingReady)) return;

  const loadCodeInteractions = () => {
    void loadCodeCopy();
    if (document.querySelector("pre[data-collapse]")) {
      void loadCodeFolding();
    }
  };

  observeOnce(codeBlocks, loadCodeInteractions);

  const article = document.getElementById("article");
  if (!article) return;

  onFirstMatchingIntent(
    article,
    ["pointerover", "focusin"],
    (event) => Boolean((event.target as Element | null)?.closest("pre")),
    (event) => {
      const target = event.target as Element | null;
      if (!target?.closest("pre")) return;
      loadCodeInteractions();
    },
    { passive: true, capture: true },
  );
}

function initDeferredInteractions(): void {
  cleanupPageLoaders();
  initBackToTopLoader();
  initShareLoader();
  initTooltipLoader();
  initCodeLoader();
}

onSwap(initDeferredInteractions, signal);
