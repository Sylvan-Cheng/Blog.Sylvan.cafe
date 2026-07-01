import { initInteraction, onSwap } from "./lifecycle";

const { signal, onCleanup } = initInteraction("__searchAC");

const SEARCH_INSTANCE = "site-search";
const searchWindow = window as Window & {
  __pagefindSearchUrlSyncRegistered?: boolean;
};

function scheduleIdle(callback: () => void): void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback);
    onCleanup(() => window.cancelIdleCallback(id));
    return;
  }

  const id = setTimeout(callback, 1);
  onCleanup(() => clearTimeout(id));
}

function updateSearchParam(term: string): void {
  const next = new URL(window.location.href);
  const trimmed = term.trim();

  if (trimmed) next.searchParams.set("q", trimmed);
  else next.searchParams.delete("q");

  history.replaceState(
    history.state,
    "",
    `${next.pathname}${next.search}${next.hash}`,
  );
}

function isCurrentSearchRoot(searchRoot: HTMLElement): boolean {
  return document.querySelector("[data-pagefind-search]") === searchRoot;
}

function getSearchLocale(searchRoot: HTMLElement): string {
  return (
    searchRoot.dataset.searchLocale || document.documentElement.lang || "en"
  );
}

function initSearch() {
  const searchRoot = document.querySelector<HTMLElement>(
    "[data-pagefind-search]",
  );
  if (!searchRoot || searchRoot.dataset.searchReady === "true") return;

  searchRoot.dataset.searchReady = "true";

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q")?.trim() ?? "";

  scheduleIdle(async () => {
    if (signal.aborted || !isCurrentSearchRoot(searchRoot)) return;

    const { getInstanceManager } = await import("@pagefind/component-ui");
    await Promise.all([
      customElements.whenDefined("pagefind-input"),
      customElements.whenDefined("pagefind-summary"),
      customElements.whenDefined("pagefind-results"),
    ]);

    if (signal.aborted || !isCurrentSearchRoot(searchRoot)) return;

    const instance = getInstanceManager().getInstance(SEARCH_INSTANCE);
    instance.setLanguage(getSearchLocale(searchRoot));
    if (!searchWindow.__pagefindSearchUrlSyncRegistered) {
      searchWindow.__pagefindSearchUrlSyncRegistered = true;
      instance.on("search", (term) => {
        if (
          typeof term === "string" &&
          document.querySelector("[data-pagefind-search]")
        )
          updateSearchParam(term);
      });
    }

    if (import.meta.env.DEV) {
      searchRoot.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="bg-muted/75 rounded p-4 space-y-4 mb-4" data-pagefind-dev-warning>
          <p><strong>DEV mode Warning! </strong>You need to build the project at least once to see the search results during development.</p>
          <code class="block bg-black text-white px-2 py-1 rounded">pnpm run build</code>
        </div>
      `,
      );
    }

    if (query) instance.triggerSearch(query);
  });
}

onSwap(initSearch, signal);
