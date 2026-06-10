import type { CollectionEntry } from "astro:content";
import type { APIRoute } from "astro";
import { SITE } from "@/config";
import { LOCALES } from "@/i18n/config";
import { getPublishedPosts } from "@/utils/blogRepository";
import { getPostSlugPath } from "@/utils/contentIdentity";
import { generateOgImageForPost } from "@/utils/generateOgImages";

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const locales = LOCALES;
  const allPosts = await getPublishedPosts();
  const posts = allPosts.filter(({ data }) => !data.ogImage);

  return locales.flatMap((locale) =>
    posts
      .filter((post) => post.data.locale === locale)
      .map((post) => ({
        params: { locale, slug: getPostSlugPath(post) },
        props: post,
      })),
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
