import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { getPath } from "@/utils/getPath";

export const getStaticPaths = (async () => {
  const allPosts = await getCollection("blog", ({ data }) => !data.draft);
  return allPosts.map((post) => ({
    params: {
      locale: post.data.locale,
      slug: getPath(post.id, post.filePath, false),
    },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: CollectionEntry<"blog"> };
  return new Response(post.body ?? "", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
