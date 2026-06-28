import type { Dict, Locale, TemplateDict } from "./config";
import { LOCALES } from "./config";

export function t(dict: Dict, locale: Locale): string {
  return dict[locale];
}

export function tp<T>(dict: TemplateDict<T>, locale: Locale, arg: T): string {
  return dict[locale](arg);
}

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s);
}

export function resolveLocale(locale: string | undefined): Locale {
  if (locale && isLocale(locale)) return locale;
  if (import.meta.env.DEV && locale) {
    console.warn(
      `[i18n] Unrecognized locale "${locale}", falling back to "${LOCALES[0]}"`,
    );
  }
  return LOCALES[0];
}
