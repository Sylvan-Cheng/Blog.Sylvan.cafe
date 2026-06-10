import type { CollectionEntry } from "astro:content";
import { sortPosts } from "./blogRepository";
import { postFilter } from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return sortPosts(posts.filter(postFilter));
};

export default getSortedPosts;
