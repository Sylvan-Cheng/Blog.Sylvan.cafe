import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";
import { readFileSync } from "node:fs";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nodeRequire = createRequire(import.meta.url);
const moduleCache = new Map();

function resolveModule(request, parentFile) {
  if (request.startsWith(".")) {
    const resolved = resolve(dirname(parentFile), request);
    return resolved.endsWith(".ts") ? resolved : `${resolved}.ts`;
  }

  if (request.startsWith("@/")) {
    return resolve(rootDir, "src", `${request.slice(2)}.ts`);
  }

  return request;
}

function loadTsModule(filePath) {
  if (moduleCache.has(filePath)) return moduleCache.get(filePath).exports;

  const source = readFileSync(filePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(filePath, module);

  const localRequire = (request) => {
    const resolved = resolveModule(request, filePath);
    return resolved.endsWith(".ts") ? loadTsModule(resolved) : nodeRequire(resolved);
  };

  vm.runInNewContext(output, {
    exports: module.exports,
    module,
    require: localRequire,
  }, { filename: filePath });

  return module.exports;
}

const { buildHeadingId } = loadTsModule(resolve(rootDir, "src/plugins/headingIds.ts"));
const { buildImgProxyUrls } = loadTsModule(resolve(rootDir, "src/plugins/imgProxyUrls.ts"));
const { injectMermaidStyle } = loadTsModule(resolve(rootDir, "src/plugins/mermaidMarkup.ts"));
const { parseCodeMeta } = loadTsModule(resolve(rootDir, "src/utils/transformers/codeMetaParser.ts"));

const fullMeta = parseCodeMeta('file="demo.ts" collapse nolines');
assert.equal(fullMeta.collapse, true);
assert.equal(fullMeta.file, "demo.ts");
assert.equal(fullMeta.nolines, true);

const emptyMeta = parseCodeMeta();
assert.equal(emptyMeta.collapse, false);
assert.equal(emptyMeta.file, undefined);
assert.equal(emptyMeta.nolines, false);

const usedIds = new Set();
assert.equal(buildHeadingId("Hello World", usedIds, "fallback"), "hello-world");
assert.equal(buildHeadingId("Hello World", usedIds, "fallback"), "hello-world-2");

assert.equal(buildImgProxyUrls("https://example.com/image.png"), null);
const imgProxyUrls = buildImgProxyUrls("https://s3.sylvan.cafe/a/b.png", 320, 180);
assert.equal(imgProxyUrls.fullUrl, "https://img.sylvan.cafe/unsafe/plain/a/b.png");
assert.equal(
  imgProxyUrls.thumbUrl,
  "https://img.sylvan.cafe/unsafe/rs:fit:320:180/plain/a/b.png",
);

const injected = injectMermaidStyle("<svg><style>old</style><text>Hi</text></svg>");
assert.match(injected, /--_text:\s+var\(--mermaid-fg\)/);
assert.doesNotMatch(injected, /old/);

console.log("Markdown transform checks passed.");
