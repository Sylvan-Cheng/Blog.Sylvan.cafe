import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import sharp from "sharp";
import { buildImgProxyUrl } from "../src/utils/imgProxySigning.ts";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const CONTENT_GLOBS = ["src/data/blog", "src/data/pages"];
const METADATA_PATH = resolve(ROOT_DIR, "src/generated/image-metadata.json");
const S3_ORIGIN = "https://s3.sylvan.cafe/";
const S3_BLOG_BASE = `${S3_ORIGIN}img/blog/`;
const IMAGE_MARKDOWN_PATTERN =
  /!\[[^\]]*]\((https:\/\/s3\.sylvan\.cafe\/[^)\s]+)(?:\s+["'][^"']*["'])?\)|<img\b[^>]*\bsrc=["'](https:\/\/s3\.sylvan\.cafe\/[^"']+)["'][^>]*>/gi;

async function listMarkdownFiles(dir) {
  const entries = await import("node:fs/promises").then(({ readdir }) =>
    readdir(dir, { withFileTypes: true }),
  );
  const files = [];

  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(path)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }

  return files;
}

function extractS3ImageUrls(markdown) {
  const urls = new Set();
  for (const match of markdown.matchAll(IMAGE_MARKDOWN_PATTERN)) {
    const url = match[1] ?? match[2];
    if (url) urls.add(url);
  }
  return urls;
}

function getS3Key(url) {
  if (!url.startsWith(S3_ORIGIN)) return null;
  return decodeURI(url.slice(S3_ORIGIN.length));
}

function buildMetadataFetchUrl(url) {
  if (!url.startsWith(S3_BLOG_BASE)) return url;
  return buildImgProxyUrl(`plain/${url.slice(S3_BLOG_BASE.length)}`);
}

async function readCache() {
  try {
    return JSON.parse(await readFile(METADATA_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function fetchImageMetadata(url) {
  const metadataUrl = buildMetadataFetchUrl(url);
  const response = await fetch(metadataUrl, {
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (compatible; SylvanCafeImageMetadata/1.0; +https://blog.sylvan.cafe/)",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${metadataUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(buffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Missing image dimensions");
  }

  return {
    height: metadata.height,
    source: url,
    updatedAt: new Date().toISOString(),
    width: metadata.width,
  };
}

async function collectImageMetadata() {
  const markdownFiles = (
    await Promise.all(
      CONTENT_GLOBS.map((dir) => listMarkdownFiles(resolve(ROOT_DIR, dir))),
    )
  ).flat();
  const urls = new Set();

  for (const file of markdownFiles) {
    const markdown = await readFile(file, "utf8");
    for (const url of extractS3ImageUrls(markdown)) urls.add(url);
  }

  const cache = await readCache();
  const nextCache = {};
  let fetched = 0;
  let reused = 0;
  let failed = 0;

  for (const url of [...urls].sort()) {
    const key = getS3Key(url);
    if (!key) continue;

    if (
      cache[key]?.source === url &&
      Number.isFinite(cache[key]?.width) &&
      Number.isFinite(cache[key]?.height)
    ) {
      nextCache[key] = cache[key];
      reused++;
      continue;
    }

    try {
      nextCache[key] = await fetchImageMetadata(url);
      fetched++;
    } catch (error) {
      failed++;
      console.warn(
        `[image-metadata] ${relative(ROOT_DIR, METADATA_PATH)}: ${url} skipped (${error.message})`,
      );
    }
  }

  await mkdir(dirname(METADATA_PATH), { recursive: true });
  await writeFile(
    `${METADATA_PATH}.tmp`,
    `${JSON.stringify(nextCache, null, 2)}\n`,
  );
  await import("node:fs/promises").then(({ rename }) =>
    rename(`${METADATA_PATH}.tmp`, METADATA_PATH),
  );

  console.log(
    `[image-metadata] ${urls.size} image(s), ${fetched} fetched, ${reused} cached, ${failed} failed.`,
  );

  if (failed > 0) {
    throw new Error(
      `[image-metadata] Failed to collect metadata for ${failed} image(s).`,
    );
  }
}

await collectImageMetadata();
