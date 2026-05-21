import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";
import { getPath } from "@/utils/getPath";

export function getOgImage(
  post: CollectionEntry<"blog">,
  locale: string,
): string | undefined {
  const initOgImage = post.data.ogImage;
  let ogImageUrl: string | undefined;

  if (typeof initOgImage === "string") {
    ogImageUrl = initOgImage;
  } else if (initOgImage?.src) {
    ogImageUrl = initOgImage.src;
  }

  const localizePostPath = (id: string, filePath?: string) =>
    `/${locale}${getPath(id, filePath)}`;

  if (!ogImageUrl && SITE.dynamicOgImage) {
    ogImageUrl = `${localizePostPath(post.id, post.filePath)}index.png`;
  }

  return ogImageUrl;
}
