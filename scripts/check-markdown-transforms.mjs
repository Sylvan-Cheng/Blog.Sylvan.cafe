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
    if (request === "@/content.config") {
      return { BLOG_PATH: "src/data/blog" };
    }
    if (request === "astro:content") {
      return {};
    }
    if (request === "astro") {
      return {};
    }

    const resolved = resolveModule(request, filePath);
    return resolved.endsWith(".ts") ? loadTsModule(resolved) : nodeRequire(resolved);
  };

  vm.runInNewContext(output, {
    exports: module.exports,
    module,
    require: localRequire,
    URL,
  }, { filename: filePath });

  return module.exports;
}

const { buildHeadingId } = loadTsModule(resolve(rootDir, "src/plugins/headingIds.ts"));
const { buildImgProxyUrls } = loadTsModule(resolve(rootDir, "src/plugins/imgProxyUrls.ts"));
const { injectMermaidStyle } = loadTsModule(resolve(rootDir, "src/plugins/mermaidMarkup.ts"));
const { sanitizeHtmlTree } = loadTsModule(resolve(rootDir, "src/plugins/rehypeSafeHtml.ts"));
const {
  buildDocumentHeadModel,
  getScriptFont,
} = loadTsModule(resolve(rootDir, "src/utils/documentHeadModel.ts"));
const {
  buildLocalizedContentIndex,
} = loadTsModule(resolve(rootDir, "src/utils/localizedContentIndex.ts"));
const { getPath } = loadTsModule(resolve(rootDir, "src/utils/getPath.ts"));
const { serializeJsonLd } = loadTsModule(resolve(rootDir, "src/utils/layoutSeo.ts"));
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

assert.equal(getPath("hello-world/zh", "src/data/blog/hello-world/zh.md"), "/posts/hello-world/");
assert.equal(getPath("hello-world/zh", "src/data/blog/hello-world/zh.md", false), "hello-world");
assert.throws(
  () => getPath("hidden/zh", "src/data/blog/_draft/hidden/zh.md"),
  /Private blog directory/,
);
assert.throws(
  () => getPath("hidden/zh", "D:\\Server\\blog.sylvan.cafe\\src\\data\\blog\\_draft\\hidden\\zh.md"),
  /Private blog directory/,
);

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

const jsonLd = serializeJsonLd({ headline: "</script><script>alert(1)</script>" });
assert.doesNotMatch(jsonLd, /<\/script>/i);
assert.match(jsonLd, /\\u003c\/script\\u003e/);

const htmlTree = {
  type: "root",
  children: [
    {
      type: "element",
      tagName: "img",
      properties: { onError: "alert(1)", src: "javascript:alert(1)" },
      children: [],
    },
    {
      type: "element",
      tagName: "script",
      properties: {},
      children: [{ type: "text", value: "alert(1)" }],
    },
  ],
};
sanitizeHtmlTree(htmlTree);
assert.equal(htmlTree.children.length, 1);
assert.equal(htmlTree.children[0].properties.onError, undefined);
assert.equal(htmlTree.children[0].properties.src, undefined);

const post = ({
  id,
  locale,
  title,
  pubDatetime,
  modDatetime,
  tags = [],
  series,
}) => ({
  id,
  body: title,
  data: {
    locale,
    title,
    pubDatetime: new Date(pubDatetime),
    modDatetime: modDatetime ? new Date(modDatetime) : undefined,
    tags,
    series,
  },
});

const localizedIndex = buildLocalizedContentIndex([
  post({
    id: "alpha/en",
    locale: "en",
    title: "Alpha",
    pubDatetime: "2024-01-01",
    modDatetime: "2024-03-01",
    tags: ["Code"],
    series: "Astro Notes",
  }),
  post({
    id: "beta/en",
    locale: "en",
    title: "Beta",
    pubDatetime: "2024-02-01",
    tags: ["Code", "Life"],
    series: "Astro Notes",
  }),
  post({
    id: "gamma/zh",
    locale: "zh",
    title: "Gamma",
    pubDatetime: "2024-04-01",
    tags: ["Code"],
  }),
]);
assert.equal(
  JSON.stringify(localizedIndex.en.posts.map((entry) => entry.data.title)),
  JSON.stringify(["Alpha", "Beta"]),
);
assert.equal(
  JSON.stringify(localizedIndex.zh.posts.map((entry) => entry.data.title)),
  JSON.stringify(["Gamma"]),
);
assert.equal(
  JSON.stringify(localizedIndex.en.tags.find(({ tag }) => tag === "code").posts.map((entry) => entry.data.title)),
  JSON.stringify(["Alpha", "Beta"]),
);
assert.equal(localizedIndex.en.seriesGroups[0].key, "astro-notes");
assert.equal(
  JSON.stringify(localizedIndex.en.seriesGroups[0].posts.map((entry) => entry.data.title)),
  JSON.stringify(["Alpha", "Beta"]),
);

const fontAssets = {
  cyrillic400: "/fonts/cyrillic.woff2",
  jp400: "/fonts/jp.woff2",
  sc400: "/fonts/sc.woff2",
};
assert.equal(getScriptFont("zh", fontAssets), "/fonts/sc.woff2");
assert.equal(getScriptFont("ja", fontAssets), "/fonts/jp.woff2");
assert.equal(getScriptFont("ru", fontAssets), "/fonts/cyrillic.woff2");
assert.equal(getScriptFont("en", fontAssets), undefined);

const headModel = buildDocumentHeadModel({
  astro: {
    props: {
      title: "Post title | Site",
      description: "A long enough description.",
      pubDatetime: new Date("2024-05-01T00:00:00Z"),
      hreflangs: { en: "/en/posts/post-title/" },
    },
    url: new URL("https://blog.sylvan.cafe/zh/posts/post-title/"),
    site: new URL("https://blog.sylvan.cafe/"),
    generator: "Astro test",
  },
  locale: "zh",
  fontAssets,
});
assert.equal(headModel.canonicalURL.href, "https://blog.sylvan.cafe/zh/posts/post-title/");
assert.equal(headModel.scriptFont, "/fonts/sc.woff2");
assert.equal(headModel.isArticle, true);
assert.equal(headModel.hreflangLinks.find(({ locale }) => locale === "en").url.href, "https://blog.sylvan.cafe/en/posts/post-title/");
assert.equal(headModel.structuredData["@type"], "BlogPosting");

console.log("Markdown transform checks passed.");
