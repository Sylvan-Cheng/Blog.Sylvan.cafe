import { LOCALES, LOCALE_SET } from "./config";
import type { Locale, Dict } from "./config";

export function t(dict: Dict, locale: Locale): string {
  return dict[locale];
}

export function resolveLocale(locale: string | undefined): Locale {
  if (locale && LOCALE_SET.has(locale)) return locale as Locale;
  return LOCALES[0];
}
