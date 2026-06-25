import type { CollectionEntry } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { getPosts } from "@/utils/blogRepository";
import { getPostSlugPath } from "@/utils/contentIdentity";

export const getStaticPaths = (async () => {
  const allPosts = await getPosts();
  return allPosts.map((post) => ({
    params: {
      locale: post.data.locale,
      slug: getPostSlugPath(post),
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
