import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { LOCALE_META, LOCALES } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function getStaticPaths() {
  return LOCALES.map(locale => ({ params: { locale } }));
}

export async function GET({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const meta = LOCALE_META[locale] ?? { lang: locale, label: locale };

  const allPosts = await getCollection("blog", ({ data }) => !data.draft);
  const posts = allPosts.filter((p) => p.data.locale === locale);
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: `${SITE.title} (${meta.label})`,
    description: SITE.desc,
    site: SITE.website,
    customData: `<language>${meta.lang}</language>`,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: `/${locale}${getPath(id, filePath)}`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
