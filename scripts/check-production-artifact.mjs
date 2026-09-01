import { readdir, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "dist");
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".txt",
  ".xml",
]);

async function listTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listTextFiles(path)));
    } else if (textExtensions.has(extname(entry.name).toLowerCase())) {
      files.push(path);
    }
  }

  return files;
}

const matches = [];
for (const file of await listTextFiles(root)) {
  const content = await readFile(file, "utf8");
  if (content.includes("/unsafe/")) matches.push(file);
}

if (matches.length > 0) {
  console.error(
    `[production-artifact] Unsigned imgproxy URLs found in ${matches.length} file(s):`,
  );
  for (const file of matches) console.error(`- ${file}`);
  process.exitCode = 1;
} else {
  console.log("[production-artifact] No unsigned imgproxy URLs found.");
}
