import type { CollectionEntry } from "astro:content";
import getSortedPosts from "./getSortedPosts";
import { slugifyStr } from "./slugify";

const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  getSortedPosts(
    posts.filter((post) => post.data.tags.some((t) => slugifyStr(t) === tag)),
  );

export default getPostsByTag;
