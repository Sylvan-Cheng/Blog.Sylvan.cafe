function initLangPicker(): void {
  const trigger = document.querySelector<HTMLButtonElement>("#lang-trigger");
  const dropdown = document.querySelector<HTMLUListElement>("#lang-dropdown");
  if (!trigger || !dropdown) return;
  if (trigger.dataset.bound) return;
  trigger.dataset.bound = "1";

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

  trig.addEventListener("click", (e) => {
    e.stopPropagation();
    dd.hidden ? open() : close();
  });

  dd.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a");
    if (link?.href && link.href !== window.location.href) {
      window.location.href = link.href;
    }
    close();
  });

  document.addEventListener("click", (e) => {
    if (!trig.contains(e.target as Node) && !dd.contains(e.target as Node)) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

document.addEventListener("astro:after-swap", initLangPicker);
initLangPicker();
