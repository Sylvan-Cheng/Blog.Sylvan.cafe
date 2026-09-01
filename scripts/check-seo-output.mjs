import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.argv[2] ?? "dist");
const siteTitle = "Sylvan's Blog";
const failures = [];

function fail(message) {
  failures.push(message);
}

const sitemapFiles = (await readdir(root, { withFileTypes: true }))
  .filter(
    (entry) => entry.isFile() && /^sitemap-\d+\.xml$/i.test(entry.name),
  )
  .map((entry) => resolve(root, entry.name));

if (sitemapFiles.length === 0) {
  fail("No sitemap-*.xml file was generated.");
} else {
  for (const file of sitemapFiles) {
    const xml = await readFile(file, "utf8");
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = new URL(match[1]);
      const path = url.pathname.replace(/\/+$/, "") || "/";
      if (path === "/") fail(`${file} contains the root URL.`);
      if (/^\/[a-z]{2}\/404$/i.test(path)) {
        fail(`${file} contains a 404 URL: ${path}`);
      }
      if (/^\/[a-z]{2}\/search$/i.test(path)) {
        fail(`${file} contains a search URL: ${path}`);
      }
    }
  }
}

const localeDirectories = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^[a-z]{2}$/i.test(entry.name))
  .map((entry) => entry.name);

for (const locale of localeDirectories) {
  const searchPath = resolve(root, locale, "search", "index.html");
  try {
    const html = await readFile(searchPath, "utf8");
    const robots = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
    if (robots?.[1].toLowerCase() !== "noindex,follow") {
      fail(`${searchPath} is missing robots=noindex,follow.`);
    }
  } catch {
    fail(`${searchPath} was not generated.`);
  }
}

async function listArticleHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listArticleHtml(path)));
    } else if (
      /index\.html$/i.test(entry.name) &&
      /[\\/]posts[\\/].+[\\/]index\.html$/i.test(path)
    ) {
      files.push(path);
    }
  }
  return files;
}

for (const file of await listArticleHtml(root)) {
  const html = await readFile(file, "utf8");
  const jsonLd = html.match(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i,
  );
  if (!jsonLd) {
    fail(`${file} is missing BlogPosting JSON-LD.`);
    continue;
  }

  try {
    const structuredData = JSON.parse(jsonLd[1]);
    if (typeof structuredData.headline !== "string") {
      fail(`${file} JSON-LD headline is not a string.`);
    } else if (structuredData.headline.includes(`| ${siteTitle}`)) {
      fail(`${file} JSON-LD headline includes the site title.`);
    }
  } catch {
    fail(`${file} contains invalid JSON-LD.`);
  }
}

if (failures.length > 0) {
  console.error(`[seo-output] ${failures.length} assertion(s) failed:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `[seo-output] Sitemap, search robots, and ${localeDirectories.length} locale output checks passed.`,
  );
}
