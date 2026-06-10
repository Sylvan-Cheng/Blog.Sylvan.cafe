import { initInteraction, onSwap } from "./lifecycle";

const { signal, onCleanup } = initInteraction("__giscusAC");

function getGiscusScript(): HTMLScriptElement | null {
  return document.querySelector<HTMLScriptElement>("#giscus-script");
}

function getTheme(script: HTMLScriptElement): string {
  const isDark = document.documentElement.dataset.theme === "dark";
  return isDark
    ? script.dataset.darkTheme || "dark"
    : script.dataset.lightTheme || "light";
}

function syncGiscusTheme() {
  const script = getGiscusScript();
  if (!script) return;
  const theme = getTheme(script);
  script.setAttribute("data-theme", theme);

  const frame = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame",
  );
  frame?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme } } },
    "https://giscus.app",
  );
}

function remountGiscus() {
  const oldFrame = document.querySelector("iframe.giscus-frame");
  oldFrame?.remove();

  const script = getGiscusScript();
  if (!script) return;

  const newScript = document.createElement("script");
  for (const attr of script.attributes) {
    newScript.setAttribute(attr.name, attr.value);
  }
  script.replaceWith(newScript);
  syncGiscusTheme();
}

const observer = new MutationObserver(syncGiscusTheme);
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});
onCleanup(() => observer.disconnect());

window.addEventListener(
  "message",
  (event) => {
    if (event.origin !== "https://giscus.app") return;
    if (!(typeof event.data === "object" && event.data.giscus)) return;
    syncGiscusTheme();
  },
  { signal },
);

onSwap(remountGiscus, signal);
syncGiscusTheme();
