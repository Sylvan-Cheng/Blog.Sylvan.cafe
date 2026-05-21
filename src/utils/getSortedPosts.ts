import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        (b.data.modDatetime ?? b.data.pubDatetime ?? new Date(0)).getTime() -
        (a.data.modDatetime ?? a.data.pubDatetime ?? new Date(0)).getTime(),
    );
};

export default getSortedPosts;
