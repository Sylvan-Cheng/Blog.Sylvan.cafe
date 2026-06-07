import { initScript, onSwap } from "./lifecycle";

const signal = initScript("__langAC");

function initLangPicker(): void {
  const trigger = document.querySelector<HTMLButtonElement>("#lang-trigger");
  const dropdown = document.querySelector<HTMLUListElement>("#lang-dropdown");
  if (!trigger || !dropdown) return;

  const trig = trigger;
  const dd = dropdown;

  function open(): void {
    dd.hidden = false;
    trig.setAttribute("aria-expanded", "true");
  }

  function close(): void {
    dd.hidden = true;
    trig.setAttribute("aria-expanded", "false");
  }

  trig.addEventListener(
    "click",
    (e) => {
      e.stopPropagation();
      dd.hidden ? open() : close();
    },
    { signal },
  );

  dd.addEventListener(
    "click",
    (e) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a");
      if (link?.href && link.href !== window.location.href) {
        window.location.href = link.href;
      }
      close();
    },
    { signal },
  );

  document.addEventListener(
    "click",
    (e) => {
      if (!trig.contains(e.target as Node) && !dd.contains(e.target as Node)) {
        close();
      }
    },
    { signal },
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") close();
    },
    { signal },
  );
}

onSwap(initLangPicker, signal);
