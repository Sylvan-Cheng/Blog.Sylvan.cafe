import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

const LOCALE_META: Record<string, { lang: string; label: string }> = {
  zh: { lang: "zh-CN", label: "中文" },
  en: { lang: "en-US", label: "English" },
  ja: { lang: "ja", label: "日本語" },
  ru: { lang: "ru", label: "Русский" },
};

export async function getStaticPaths() {
  return [
    { params: { locale: "zh" } },
    { params: { locale: "en" } },
    { params: { locale: "ja" } },
    { params: { locale: "ru" } },
  ];
}

export async function GET({ params }: { params: { locale: string } }) {
  const { locale } = params;
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
