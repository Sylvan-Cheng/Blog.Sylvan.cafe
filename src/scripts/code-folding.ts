import { initScript, onSwap } from "./lifecycle";

const signal = initScript("__codeFoldingAC");

const chevronDownD = "m6 9 6 6 6-6";
const chevronUpD = "m18 15-6-6-6 6";

function getLabels() {
  const labels = document.querySelector<HTMLElement>(
    "[data-code-folding-labels]",
  );
  return {
    expand: labels?.dataset.labelExpand ?? "Expand",
    collapse: labels?.dataset.labelCollapse ?? "Collapse",
  };
}

function createChevronSVG(d: string) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
  return { svg, path };
}

function resetCollapsedStyles(code: HTMLElement, isCollapsed: boolean) {
  if (isCollapsed) {
    code.style.maxHeight = "";
    code.style.overflow = "";
    code.style.maskImage = "";
    code.style.setProperty("-webkit-mask-image", "");
    return;
  }

  code.style.maxHeight = "none";
  code.style.overflow = "";
  code.style.maskImage = "none";
  code.style.setProperty("-webkit-mask-image", "none");
}

function initCodeFolding() {
  const labels = getLabels();
  const pres = document.querySelectorAll<HTMLElement>("pre[data-collapse]");
  if (pres.length === 0) return;

  const rootFontSize = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );

  for (const pre of pres) {
    if (pre.querySelector(".cf-btn")) continue;

    const code = pre.querySelector<HTMLElement>("code");
    if (!code) continue;

    const maxHeightPx =
      Number.parseFloat(getComputedStyle(pre).getPropertyValue("--cf-max-h")) *
      rootFontSize;
    code.style.visibility = "hidden";
    code.style.transition = "none";
    code.style.maxHeight = "none";
    code.style.maskImage = "none";
    code.style.setProperty("-webkit-mask-image", "none");

    requestAnimationFrame(() => {
      if (signal.aborted) return;

      const fullHeight = code.scrollHeight;
      code.style.visibility = "";
      code.style.transition = "";
      code.style.maxHeight = "";
      code.style.maskImage = "";
      code.style.setProperty("-webkit-mask-image", "");

      if (fullHeight <= maxHeightPx) {
        resetCollapsedStyles(code, false);
        return;
      }

      const button = document.createElement("button");
      button.className = "cf-btn";
      button.type = "button";
      const left = createChevronSVG(chevronDownD);
      const text = document.createElement("span");
      text.className = "cf-btn-text";
      text.textContent = labels.expand;
      const right = createChevronSVG(chevronDownD);

      button.appendChild(left.svg);
      button.appendChild(text);
      button.appendChild(right.svg);
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", labels.expand);
      button.style.bottom = "-0.75rem";
      pre.appendChild(button);
      pre.classList.add("cf-collapsed");

      let animating = false;

      button.addEventListener(
        "click",
        () => {
          if (animating) return;
          animating = true;

          const isCollapsed = pre.classList.contains("cf-collapsed");

          if (isCollapsed) {
            code.style.overflow = "hidden";
            code.style.maxHeight = `${fullHeight}px`;
            code.style.maskImage = "none";
            code.style.setProperty("-webkit-mask-image", "none");
            pre.classList.remove("cf-collapsed");
            left.path.setAttribute("d", chevronUpD);
            right.path.setAttribute("d", chevronUpD);
            text.textContent = labels.collapse;
            button.setAttribute("aria-expanded", "true");
            button.setAttribute("aria-label", labels.collapse);
          } else {
            code.style.overflow = "hidden";
            code.style.maxHeight = `${code.scrollHeight}px`;
            requestAnimationFrame(() => {
              code.style.maxHeight = "var(--cf-max-h)";
              code.style.maskImage = "";
              code.style.setProperty("-webkit-mask-image", "");
              pre.classList.add("cf-collapsed");
              left.path.setAttribute("d", chevronDownD);
              right.path.setAttribute("d", chevronDownD);
              text.textContent = labels.expand;
              button.setAttribute("aria-expanded", "false");
              button.setAttribute("aria-label", labels.expand);
            });
          }

          const computedDuration =
            Number.parseFloat(
              getComputedStyle(code).getPropertyValue("--cf-duration"),
            ) || 400;
          const safetyTimer = window.setTimeout(() => {
            if (!animating) return;
            resetCollapsedStyles(code, pre.classList.contains("cf-collapsed"));
            animating = false;
          }, computedDuration + 300);

          code.addEventListener(
            "transitionend",
            (event) => {
              if (event.propertyName !== "max-height") return;
              clearTimeout(safetyTimer);
              resetCollapsedStyles(
                code,
                pre.classList.contains("cf-collapsed"),
              );
              animating = false;
            },
            { once: true, signal },
          );
        },
        { signal },
      );
    });
  }
}

onSwap(initCodeFolding, signal);
