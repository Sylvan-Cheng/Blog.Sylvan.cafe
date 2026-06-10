import { initScript, onSwap } from "./lifecycle";

const signal = initScript("__tipAC");

function positionTip(wrap: HTMLElement) {
  const tip = wrap.querySelector<HTMLElement>("[data-tooltip-text]");
  if (!tip) return;
  const trigger = wrap.firstElementChild as HTMLElement | null;
  if (!trigger) return;

  const triggerRect = trigger.getBoundingClientRect();
  tip.style.visibility = "hidden";
  tip.style.removeProperty("top");
  tip.style.removeProperty("bottom");
  tip.offsetHeight;

  const width = tip.offsetWidth || 200;
  const height = tip.offsetHeight || 30;
  const gap = 8;
  let top = triggerRect.bottom + gap;
  if (top + height > window.innerHeight - gap) {
    top = triggerRect.top - height - gap;
  }

  const centeredLeft = triggerRect.left + triggerRect.width / 2 - width / 2;
  const left = Math.max(
    gap,
    Math.min(centeredLeft, document.documentElement.clientWidth - width - gap),
  );

  tip.style.top = `${top}px`;
  tip.style.left = `${left}px`;
  tip.style.visibility = "";
}

function initTooltips() {
  document.querySelectorAll<HTMLElement>(".tooltip-wrap").forEach((wrap) => {
    const trigger = wrap.firstElementChild as HTMLElement | null;
    const tip = wrap.querySelector<HTMLElement>("[data-tooltip-text]");
    if (!trigger || !tip) return;

    const tipId = tip.id || `tooltip-${crypto.randomUUID()}`;
    tip.id = tipId;
    trigger.setAttribute("aria-describedby", tipId);

    wrap.addEventListener("mouseenter", () => positionTip(wrap), {
      passive: true,
      signal,
    });
  });
}

onSwap(initTooltips, signal);
