import type { Locale } from "./config";

// Flat concept table: each entry holds all translations of one tag
export const tagDictionary: Record<string, string>[] = [
  { en: "test", zh: "测试", ja: "テスト", ru: "тест" },
  { en: "life", zh: "生活", ja: "生活", ru: "жизнь" },
];

export function translateTag(
  tag: string,
  from: Locale,
  to: Locale,
): string | null {
  if (from === to) return tag;

  const normalizedTag = tag.toLowerCase();

  for (const entry of tagDictionary) {
    const fromVal = entry[from];
    if (fromVal && fromVal.toLowerCase() === normalizedTag) {
      return entry[to] ?? null;
    }
  }

  return null;
}
