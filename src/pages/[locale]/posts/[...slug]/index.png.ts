import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { LOCALES } from "@/i18n/config";
import { getPath } from "@/utils/getPath";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import { SITE } from "@/config";

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const locales = LOCALES;
  const allPosts = await getCollection("blog");
  const posts = allPosts.filter(({ data }) => !data.draft && !data.ogImage);

  return locales.flatMap(locale =>
    posts
      .filter(post => post.data.locale === locale)
      .map(post => ({
        params: { locale, slug: getPath(post.id, post.filePath, false) },
        props: post,
      }))
  );
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const buffer = await generateOgImageForPost(props as CollectionEntry<"blog">);
  return new Response(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/png" },
  });
};
