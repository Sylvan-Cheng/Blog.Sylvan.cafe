import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const FONT_BASE = resolve(
  process.cwd(),
  "node_modules/@fontsource/noto-sans/files"
);

async function loadLocalFont(fileName: string): Promise<ArrayBuffer> {
  const filePath = resolve(FONT_BASE, fileName);
  const buffer = await readFile(filePath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}

async function loadGoogleFonts(
  _text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fonts = await Promise.all([
    loadLocalFont("noto-sans-latin-400-normal.woff").then(data => ({
      name: "Noto Sans",
      data,
      weight: 400,
      style: "normal",
    })),
    loadLocalFont("noto-sans-latin-700-normal.woff").then(data => ({
      name: "Noto Sans",
      data,
      weight: 700,
      style: "bold",
    })),
  ]);

  return fonts;
}

export default loadGoogleFonts;
