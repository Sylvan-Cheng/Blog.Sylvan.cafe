export type ParsedCodeMeta = {
  collapse: boolean;
  file?: string;
  nolines: boolean;
};

export function parseCodeMeta(raw?: string): ParsedCodeMeta {
  const metaMap = new Map<string, string>();

  for (const item of raw?.split(" ") ?? []) {
    const eqIdx = item.indexOf("=");
    const key = eqIdx === -1 ? item : item.slice(0, eqIdx);
    const value =
      eqIdx === -1 ? undefined : item.slice(eqIdx + 1).replace(/["'`]/g, "");
    if (!key) continue;
    metaMap.set(key, value !== undefined ? value : "true");
  }

  return {
    collapse: metaMap.get("collapse") === "true",
    file: metaMap.get("file"),
    nolines: metaMap.get("nolines") === "true",
  };
}
