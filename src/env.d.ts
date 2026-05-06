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
  __translations?: Record<string, string>;
  __currentLocale?: string;
  __scrollBound?: boolean;
  __tocObserver?: IntersectionObserver;
  __tocScrollHandler?: (() => void) | null;
  __tocHideTimeout?: ReturnType<typeof setTimeout> | null;
}
