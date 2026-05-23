import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

interface Tag {
  tag: string;
  tagName: string;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const seen = new Set<string>();
  const tags: Tag[] = posts
    .filter(postFilter)
    .flatMap((post) => post.data.tags)
    .reduce<Tag[]>((acc, tag) => {
      const slug = slugifyStr(tag);
      if (!seen.has(slug)) {
        seen.add(slug);
        acc.push({ tag: slug, tagName: tag });
      }
      return acc;
    }, [])
    .sort((tagA, tagB) =>
      tagA.tag.localeCompare(tagB.tag, "en", { sensitivity: "base" }),
    );
  return tags;
};

export default getUniqueTags;
