import slugify from "slugify";

/**
 * Check if string contains non-Latin characters
 */
const hasNonLatin = (str: string): boolean => /[^\x20-\x7E]/u.test(str);

const slugifyMixedScript = (str: string): string =>
  str
    .normalize("NFKC")
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1-$2")
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1-$2")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Slugify a string using a hybrid approach:
 * - For Latin-only strings: use slugify (eg: "E2E Testing" -> "e2e-testing", "TypeScript 5.0" -> "typescript-5.0")
 * - For strings with non-Latin characters: preserve Unicode letters and normalize separators
 */
export const slugifyStr = (str: string): string => {
  if (hasNonLatin(str)) {
    return slugifyMixedScript(str);
  }

  // Handle Latin strings with better number/acronym handling
  return slugify(str, { lower: true });
};
