import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const S3_BASE = "https://s3.sylvan.cafe/";
const CACHE_PATH = resolve(process.cwd(), ".astro/image-metadata-cache.json");

type ImageMetadata = {
  height: number;
  source?: string;
  width: number;
};

let imageMetadataCache: Record<string, ImageMetadata> | null = null;

function loadImageMetadata(): Record<string, ImageMetadata> {
  if (imageMetadataCache) return imageMetadataCache;
  if (!existsSync(CACHE_PATH)) {
    imageMetadataCache = {};
    return imageMetadataCache;
  }

  try {
    imageMetadataCache = JSON.parse(readFileSync(CACHE_PATH, "utf8"));
  } catch {
    imageMetadataCache = {};
  }
  return imageMetadataCache ?? {};
}

export function getS3ImageKey(src: string): string | null {
  if (!src.startsWith(S3_BASE)) return null;
  return decodeURI(src.slice(S3_BASE.length));
}

export function getS3ImageMetadata(src: string): ImageMetadata | null {
  const key = getS3ImageKey(src);
  if (!key) return null;

  const metadata = loadImageMetadata()[key];
  if (!metadata) return null;
  if (
    !Number.isFinite(metadata.width) ||
    !Number.isFinite(metadata.height) ||
    metadata.width <= 0 ||
    metadata.height <= 0
  ) {
    return null;
  }

  return metadata;
}
