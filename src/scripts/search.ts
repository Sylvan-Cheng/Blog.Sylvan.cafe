import { initInteraction, onSwap } from "./lifecycle";

const { signal, onCleanup } = initInteraction("__searchAC");

function scheduleIdle(callback: () => void): void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback);
    onCleanup(() => window.cancelIdleCallback(id));
    return;
  }

  const id = setTimeout(callback, 1);
  onCleanup(() => clearTimeout(id));
}

function removeSearchParam() {
  history.replaceState(history.state, "", window.location.pathname);
}

function syncSearchParam(event: Event) {
  const input = event.currentTarget as HTMLInputElement | null;
  if (input?.value.trim() === "") removeSearchParam();
}

function isCurrentSearchRoot(pagefindSearch: HTMLElement): boolean {
  return document.querySelector("#pagefind-search") === pagefindSearch;
}

function initSearch() {
  const pagefindSearch =
    document.querySelector<HTMLElement>("#pagefind-search");
  if (!pagefindSearch || pagefindSearch.querySelector("form")) return;

  const params = new URLSearchParams(window.location.search);

  scheduleIdle(async () => {
    if (signal.aborted || !isCurrentSearchRoot(pagefindSearch)) return;

    // @ts-expect-error — Missing types for @pagefind/default-ui package.
    const { PagefindUI } = await import("@pagefind/default-ui");
    if (
      signal.aborted ||
      !isCurrentSearchRoot(pagefindSearch) ||
      pagefindSearch.querySelector("form")
    ) {
      return;
    }

    if (import.meta.env.DEV) {
      pagefindSearch.innerHTML = `
        <div class="bg-muted/75 rounded p-4 space-y-4 mb-4">
          <p><strong>DEV mode Warning! </strong>You need to build the project at least once to see the search results during development.</p>
          <code class="block bg-black text-white px-2 py-1 rounded">pnpm run build</code>
        </div>
      `;
    }

    const search = new PagefindUI({
      element: "#pagefind-search",
      showImages: false,
      showSubResults: true,
      processTerm(term: string) {
        params.set("q", term);
        history.replaceState(history.state, "", `?${params.toString()}`);
        return term;
      },
    });

    const query = params.get("q");
    if (query) search.triggerSearch(query);

    document
      .querySelector<HTMLInputElement>(".pagefind-ui__search-input")
      ?.addEventListener("input", syncSearchParam, { signal });
    document
      .querySelector<HTMLButtonElement>(".pagefind-ui__search-clear")
      ?.addEventListener("click", removeSearchParam, { signal });
  });
}

onSwap(initSearch, signal);
