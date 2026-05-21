interface Window {
  __giscusInit?: boolean;
  __giscusSync?: () => void;
  theme?: {
    themeValue: string;
    setPreference: () => void;
    reflectPreference: () => void;
    getTheme: () => string;
    setTheme: (val: string) => void;
  };
  __shareAC?: AbortController;
  __progressAC?: AbortController;
  __translations?: Record<string, string>;
  __currentLocale?: string;
  __toc?: {
    observer?: IntersectionObserver;
    scrollHandler?: (() => void) | null;
    hideTimeout?: number | undefined;
    showTimeout?: number | undefined;
    _init?: boolean;
    _tocAbort?: AbortController;
    buildTOC?: () => void;
  };
}
