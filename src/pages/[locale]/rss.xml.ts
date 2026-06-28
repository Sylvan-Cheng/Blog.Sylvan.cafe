import rss from "@astrojs/rss";
import { SITE } from "@/config";
import type { Locale } from "@/i18n/config";
import { LOCALE_META, LOCALES } from "@/i18n/config";
import { getSortedPosts } from "@/utils/blogRepository";
import { getPostUrl } from "@/utils/contentIdentity";

export async function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}

export async function GET({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const meta = LOCALE_META[locale] ?? { lang: locale, label: locale };

  const sortedPosts = await getSortedPosts(locale);

  return rss({
    title: `${SITE.title} - ${meta.label}`,
    description: SITE.desc,
    site: SITE.website,
    customData: `<language>${meta.lang}</language>`,
    items: sortedPosts.map((post) => ({
      link: getPostUrl(post, locale),
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.modDatetime ?? post.data.pubDatetime,
      guid: new URL(getPostUrl(post, locale), SITE.website).href,
    })),
  });
}
