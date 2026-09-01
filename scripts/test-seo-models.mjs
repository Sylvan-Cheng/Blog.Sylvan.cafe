import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { resolve as resolvePath } from "node:path";
import { pathToFileURL } from "node:url";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(
        pathToFileURL(
          resolvePath(process.cwd(), "src", `${specifier.slice(2)}.ts`),
        ).href,
        context,
      );
    }
    return nextResolve(specifier, context);
  },
});

const {
  buildStructuredData,
  buildHreflangPath,
  serializeJsonLd,
} = await import("../src/utils/layoutSeo.ts");
const { getLocalesWithUrls } = await import("../src/utils/localeUrls.ts");
const { shouldIncludeInSitemap } = await import(
  "../src/utils/sitemapFilter.ts"
);

const alternateLocales = getLocalesWithUrls(["zh", "en", "ja"], {
  zh: "/zh/posts/example/",
  en: "/en/posts/example/",
});
assert.deepEqual(alternateLocales, ["zh", "en"]);
assert.deepEqual(getLocalesWithUrls(["zh", "en"]), ["zh", "en"]);
assert.equal(
  shouldIncludeInSitemap("https://blog.sylvan.cafe/zh/search/"),
  false,
);
assert.equal(
  shouldIncludeInSitemap("https://blog.sylvan.cafe/zh/posts/search/"),
  true,
);
assert.equal(shouldIncludeInSitemap("https://blog.sylvan.cafe/"), false);
assert.equal(
  buildStructuredData({
    title: "文章标题",
    author: "Author",
    description: "A sufficiently descriptive article.",
    socialImageURL: new URL("https://blog.sylvan.cafe/og.png"),
    canonicalURL: "https://blog.sylvan.cafe/zh/posts/example/",
    locale: "zh-CN",
    pubDatetime: new Date("2026-01-01T00:00:00Z"),
  }).headline,
  "文章标题",
);
assert.equal(
  buildHreflangPath("/zh/posts/example/", "ja", { ja: "/ja/posts/example/" }),
  "/ja/posts/example/",
);
assert.match(
  serializeJsonLd(buildStructuredData({
    title: "</script>",
    author: "Author",
    description: "A sufficiently descriptive article.",
    socialImageURL: new URL("https://blog.sylvan.cafe/og.png"),
    canonicalURL: "https://blog.sylvan.cafe/zh/posts/example/",
    locale: "zh-CN",
    pubDatetime: new Date("2026-01-01T00:00:00Z"),
  })),
  /\\u003c\/script\\u003e/,
);

console.log("SEO model regression tests passed.");
