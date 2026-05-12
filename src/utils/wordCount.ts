const CJK = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g;

function stripMarkdown(text: string): string {
  return text
    .replace(/^---[\s\S]*?^---/m, "")
    .replace(/^```[\s\S]*?^```/gm, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>]/g, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^:::\s*\w*.*$/gm, "")
    .trim();
}

export function countWords(text: string): number {
  const stripped = stripMarkdown(text);
  const cjk = (stripped.match(CJK) || []).length;
  const noCjk = stripped.replace(CJK, "");
  const latin = noCjk.trim().split(/\s+/).filter(Boolean).length;
  return cjk + latin;
}
