import fs from "node:fs";
import path from "node:path";

export const KATEX_PRELOAD_FONTS = [
  "KaTeX_Main-Regular.woff2",
  "KaTeX_Main-Bold.woff2",
  "KaTeX_Math-Italic.woff2",
  "KaTeX_Size1-Regular.woff2",
];

export function loadKatexCss(enabled: boolean): string {
  return enabled
    ? fs.readFileSync(path.resolve("public/assets/katex.min.css"), "utf-8")
    : "";
}
