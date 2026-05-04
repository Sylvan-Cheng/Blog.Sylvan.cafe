import { LOCALES } from "./config";
import type { Locale } from "./config";

export function t(dict: Record<string, string>, locale: Locale): string {
  return dict[locale] ?? dict[LOCALES[0]] ?? "";
}

export function resolveLocale(locale: string | undefined): Locale {
  if (locale && (LOCALES as readonly string[]).includes(locale)) {
    return locale as Locale;
  }
  return LOCALES[0];
}
