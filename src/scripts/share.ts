(() => {
  if (window.__shareAC) window.__shareAC.abort();
  const ac = new AbortController();
  window.__shareAC = ac;

  const mobileQuery = window.matchMedia('not all and (min-width: 768px)');
  let mobile = mobileQuery.matches;

  let expanded = false;
  const expandStagger = 50;
  const expandDuration = 300;
  let timerWrap: ReturnType<typeof setTimeout> | undefined;
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  function getEls() {
    const container = document.querySelector<HTMLElement>('[data-share-container]');
    if (!container) return null;
    return {
      container,
      wrapper: container.querySelector<HTMLElement>('[data-share-more]'),
      items: container.querySelectorAll('.more-item') as NodeListOf<HTMLElement>,
      toggle: container.querySelector<HTMLElement>('[data-share-toggle]'),
      get toggleCollapsed() { return this.toggle?.querySelector('.share-toggle-collapsed') ?? null; },
      get toggleExpanded() { return this.toggle?.querySelector('.share-toggle-expanded') ?? null; },
      get tooltipSpan() { return this.toggle?.parentElement?.querySelector<HTMLElement>('[data-tooltip-text]') ?? null; },
      copyDefault: container.querySelector('.share-copy-default') as HTMLElement | null,
      copySuccess: container.querySelector('.share-copy-success') as HTMLElement | null,
      copyLive: container.querySelector<HTMLElement>('[data-share-live]'),
    };
  }

  function expand() {
    const els = getEls();
    if (!els || !els.wrapper || !els.toggle) return;
    clearTimeout(timerWrap);
    if (mobile) {
      els.wrapper.style.maxWidth = 'none';
      els.wrapper.style.transition = 'max-height 500ms ease-out';
      els.wrapper.style.maxHeight = '12rem';
    } else {
      els.wrapper.style.maxHeight = 'none';
      els.wrapper.style.transition = 'max-width 500ms ease-out';
      els.wrapper.style.maxWidth = '30rem';
    }
    els.items.forEach(function(item, i) {
      item.style.transitionDelay = (i * expandStagger) + 'ms';
      item.style.transitionDuration = expandDuration + 'ms';
      item.style.transform = mobile ? '' : 'translateX(0)';
      item.setAttribute('tabindex', '0');
      item.classList.add('opacity-100', 'pointer-events-auto');
      item.classList.remove('opacity-0', 'pointer-events-none');
    });
    els.toggleCollapsed?.classList.add('hidden');
    els.toggleExpanded?.classList.remove('hidden');
    els.toggle.setAttribute('aria-expanded', 'true');
    updateToggleTip(els, true);
  }

  function updateToggleTip(els: NonNullable<ReturnType<typeof getEls>>, expanded: boolean) {
    if (!els.toggle) return;
    const tip = expanded ? els.toggle.dataset.tipExpanded : els.toggle.dataset.tipCollapsed;
    if (els.tooltipSpan && tip) els.tooltipSpan.textContent = tip;
    if (tip) els.toggle.setAttribute('aria-label', tip);
  }

  function collapse() {
    const els = getEls();
    if (!els || !els.wrapper || !els.toggle) return;
    clearTimeout(timerWrap);
    els.toggleExpanded?.classList.add('hidden');
    els.toggleCollapsed?.classList.remove('hidden');
    els.toggle.setAttribute('aria-expanded', 'false');
    updateToggleTip(els, false);
    els.items.forEach(function(item) {
      item.style.transitionDelay = '0ms';
      item.style.transitionDuration = '150ms';
      item.style.transform = mobile ? '' : 'translateX(-0.75rem)';
      item.setAttribute('tabindex', '-1');
      item.classList.add('opacity-0', 'pointer-events-none');
      item.classList.remove('opacity-100', 'pointer-events-auto');
    });
    timerWrap = setTimeout(function() {
      const els2 = getEls();
      if (!els2 || !els2.wrapper) return;
      els2.wrapper.style.transition = mobile ? 'max-height 300ms ease-out' : 'max-width 300ms ease-out';
      if (mobile) els2.wrapper.style.maxHeight = '0';
      else els2.wrapper.style.maxWidth = '0';
      timerWrap = undefined;
    }, 100);
  }

  function reset() {
    const els = getEls();
    if (!els || !document.body.contains(els.container)) return;
    expanded = false;
    clearTimeout(timerWrap);
    if (els.wrapper) {
      els.wrapper.style.transition = 'none';
      els.wrapper.style.maxWidth = '0';
      els.wrapper.style.maxHeight = '0';
    }
    els.items.forEach(function(item) {
      item.style.transitionDelay = '0ms';
      item.style.transitionDuration = '0ms';
      item.style.transform = '';
      item.setAttribute('tabindex', '-1');
      item.classList.add('opacity-0', 'pointer-events-none');
      item.classList.remove('opacity-100', 'pointer-events-auto');
    });
    els.toggleCollapsed?.classList.remove('hidden');
    els.toggleExpanded?.classList.add('hidden');
    if (els.toggle) {
      els.toggle.setAttribute('aria-expanded', 'false');
      updateToggleTip(els, false);
    }
    if (els.copyDefault) els.copyDefault.classList.remove('hidden');
    if (els.copySuccess) els.copySuccess.classList.add('hidden');
  }

  function clipboardCopy() {
    const els = getEls();
    if (!navigator.clipboard) {
      if (els?.copyDefault) els.copyDefault.classList.add('hidden');
      if (els?.copySuccess) els.copySuccess.classList.add('hidden');
      if (els?.copyLive) els.copyLive.textContent = els.copyLive.dataset.liveUnsupported || '';
      return;
    }
    navigator.clipboard.writeText(location.href).then(function() {
      if (els?.copyDefault) els.copyDefault.classList.add('hidden');
      if (els?.copySuccess) els.copySuccess.classList.remove('hidden');
      if (els?.copyLive) els.copyLive.textContent = els.copyLive.dataset.liveSuccess || '';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function() {
        const els2 = getEls();
        if (els2?.copySuccess) els2.copySuccess.classList.add('hidden');
        if (els2?.copyDefault) els2.copyDefault.classList.remove('hidden');
      }, 1200);
    }).catch(function() {
      if (els?.copyDefault) els.copyDefault.classList.add('hidden');
      if (els?.copySuccess) els.copySuccess.classList.add('hidden');
      if (els?.copyLive) els.copyLive.textContent = els.copyLive.dataset.liveError || '';
    });
  }

  function doNativeShare() {
    if (navigator.share) {
      navigator.share({ url: location.href }).catch(function() {});
    } else {
      clipboardCopy();
    }
  }

  function onToggleClick(e: Event) {
    e.preventDefault();
    expanded = !expanded;
    if (expanded) expand();
    else collapse();
  }

  function onShareBtnClick(e: Event) {
    const btn = (e.target as Element).closest('[data-share-btn]') as HTMLElement | null;
    if (!btn) return;

    const icon = btn.dataset.shareBtn;
    if (icon === 'copy') {
      e.preventDefault();
      clipboardCopy();
      return;
    }
    if (icon === 'brand-wechat' || icon === 'brand-qq') {
      e.preventDefault();
      doNativeShare();
      return;
    }

    const href = btn.getAttribute('href');
    if (!href || href === '#') e.preventDefault();
  }

  function init() {
    const els = getEls();
    if (!els) return;

    els.toggle?.addEventListener('click', onToggleClick, { signal: ac.signal });
    els.container.addEventListener('click', onShareBtnClick, { signal: ac.signal });
  }

  init();
  reset();

  mobileQuery.addEventListener('change', function() {
    mobile = mobileQuery.matches;
    if (!expanded) return;
    reset();
  }, { signal: ac.signal });

  document.addEventListener('astro:after-swap', function() {
    init();
    reset();
  }, { signal: ac.signal });
})();

export {};
