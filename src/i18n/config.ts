export const LOCALES = ["zh", "en", "ja", "ru", "eo"] as const;
export type Locale = (typeof LOCALES)[number];
export type Dict = Record<Locale, string>;
export type TemplateDict = Record<Locale, (arg: string) => string>;

export const LOCALE_META: Record<Locale, { lang: string; label: string }> = {
  zh: { lang: "zh-CN", label: "中文" },
  en: { lang: "en-US", label: "English" },
  ja: { lang: "ja", label: "日本語" },
  ru: { lang: "ru", label: "Русский" },
  eo: { lang: "eo", label: "Esperanto" },
};
