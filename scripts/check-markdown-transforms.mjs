import assert from "node:assert/strict";
import { createRequire, registerHooks } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";
import ts from "typescript";
import { readFileSync } from "node:fs";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nodeRequire = createRequire(import.meta.url);
const moduleCache = new Map();
const rootUrl = pathToFileURL(rootDir).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier.startsWith(".") &&
      !/\.[cm]?[jt]s$/i.test(specifier) &&
      context.parentURL?.startsWith(rootUrl)
    ) {
      return nextResolve(`${specifier}.ts`, context);
    }

    return nextResolve(specifier, context);
  },
});

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
    if (request === "beautiful-mermaid") {
      return { renderMermaidSVG: () => "<svg><style></style></svg>" };
    }
    if (request === "katex") {
      return { default: { renderToString: (value) => value } };
    }
    const resolved = resolveModule(request, filePath);
    return resolved.endsWith(".ts")
      ? loadTsModule(resolved)
      : nodeRequire(resolved);
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
const {
  buildDocumentHeadModel,
  getScriptFont,
} = loadTsModule(resolve(rootDir, "src/utils/documentHeadModel.ts"));
const {
  buildLocalizedContentIndex,
} = loadTsModule(resolve(rootDir, "src/utils/localizedContentIndex.ts"));
const { getPath } = loadTsModule(resolve(rootDir, "src/utils/getPath.ts"));
const { serializeJsonLd } = loadTsModule(resolve(rootDir, "src/utils/layoutSeo.ts"));
const { slugifyStr } = loadTsModule(resolve(rootDir, "src/utils/slugify.ts"));
const { parseCodeMeta } = loadTsModule(resolve(rootDir, "src/utils/transformers/codeMetaParser.ts"));
const { satteriHastPlugins, satteriMdastPlugins } = await import(
  "../src/plugins/satteriMarkdown.ts"
);

async function checkSatteriProcessorSmoke() {
  const renderer = await createSatteriMarkdownProcessor({
    syntaxHighlight: false,
    features: { math: true },
    mdastPlugins: satteriMdastPlugins,
    hastPlugins: satteriHastPlugins,
  });

  const result = await renderer.render(
    `## Hello World

> [!NOTE]
> alert body

![s3](https://s3.sylvan.cafe/a/b.png)

<script>alert(1)</script>
<img src="javascript:alert(1)" onerror="alert(1)" alt="bad">
<a href="java&#x73;cript:alert(1)" onclick="alert(1)" title="ok">bad</a>
<div onclick="alert(1)" class="note"><span>ok</span></div>

$$
x^2
$$
`,
    {
      fileURL: new URL("file:///satteri-smoke.md"),
      frontmatter: {},
    },
  );

  assert.match(result.code, /markdown-alert-note/);
  assert.match(result.code, /https:\/\/img\.sylvan\.cafe\/unsafe\/w:800\/plain\/a\/b\.png/);
  assert.match(result.code, /data-zoom-src="https:\/\/img\.sylvan\.cafe\/unsafe\/plain\/a\/b\.png"/);
  assert.match(result.code, /class="katex-display"/);
  assert.match(result.code, /id="hello-world"/);
  assert.match(result.code, /class="heading-link[^"]*"/);
  assert.deepEqual(result.metadata.headings, [
    { depth: 2, slug: "hello-world", text: "Hello World" },
  ]);
  assert.doesNotMatch(result.code, /<script/i);
  assert.doesNotMatch(result.code, /javascript:alert/);
  assert.doesNotMatch(result.code, /onerror=/i);
  assert.doesNotMatch(result.code, /onclick=/i);
  assert.match(result.code, /title="ok"/);
  assert.match(result.code, /class="note"/);
  assert.match(result.code, />bad</);
  assert.match(result.code, />ok</);
}

const fullMeta = parseCodeMeta('file="demo.ts" collapse nolines');
assert.equal(fullMeta.collapse, true);
assert.equal(fullMeta.file, "demo.ts");
assert.equal(fullMeta.nolines, true);

const emptyMeta = parseCodeMeta();
assert.equal(emptyMeta.collapse, false);
assert.equal(emptyMeta.file, undefined);
assert.equal(emptyMeta.nolines, false);

assert.equal(slugifyStr("E2E Testing"), "e2e-testing");
assert.equal(slugifyStr("TypeScript 5.0"), "typescript-5.0");
assert.equal(slugifyStr("中文 标题 123"), "中文-标题-123");
assert.equal(slugifyStr("Hello 世界 123"), "hello-世界-123");
assert.equal(slugifyStr("日本語 テスト 7"), "日本語-テスト-7");

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

await checkSatteriProcessorSmoke();

console.log("Markdown transform checks passed.");
