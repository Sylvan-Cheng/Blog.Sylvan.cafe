import { slugifyStr } from "../utils/slugify";

export function buildHeadingId(
  text: string,
  usedIds: Set<string>,
  fallback: string,
): string {
  const baseId = slugifyStr(text) || fallback;
  let id = baseId;

  if (usedIds.has(id)) {
    let suffix = 2;
    while (usedIds.has(`${baseId}-${suffix}`)) suffix++;
    id = `${baseId}-${suffix}`;
  }

  usedIds.add(id);
  return id;
}
