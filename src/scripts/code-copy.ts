import { initScript, onSwap, setCleanupTimeout } from "./lifecycle";

const signal = initScript("__codeCopyAC");

function getLabels() {
  const labels = document.querySelector<HTMLElement>("[data-code-copy-labels]");
  return {
    copy: labels?.dataset.labelCopy ?? "Copy",
    copied: labels?.dataset.labelCopied ?? "Copied",
  };
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
