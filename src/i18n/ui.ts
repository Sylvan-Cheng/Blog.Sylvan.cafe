import type { Locale, Dict } from "./config";

type TemplateDict = Record<Locale, (arg: string) => string>;

export const UI = {
  /** Header / Navigation */
  nav: {
    skipToContent: {
      zh: "跳转到内容",
      en: "Skip to content",
      ja: "コンテンツへスキップ",
      ru: "Перейти к содержимому",
    } satisfies Dict,
    posts: {
      zh: "文章",
      en: "Posts",
      ja: "記事",
      ru: "Записи",
    } satisfies Dict,
    tags: {
      zh: "标签",
      en: "Tags",
      ja: "タグ",
      ru: "Теги",
    } satisfies Dict,
    about: {
      zh: "关于",
      en: "About",
      ja: "概要",
      ru: "О сайте",
    } satisfies Dict,
    archives: {
      zh: "归档",
      en: "Archives",
      ja: "アーカイブ",
      ru: "Архив",
    } satisfies Dict,
    search: {
      zh: "搜索",
      en: "Search",
      ja: "検索",
      ru: "Поиск",
    } satisfies Dict,
  },

  /** Post detail */
  post: {
    prev: {
      zh: "上一篇",
      en: "Previous Post",
      ja: "前の記事",
      ru: "Предыдущая",
    } satisfies Dict,
    next: {
      zh: "下一篇",
      en: "Next Post",
      ja: "次の記事",
      ru: "Следующая",
    } satisfies Dict,
    goBack: {
      zh: "返回",
      en: "Go back",
      ja: "戻る",
      ru: "Назад",
    } satisfies Dict,
    updated: {
      zh: "更新：",
      en: "Updated:",
      ja: "更新：",
      ru: "Обновлено:",
    } satisfies Dict,
  },

  /** Home page */
  home: {
    greeting: {
      zh: "你好，欢迎来访 👋",
      en: "Hello, welcome! 👋",
      ja: "こんにちは、ようこそ！👋",
      ru: "Привет, добро пожаловать! 👋",
    } satisfies Dict,
    desc: {
      zh: "这是 Sylvan 的个人博客。这里记录关于技术、代码和生活的思考。",
      en: "Sylvan's personal blog. Thoughts on technology, code, and life.",
      ja: "Sylvan の個人ブログです。技術、コード、そして生活についての考えを綴っています。",
      ru: "Личный блог Sylvan. Мысли о технологиях, коде и жизни.",
    } satisfies Dict,
    featured: {
      zh: "精选文章",
      en: "Featured",
      ja: "注目記事",
      ru: "Избранное",
    } satisfies Dict,
    recent: {
      zh: "最近文章",
      en: "Recent Posts",
      ja: "最近の記事",
      ru: "Недавние записи",
    } satisfies Dict,
    allPosts: {
      zh: "全部文章",
      en: "All Posts",
      ja: "全ての記事",
      ru: "Все записи",
    } satisfies Dict,
    socialLinks: {
      zh: "社交链接：",
      en: "Social Links:",
      ja: "ソーシャルリンク:",
      ru: "Соцсети:",
    } satisfies Dict,
  },

  /** RSS */
  rss: {
    subscribe: {
      zh: "欢迎订阅 RSS 以获取最新文章。",
      en: "Subscribe to RSS for the latest posts.",
      ja: "RSSで最新記事を購読してください。",
      ru: "Подпишитесь на RSS, чтобы получать новые записи.",
    } satisfies Dict,
  },

  /** Search */
  search: {
    title: {
      zh: "搜索",
      en: "Search",
      ja: "検索",
      ru: "Поиск",
    } satisfies Dict,
    desc: {
      zh: "搜索任意文章 ...",
      en: "Search any article ...",
      ja: "記事を検索 ...",
      ru: "Поиск статей ...",
    } satisfies Dict,
  },

  /** Posts list */
  posts: {
    title: {
      zh: "文章",
      en: "Posts",
      ja: "記事",
      ru: "Записи",
    } satisfies Dict,
    desc: {
      zh: "所有已发布的文章。",
      en: "All the articles I've posted.",
      ja: "公開された全ての記事です。",
      ru: "Все опубликованные записи.",
    } satisfies Dict,
  },

  /** Tags */
  tags: {
    title: {
      zh: "标签",
      en: "Tags",
      ja: "タグ",
      ru: "Теги",
    } satisfies Dict,
    desc: {
      zh: "文章所使用的所有标签。",
      en: "All the tags used in posts.",
      ja: "記事で使用されている全てのタグです。",
      ru: "Все теги, используемые в записях.",
    } satisfies Dict,
    label: {
      zh: "标签",
      en: "Tag",
      ja: "タグ",
      ru: "Тег",
    } satisfies Dict,
    descFiltered: {
      zh: (tag: string) => `所有带有 "${tag}" 标签的文章。`,
      en: (tag: string) => `All the articles with the tag "${tag}".`,
      ja: (tag: string) => `「${tag}」タグの付いた全ての記事です。`,
      ru: (tag: string) => `Все записи с тегом "${tag}".`,
    } satisfies TemplateDict,
  },

  /** Archives */
  archives: {
    title: {
      zh: "归档",
      en: "Archives",
      ja: "アーカイブ",
      ru: "Архив",
    } satisfies Dict,
    desc: {
      zh: "所有归档的文章。",
      en: "All the articles I've archived.",
      ja: "アーカイブされた全ての記事です。",
      ru: "Все архивные записи.",
    } satisfies Dict,
  },

  /** About page */
  about: {
    notFound: {
      zh: "页面未找到。",
      en: "Page not found.",
      ja: "ページが見つかりません。",
      ru: "Страница не найдена.",
    } satisfies Dict,
  },

  /** Theme toggle */
  themeToggle: {
    zh: "切换亮色/暗色模式",
    en: "Toggle light & dark mode",
    ja: "ライト/ダークモード切替",
    ru: "Переключить светлую/тёмную тему",
  } satisfies Dict,

  /** Misc */
  openMenu: {
    zh: "打开菜单",
    en: "Open Menu",
    ja: "メニューを開く",
    ru: "Открыть меню",
  } satisfies Dict,
  closeMenu: {
    zh: "关闭菜单",
    en: "Close Menu",
    ja: "メニューを閉じる",
    ru: "Закрыть меню",
  } satisfies Dict,
  selectLanguage: {
    zh: "选择语言",
    en: "Select language",
    ja: "言語を選択",
    ru: "Выбрать язык",
  } satisfies Dict,
  backToTop: {
    zh: "回到顶部",
    en: "Back to top",
    ja: "トップへ戻る",
    ru: "Наверх",
  } satisfies Dict,
  toc: {
    zh: "目录",
    en: "Contents",
    ja: "目次",
    ru: "Содержание",
  } satisfies Dict,
  footnotes: {
    zh: "脚注",
    en: "Footnotes",
    ja: "脚注",
    ru: "Сноски",
  } satisfies Dict,
  goHome: {
    zh: "返回首页",
    en: "Go back home",
    ja: "ホームに戻る",
    ru: "На главную",
  } satisfies Dict,
  edit: {
    zh: "编辑页面",
    en: "Edit page",
    ja: "ページを編集",
    ru: "Редактировать",
  } satisfies Dict,
  codeBlock: {
    expand: {
      zh: "展开",
      en: "Expand",
      ja: "展開",
      ru: "Развернуть",
    } satisfies Dict,
    collapse: {
      zh: "折叠",
      en: "Collapse",
      ja: "折りたたむ",
      ru: "Свернуть",
    } satisfies Dict,
    copy: {
      zh: "复制",
      en: "Copy",
      ja: "コピー",
      ru: "Копировать",
    } satisfies Dict,
    copied: {
      zh: "已复制",
      en: "Copied",
      ja: "コピー済み",
      ru: "Скопировано",
    } satisfies Dict,
  },
  pagination: {
    prev: {
      zh: "上一页",
      en: "Prev",
      ja: "前へ",
      ru: "Назад",
    } satisfies Dict,
    next: {
      zh: "下一页",
      en: "Next",
      ja: "次へ",
      ru: "Вперёд",
    } satisfies Dict,
  },
  share: {
    zh: "分享到：",
    en: "Share this post on:",
    ja: "共有：",
    ru: "Поделиться:",
  } satisfies Dict,
  breadcrumb: {
    home: {
      zh: "首页",
      en: "Home",
      ja: "ホーム",
      ru: "Главная",
    } satisfies Dict,
  },
  social: {
    github: {
      zh: (site: string) => `${site} 的 GitHub`,
      en: (site: string) => `${site} on GitHub`,
      ja: (site: string) => `${site} の GitHub`,
      ru: (site: string) => `${site} на GitHub`,
    } satisfies TemplateDict,
    email: {
      zh: (site: string) => `发送邮件至 ${site}`,
      en: (site: string) => `Send an email to ${site}`,
      ja: (site: string) => `${site} にメールを送信`,
      ru: (site: string) => `Отправить email на ${site}`,
    } satisfies TemplateDict,
    shareWhatsApp: {
      zh: "通过 WhatsApp 分享",
      en: "Share this post via WhatsApp",
      ja: "WhatsApp で共有",
      ru: "Поделиться через WhatsApp",
    } satisfies Dict,
    shareFacebook: {
      zh: "分享到 Facebook",
      en: "Share this post on Facebook",
      ja: "Facebook で共有",
      ru: "Поделиться в Facebook",
    } satisfies Dict,
    shareX: {
      zh: "分享到 X",
      en: "Share this post on X",
      ja: "X で共有",
      ru: "Поделиться в X",
    } satisfies Dict,
    shareTelegram: {
      zh: "通过 Telegram 分享",
      en: "Share this post via Telegram",
      ja: "Telegram で共有",
      ru: "Поделиться через Telegram",
    } satisfies Dict,
    sharePinterest: {
      zh: "分享到 Pinterest",
      en: "Share this post on Pinterest",
      ja: "Pinterest で共有",
      ru: "Поделиться в Pinterest",
    } satisfies Dict,
    shareEmail: {
      zh: "通过邮件分享",
      en: "Share this post via email",
      ja: "メールで共有",
      ru: "Поделиться по email",
    } satisfies Dict,
  },
};
