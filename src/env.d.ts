interface Window {
  theme?: {
    themeValue: string;
    setPreference: () => void;
    reflectPreference: () => void;
    getTheme: () => string;
    setTheme: (val: string) => void;
  };
  __shareAC?: AbortController;
  __themeAC?: AbortController;
  __backBtnAC?: AbortController;
  __codeCopyAC?: AbortController;
  __codeFoldingAC?: AbortController;
  __imgZoomAC?: AbortController;
  __tocAC?: AbortController;
  __progressAC?: AbortController;
  __bttAC?: AbortController;
  __langAC?: AbortController;
  __navAC?: AbortController;
  __tipAC?: AbortController;
  __giscusAC?: AbortController;
  __toc?: {
    observer?: IntersectionObserver;
    scrollHandler?: (() => void) | null;
    hideTimeout?: number | undefined;
    showTimeout?: number | undefined;
    _init?: boolean;
    _tocAbort?: AbortController;
    _scrollTocTimer?: number;
    buildTOC?: () => void;
  };
}
