import { initScript, onSwap } from "./lifecycle";

const signal = initScript("__langAC");
let pickerController: AbortController | undefined;

signal.addEventListener(
  "abort",
  () => {
    pickerController?.abort();
  },
  { once: true },
);

function initLangPicker(): void {
  pickerController?.abort();
  pickerController = new AbortController();
  const pickerSignal = pickerController.signal;

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
    { signal: pickerSignal },
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
    { signal: pickerSignal },
  );

  document.addEventListener(
    "click",
    (e) => {
      if (!trig.contains(e.target as Node) && !dd.contains(e.target as Node)) {
        close();
      }
    },
    { signal: pickerSignal },
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") close();
    },
    { signal: pickerSignal },
  );
}

onSwap(initLangPicker, signal);
