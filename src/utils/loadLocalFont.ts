import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

// NOTE: process.cwd() is correct for Astro SSG builds as it resolves to project root.
// In monorepo/CI scenarios where cwd differs, set the working directory explicitly.
const NODE_MODULES = resolve(process.cwd(), "node_modules/@fontsource");

async function loadLocalFont(
  pkg: string,
  fileName: string,
): Promise<ArrayBuffer> {
  const filePath = resolve(NODE_MODULES, pkg, "files", fileName);
  const buffer = await readFile(filePath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

async function loadLocalFonts(
  _text: string,
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fonts = await Promise.all([
    loadLocalFont("noto-sans", "noto-sans-latin-400-normal.woff").then(
      (data) => ({ name: "Noto Sans", data, weight: 400, style: "normal" }),
    ),
    loadLocalFont("noto-sans", "noto-sans-latin-700-normal.woff").then(
      (data) => ({ name: "Noto Sans", data, weight: 700, style: "bold" }),
    ),
    loadLocalFont(
      "noto-sans-sc",
      "noto-sans-sc-chinese-simplified-400-normal.woff",
    ).then((data) => ({
      name: "Noto Sans SC",
      data,
      weight: 400,
      style: "normal",
    })),
    loadLocalFont("noto-sans-jp", "noto-sans-jp-japanese-400-normal.woff").then(
      (data) => ({
        name: "Noto Sans JP",
        data,
        weight: 400,
        style: "normal",
      }),
    ),
    loadLocalFont("noto-sans", "noto-sans-cyrillic-400-normal.woff").then(
      (data) => ({ name: "Noto Sans", data, weight: 400, style: "normal" }),
    ),
  ]);

  return fonts;
}

export default loadLocalFonts;
