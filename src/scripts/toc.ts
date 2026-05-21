(() => {
  type TocState = {
    observer?: IntersectionObserver;
    scrollHandler?: (() => void) | null;
    hideTimeout?: number | null;
    showTimeout?: number | null;
    _tocAbort?: AbortController;
    buildTOC: () => void;
  };

  const toc: TocState = (window as any).__toc ??= {} as TocState;
  toc.buildTOC = function () {
    const t: TocState = (window as any).__toc ??= {} as TocState;
    if (t.observer) {
      t.observer.disconnect();
    }
    if (t.scrollHandler) {
      document.removeEventListener("scroll", t.scrollHandler);
      t.scrollHandler = null;
    }
    if (t.hideTimeout) {
      clearTimeout(t.hideTimeout);
      t.hideTimeout = null;
    }
    if (t.showTimeout) {
      clearTimeout(t.showTimeout);
      t.showTimeout = null;
    }
    t._tocAbort?.abort();
    t._tocAbort = new AbortController();
    const tocSignal = t._tocAbort.signal;

    let tooltipRoot = document.getElementById("toc-tooltip-root");
    if (tooltipRoot) {
      tooltipRoot.innerHTML = "";
    }

    const article = document.getElementById("article");
    const tocContainer = document.getElementById("floating-toc");
    const tocList = document.getElementById("toc-list");
    if (!article || !tocContainer || !tocList) return;

    if (!tooltipRoot) {
      tooltipRoot = document.createElement("div");
      tooltipRoot.id = "toc-tooltip-root";
      document.body.appendChild(tooltipRoot);
    }

    const headings = Array.from(article.querySelectorAll("h2, h3"));

    headings.forEach((heading: Element, i: number) => {
      if (!heading.id) {
        heading.id =
          heading.textContent
            ?.trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-|-$/g, "") || `heading-${i}`;
      }
    });

    const HEADING_SCROLL_OFFSET = 80;
    const TOOLTIP_EDGE = 8;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollBehavior = prefersReducedMotion ? "instant" as ScrollBehavior : "smooth" as ScrollBehavior;

    tocList.addEventListener("click", (e) => {
      const a = (e.target as Element).closest("a");
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          HEADING_SCROLL_OFFSET;
        window.scrollTo({ top, behavior: scrollBehavior });
        history.replaceState(null, "", `#${id}`);
      }
    }, { signal: tocSignal });

    const tocItems = tocList.querySelectorAll("li a");
    const tooltipMap = new WeakMap<Element, HTMLElement>();

    function initTooltips() {
      const truncated: { a: Element; headingId: string; label: string }[] = [];
      tocItems.forEach((a) => {
        const textSpan = a.querySelector("span.block.truncate");
        if (!textSpan) return;
        if (textSpan.scrollWidth > textSpan.clientWidth) {
          const href = a.getAttribute("href") || "";
          truncated.push({ a, headingId: href.slice(1), label: textSpan.textContent || "" });
        }
      });
      const tooltips: HTMLElement[] = [];
      truncated.forEach(({ a, headingId, label }) => {
        const tooltip = document.createElement("span");
        tooltip.id = `toc-tooltip-${headingId}`;
        tooltip.role = "tooltip";
        tooltip.textContent = label;
        tooltip.className =
          "toc-dynamic-tooltip pointer-events-none fixed z-[9999] w-max max-w-[200px] whitespace-normal rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-md transition-opacity duration-200";
        tooltip.style.display = "block";
        tooltipRoot!.appendChild(tooltip);
        tooltipMap.set(a, tooltip);
        tooltips.push(tooltip);
      });
      for (const tooltip of tooltips) {
        const d = tooltip.getBoundingClientRect();
        (tooltip as any)._width = d.width;
        (tooltip as any)._height = d.height;
        tooltip.style.display = "none";
      }
    }

    let currentLink: Element | null = null;
    let rafId: number | null = null;

    function hideTooltip() {
      if (!currentLink) return;
      const tt = tooltipMap.get(currentLink);
      if (tt) {
        clearTimeout(t.showTimeout ?? undefined);
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        tt.style.opacity = "0";
        t.hideTimeout = window.setTimeout(() => {
          if (tt.style.opacity === "0") tt.style.display = "none";
          t.hideTimeout = null;
        }, 200);
      }
      currentLink = null;
    }

    function setupMouseEvents() {
      tocList!.addEventListener("mouseover", (e) => {
        const a = (e.target as Element).closest("li a");
        if (!a || a === currentLink) return;
        hideTooltip();
        const tooltip = tooltipMap.get(a);
        if (!tooltip) {
          currentLink = null;
          return;
        }
        currentLink = a;
        tooltip.style.display = "block";
        t.showTimeout = window.setTimeout(() => {
          tooltip.style.opacity = "1";
        }, 400);
      }, { signal: tocSignal });

      tocList!.addEventListener("mousemove", (e) => {
        if (!currentLink) return;
        if (rafId) return;
        const link = currentLink;
        const { clientX, clientY } = e;
        rafId = requestAnimationFrame(() => {
          const tt = tooltipMap.get(link);
          if (tt) {
            const w = (tt as any)._width || 200;
            const h = (tt as any)._height || 50;
            let left = clientX + 12;
            let top = clientY + 15;
            left = Math.max(
              TOOLTIP_EDGE,
              Math.min(
                left,
                document.documentElement.clientWidth - w - TOOLTIP_EDGE,
              ),
            );
            top = Math.max(
              TOOLTIP_EDGE,
              Math.min(
                top,
                document.documentElement.clientHeight - h - TOOLTIP_EDGE,
              ),
            );
            tt.style.left = `${left}px`;
            tt.style.top = `${top}px`;
          }
          rafId = null;
        });
      }, { signal: tocSignal });

      tocList!.addEventListener("mouseout", (e) => {
        const a = (e.target as Element).closest("li a");
        if (!a || a !== currentLink) return;
        if (e.relatedTarget && a.contains(e.relatedTarget as Node)) return;
        hideTooltip();
      }, { signal: tocSignal });
    }

    const topFade = document.getElementById("toc-fade-top");
    const bottomFade = document.getElementById("toc-fade-bottom");

    function updateFadeEdges() {
      if (!topFade || !bottomFade) return;
      if (tocList!.scrollHeight <= tocList!.clientHeight) {
        topFade.classList.add("hidden");
        bottomFade.classList.add("hidden");
        return;
      }
      topFade.classList.toggle("hidden", tocList!.scrollTop <= 0);
      const atBottom =
        tocList!.scrollTop + tocList!.clientHeight >= tocList!.scrollHeight - 2;
      bottomFade.classList.toggle("hidden", atBottom);
    }

    if (topFade && bottomFade) {
      tocList.addEventListener("scroll", updateFadeEdges, { passive: true, signal: tocSignal });
    }

    const tocLinks = Array.from(tocItems);

    let activeId: string | null = (headings[0] as HTMLElement)?.id || null;

    function updateActiveLink() {
      let activeLink: Element | null = null;
      for (const link of tocLinks) {
        const href = link.getAttribute("href");
        if (!href) continue;
        const id = href.slice(1);
        const isActive = id === activeId;
        link.classList.toggle("text-accent", isActive);
        link.classList.toggle("font-semibold", isActive);
        link.classList.toggle("border-accent/60", isActive);
        link.classList.toggle("text-foreground/60", !isActive);
        link.classList.toggle("border-transparent", !isActive);
        if (isActive) activeLink = link;
      }
      if (activeLink) {
        activeLink.scrollIntoView({ block: "nearest", behavior: scrollBehavior });
      }
    }

    t.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        }
        updateActiveLink();
      },
      {
        rootMargin: `-${HEADING_SCROLL_OFFSET}px 0px -65% 0px`,
        threshold: 0,
      },
    );

    for (const heading of headings) {
      t.observer.observe(heading);
    }

    if (document.getElementById("article") && document.body.contains(tocList)) {
      setupMouseEvents();
      updateFadeEdges();
      for (let i = headings.length - 1; i >= 0; i--) {
        if ((headings[i] as HTMLElement).getBoundingClientRect().top <= HEADING_SCROLL_OFFSET) {
          activeId = headings[i].id;
          break;
        }
      }
      updateActiveLink();
    }

    requestAnimationFrame(() => {
      if (!document.body.contains(tocList!)) return;
      initTooltips();
    });

    t.scrollHandler = function () {
      if (!document.body.contains(tocList!)) return;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;
      if (atBottom) {
        const lastHeading = headings[headings.length - 1];
        if (lastHeading && activeId !== lastHeading.id) {
          activeId = lastHeading.id;
          updateActiveLink();
        }
      }
    };
    document.addEventListener("scroll", t.scrollHandler, {
      passive: true,
    });
  };

  document.addEventListener("astro:page-load", () => requestAnimationFrame(toc.buildTOC));
})();

export {};
