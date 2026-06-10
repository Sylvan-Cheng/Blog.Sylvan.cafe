export function initScript(key: string): AbortSignal {
  const w = window as unknown as Record<string, AbortController | undefined>;
  w[key]?.abort();
  const ac = new AbortController();
  w[key] = ac;
  return ac.signal;
}

export type InteractionContext = {
  signal: AbortSignal;
  onCleanup: (fn: () => void) => void;
};

export function initInteraction(key: string): InteractionContext {
  const signal = initScript(key);
  const cleanups: Array<() => void> = [];

  signal.addEventListener(
    "abort",
    () => {
      while (cleanups.length > 0) cleanups.pop()?.();
    },
    { once: true },
  );

  return {
    signal,
    onCleanup(fn) {
      cleanups.push(fn);
    },
  };
}

export function onSwap(fn: () => void, signal?: AbortSignal): void {
  document.addEventListener("astro:after-swap", fn, { signal });
  fn();
}

export function throttleRAF(fn: () => void, signal: AbortSignal): void {
  let ticking = false;
  const handler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn();
        ticking = false;
      });
      ticking = true;
    }
  };
  handler();
  window.addEventListener("scroll", handler, { passive: true, signal });
}
