export const LOCALES = ["zh", "en", "ja", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export type Dict = Record<Locale, string>;

export const LOCALE_SET = new Set<string>(LOCALES);

export const LOCALE_META: Record<Locale, { lang: string; label: string }> = {
  zh: { lang: "zh-CN", label: "中文" },
  en: { lang: "en-US", label: "English" },
  ja: { lang: "ja", label: "日本語" },
  ru: { lang: "ru", label: "Русский" },
};
