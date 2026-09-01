export type LocaleUrlMap<T extends string = string> = Partial<
  Record<T, string>
>;

export function getLocalesWithUrls<T extends string>(
  locales: readonly T[],
  localeUrls?: LocaleUrlMap<T>,
): T[] {
  return localeUrls
    ? locales.filter((locale) => Boolean(localeUrls[locale]))
    : [...locales];
}
