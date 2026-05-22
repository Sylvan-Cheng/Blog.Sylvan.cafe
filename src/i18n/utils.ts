import type { Dict, Locale, TemplateDict } from "./config";
import { LOCALES } from "./config";

export function t(dict: Dict, locale: Locale): string {
  return dict[locale];
}

export function tp(dict: TemplateDict, locale: Locale, arg: string): string {
  return dict[locale](arg);
}

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s);
}

export function resolveLocale(locale: string | undefined): Locale {
  return locale && isLocale(locale) ? locale : LOCALES[0];
}
