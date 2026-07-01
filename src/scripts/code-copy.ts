import { initScript, onSwap, setCleanupTimeout } from "./lifecycle";

const signal = initScript("__codeCopyAC");

function getLabels() {
  const labels = document.querySelector<HTMLElement>("[data-code-copy-labels]");
  return {
    copy: labels?.dataset.labelCopy ?? "Copy",
    copied: labels?.dataset.labelCopied ?? "Copied",
  };
}

function canScrollHorizontally(code: HTMLElement, delta: number): boolean {
  const maxScroll = code.scrollWidth - code.clientWidth;
  if (maxScroll <= 1 || Math.abs(delta) < 1) return false;
  if (delta < 0) return code.scrollLeft > 0;
  return code.scrollLeft < maxScroll - 1;
}

function attachCodeScrollbar(block: HTMLElement, code: HTMLElement) {
  if (block.querySelector(":scope > .code-scrollbar")) return;

  const track = document.createElement("div");
  track.className = "code-scrollbar";
  track.setAttribute("aria-hidden", "true");

  const thumb = document.createElement("span");
  thumb.className = "code-scrollbar-thumb";
  track.appendChild(thumb);
  block.appendChild(track);

  const update = () => {
    const maxScroll = code.scrollWidth - code.clientWidth;
    const trackWidth = track.clientWidth;
    if (maxScroll <= 1 || trackWidth <= 0) {
      track.hidden = true;
      block.classList.remove("code-scroll-enhanced");
      return;
    }

    track.hidden = false;
    block.classList.add("code-scroll-enhanced");
    const thumbWidth = Math.max(
      24,
      (code.clientWidth / code.scrollWidth) * trackWidth,
    );
    const maxThumbOffset = Math.max(0, trackWidth - thumbWidth);
    const thumbOffset = (code.scrollLeft / maxScroll) * maxThumbOffset;
    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${thumbOffset}px)`;
  };

  code.addEventListener("scroll", update, { passive: true, signal });

  const handleWheel = (event: WheelEvent) => {
    if (track.hidden) return;
    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
    if (Math.abs(delta) < 1) return;

    event.preventDefault();
    if (canScrollHorizontally(code, delta)) {
      code.scrollLeft += delta;
    }
  };

  block.addEventListener("wheel", handleWheel, { signal });
  document.addEventListener(
    "wheel",
    (event) => {
      if (document.activeElement !== block) return;
      if (event.target instanceof Element && block.contains(event.target)) {
        return;
      }

      handleWheel(event);
    },
    { signal },
  );

  let dragStartX = 0;
  let dragStartScrollLeft = 0;

  thumb.addEventListener(
    "pointerdown",
    (event) => {
      if (track.hidden) return;
      event.preventDefault();
      thumb.setPointerCapture(event.pointerId);
      dragStartX = event.clientX;
      dragStartScrollLeft = code.scrollLeft;
    },
    { signal },
  );

  thumb.addEventListener(
    "pointermove",
    (event) => {
      if (!thumb.hasPointerCapture(event.pointerId)) return;
      const maxScroll = code.scrollWidth - code.clientWidth;
      const maxThumbOffset = track.clientWidth - thumb.offsetWidth;
      if (maxScroll <= 0 || maxThumbOffset <= 0) return;
      const delta = event.clientX - dragStartX;
      code.scrollLeft =
        dragStartScrollLeft + (delta / maxThumbOffset) * maxScroll;
    },
    { signal },
  );

  track.addEventListener(
    "pointerdown",
    (event) => {
      if (event.target === thumb || track.hidden) return;
      const rect = track.getBoundingClientRect();
      const targetRatio = (event.clientX - rect.left) / rect.width;
      code.scrollLeft = targetRatio * (code.scrollWidth - code.clientWidth);
    },
    { signal },
  );

  block.addEventListener(
    "keydown",
    (event) => {
      const step = Math.max(40, code.clientWidth * 0.1);
      if (event.key === "ArrowLeft") code.scrollLeft -= step;
      else if (event.key === "ArrowRight") code.scrollLeft += step;
      else if (event.key === "Home") code.scrollLeft = 0;
      else if (event.key === "End") code.scrollLeft = code.scrollWidth;
      else return;
      event.preventDefault();
    },
    { signal },
  );

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(update);
    observer.observe(code);
    observer.observe(block);
    signal.addEventListener("abort", () => observer.disconnect(), {
      once: true,
    });
  }

  requestAnimationFrame(update);
}

async function copyCode(block: HTMLElement, button: HTMLButtonElement) {
  const { copy, copied } = getLabels();
  const code = block.querySelector("code");
  if (!code) return;

  const clone = code.cloneNode(true) as HTMLElement;
  for (const element of clone.querySelectorAll(".line-number")) {
    element.remove();
  }

  try {
    await navigator.clipboard.writeText(clone.innerText ?? "");
  } catch {
    // Clipboard API can be unavailable in non-secure contexts.
  }

  button.innerText = copied;
  setCleanupTimeout(
    () => {
      button.innerText = copy;
    },
    700,
    signal,
  );
}

function attachCopyButtons() {
  const { copy } = getLabels();
  const codeBlocks = Array.from(document.querySelectorAll<HTMLElement>("pre"));

  for (const codeBlock of codeBlocks) {
    if (codeBlock.classList.contains("copy-ready")) continue;
    codeBlock.classList.add("copy-ready");

    const code = codeBlock.querySelector<HTMLElement>("code");
    if (code) attachCodeScrollbar(codeBlock, code);

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const topClass =
      codeBlock.dataset.filename !== undefined
        ? "top-(--file-name-offset)"
        : "-top-3";

    const copyButton = document.createElement("button");
    copyButton.className = `copy-btn ${topClass}`;
    copyButton.type = "button";
    copyButton.innerText = copy;
    codeBlock.setAttribute("tabindex", "0");
    codeBlock.appendChild(copyButton);

    codeBlock.parentNode?.insertBefore(wrapper, codeBlock);
    wrapper.appendChild(codeBlock);

    copyButton.addEventListener(
      "click",
      async () => {
        await copyCode(codeBlock, copyButton);
      },
      { signal },
    );
  }
}

onSwap(attachCopyButtons, signal);
