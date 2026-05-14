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
      de: "Zum Inhalt springen",
    } satisfies Dict,
    posts: {
      zh: "文章",
      en: "Posts",
      ja: "記事",
      ru: "Записи",
      de: "Beiträge",
    } satisfies Dict,
    tags: {
      zh: "标签",
      en: "Tags",
      ja: "タグ",
      ru: "Теги",
      de: "Schlagwörter",
    } satisfies Dict,
    about: {
      zh: "关于",
      en: "About",
      ja: "概要",
      ru: "О сайте",
      de: "Über",
    } satisfies Dict,
    archives: {
      zh: "归档",
      en: "Archives",
      ja: "アーカイブ",
      ru: "Архив",
      de: "Archiv",
    } satisfies Dict,
    search: {
      zh: "搜索",
      en: "Search",
      ja: "検索",
      ru: "Поиск",
      de: "Suche",
    } satisfies Dict,
  },

  /** Post detail */
  post: {
    prev: {
      zh: "上一篇",
      en: "Previous Post",
      ja: "前の記事",
      ru: "Предыдущая",
      de: "Vorheriger Beitrag",
    } satisfies Dict,
    next: {
      zh: "下一篇",
      en: "Next Post",
      ja: "次の記事",
      ru: "Следующая",
      de: "Nächster Beitrag",
    } satisfies Dict,
    goBack: {
      zh: "返回",
      en: "Go back",
      ja: "戻る",
      ru: "Назад",
      de: "Zurück",
    } satisfies Dict,
    updated: {
      zh: "更新：",
      en: "Updated:",
      ja: "更新：",
      ru: "Обновлено:",
      de: "Aktualisiert:",
    } satisfies Dict,
    wordsCount: {
      zh: (count: string) => `${count} 字`,
      en: (count: string) => `${count} words`,
      ja: (count: string) => `${count} 文字`,
      ru: (count: string) => {
        const n = parseInt(count, 10);
        const lastDigit = n % 10;
        const lastTwo = n % 100;
        if (lastTwo >= 11 && lastTwo <= 14) return `${count} слов`;
        if (lastDigit === 1) return `${count} слово`;
        if (lastDigit >= 2 && lastDigit <= 4) return `${count} слова`;
        return `${count} слов`;
      },
      de: (count: string) => `${count} Wörter`,
    } satisfies TemplateDict,
  },

  /** Home page */
  home: {
    greeting: {
      zh: "你好，欢迎来访 👋",
      en: "Hello, welcome! 👋",
      ja: "こんにちは、ようこそ！👋",
      ru: "Привет, добро пожаловать! 👋",
      de: "Hallo, willkommen! 👋",
    } satisfies Dict,
    desc: {
      zh: "这是 Sylvan 的个人博客。这里记录关于技术、代码和生活的思考。",
      en: "Sylvan's personal blog. Thoughts on technology, code, and life.",
      ja: "Sylvan の個人ブログです。技術、コード、そして生活についての考えを綴っています。",
      ru: "Личный блог Sylvan. Мысли о технологиях, коде и жизни.",
      de: "Sylvans persönlicher Blog. Gedanken zu Technologie, Code und Leben.",
    } satisfies Dict,
    featured: {
      zh: "精选文章",
      en: "Featured",
      ja: "注目記事",
      ru: "Избранное",
      de: "Empfohlen",
    } satisfies Dict,
    recent: {
      zh: "最近文章",
      en: "Recent Posts",
      ja: "最近の記事",
      ru: "Недавние записи",
      de: "Neueste Beiträge",
    } satisfies Dict,
    allPosts: {
      zh: "全部文章",
      en: "All Posts",
      ja: "全ての記事",
      ru: "Все записи",
      de: "Alle Beiträge",
    } satisfies Dict,
  },

  /** RSS */
  rss: {
    subscribe: {
      zh: "欢迎订阅 RSS 以获取最新文章。",
      en: "Subscribe to RSS for the latest posts.",
      ja: "RSSで最新記事を購読してください。",
      ru: "Подпишитесь на RSS, чтобы получать новые записи.",
      de: "RSS abonnieren für die neuesten Beiträge.",
    } satisfies Dict,
  },

  /** Search */
  search: {
    title: {
      zh: "搜索",
      en: "Search",
      ja: "検索",
      ru: "Поиск",
      de: "Suche",
    } satisfies Dict,
    desc: {
      zh: "搜索任意文章 ...",
      en: "Search any article ...",
      ja: "記事を検索 ...",
      ru: "Поиск статей ...",
      de: "Artikel durchsuchen ...",
    } satisfies Dict,
  },

  /** Posts list */
  posts: {
    title: {
      zh: "文章",
      en: "Posts",
      ja: "記事",
      ru: "Записи",
      de: "Beiträge",
    } satisfies Dict,
    desc: {
      zh: "所有已发布的文章。",
      en: "All the articles I've posted.",
      ja: "公開された全ての記事です。",
      ru: "Все опубликованные записи.",
      de: "Alle veröffentlichten Beiträge.",
    } satisfies Dict,
  },

  /** Tags */
  tags: {
    title: {
      zh: "标签",
      en: "Tags",
      ja: "タグ",
      ru: "Теги",
      de: "Schlagwörter",
    } satisfies Dict,
    desc: {
      zh: "文章所使用的所有标签。",
      en: "All the tags used in posts.",
      ja: "記事で使用されている全てのタグです。",
      ru: "Все теги, используемые в записях.",
      de: "Alle in Beiträgen verwendeten Schlagwörter.",
    } satisfies Dict,
    label: {
      zh: "标签",
      en: "Tag",
      ja: "タグ",
      ru: "Тег",
      de: "Schlagwort",
    } satisfies Dict,
    descFiltered: {
      zh: (tag: string) => `所有带有 "${tag}" 标签的文章。`,
      en: (tag: string) => `All the articles with the tag "${tag}".`,
      ja: (tag: string) => `「${tag}」タグの付いた全ての記事です。`,
      ru: (tag: string) => `Все записи с тегом "${tag}".`,
      de: (tag: string) => `Alle Beiträge mit dem Schlagwort „${tag}".`,
    } satisfies TemplateDict,
  },

  /** Archives */
  archives: {
    title: {
      zh: "归档",
      en: "Archives",
      ja: "アーカイブ",
      ru: "Архив",
      de: "Archiv",
    } satisfies Dict,
    desc: {
      zh: "所有归档的文章。",
      en: "All the articles I've archived.",
      ja: "アーカイブされた全ての記事です。",
      ru: "Все архивные записи.",
      de: "Alle archivierten Beiträge.",
    } satisfies Dict,
  },

  /** About page */
  about: {
    notFound: {
      zh: "页面未找到。",
      en: "Page not found.",
      ja: "ページが見つかりません。",
      ru: "Страница не найдена.",
      de: "Seite nicht gefunden.",
    } satisfies Dict,
  },

  /** Theme toggle */
  themeToggle: {
    zh: "切换亮色/暗色模式",
    en: "Toggle light & dark mode",
    ja: "ライト/ダークモード切替",
    ru: "Переключить светлую/тёмную тему",
    de: "Hell-/Dunkelmodus umschalten",
  } satisfies Dict,

  /** Misc */
  openMenu: {
    zh: "打开菜单",
    en: "Open Menu",
    ja: "メニューを開く",
    ru: "Открыть меню",
    de: "Menü öffnen",
  } satisfies Dict,
  closeMenu: {
    zh: "关闭菜单",
    en: "Close Menu",
    ja: "メニューを閉じる",
    ru: "Закрыть меню",
    de: "Menü schließen",
  } satisfies Dict,
  selectLanguage: {
    zh: "选择语言",
    en: "Select language",
    ja: "言語を選択",
    ru: "Выбрать язык",
    de: "Sprache wählen",
  } satisfies Dict,
  backToTop: {
    zh: "回到顶部",
    en: "Back to top",
    ja: "トップへ戻る",
    ru: "Наверх",
    de: "Nach oben",
  } satisfies Dict,
  toc: {
    zh: "目录",
    en: "Contents",
    ja: "目次",
    ru: "Содержание",
    de: "Inhalt",
  } satisfies Dict,
  footnotes: {
    zh: "脚注",
    en: "Footnotes",
    ja: "脚注",
    ru: "Сноски",
    de: "Fußnoten",
  } satisfies Dict,
  goHome: {
    zh: "返回首页",
    en: "Go back home",
    ja: "ホームに戻る",
    ru: "На главную",
    de: "Zur Startseite",
  } satisfies Dict,
  edit: {
    zh: "编辑页面",
    en: "Edit page",
    ja: "ページを編集",
    ru: "Редактировать",
    de: "Seite bearbeiten",
  } satisfies Dict,
  codeBlock: {
    expand: {
      zh: "展开",
      en: "Expand",
      ja: "展開",
      ru: "Развернуть",
      de: "Ausklappen",
    } satisfies Dict,
    collapse: {
      zh: "折叠",
      en: "Collapse",
      ja: "折りたたむ",
      ru: "Свернуть",
      de: "Einklappen",
    } satisfies Dict,
    copy: {
      zh: "复制",
      en: "Copy",
      ja: "コピー",
      ru: "Копировать",
      de: "Kopieren",
    } satisfies Dict,
    copied: {
      zh: "已复制",
      en: "Copied",
      ja: "コピー済み",
      ru: "Скопировано",
      de: "Kopiert",
    } satisfies Dict,
  },
  pagination: {
    prev: {
      zh: "上一页",
      en: "Prev",
      ja: "前へ",
      ru: "Назад",
      de: "Zurück",
    } satisfies Dict,
    next: {
      zh: "下一页",
      en: "Next",
      ja: "次へ",
      ru: "Вперёд",
      de: "Weiter",
    } satisfies Dict,
  },
  share: {
    heading: {
      zh: "分享到：",
      en: "Share this post on:",
      ja: "共有：",
      ru: "Поделиться:",
      de: "Diesen Beitrag teilen auf:",
    } satisfies Dict,
    platforms: {
      copy: {
        zh: "复制链接",
        en: "Copy link",
        ja: "リンクをコピー",
        ru: "Копировать ссылку",
        de: "Link kopieren",
      } satisfies Dict,
      wechat: {
        zh: "微信",
        en: "WeChat",
        ja: "WeChat",
        ru: "WeChat",
        de: "WeChat",
      } satisfies Dict,
      telegram: {
        zh: "Telegram",
        en: "Telegram",
        ja: "Telegram",
        ru: "Telegram",
        de: "Telegram",
      } satisfies Dict,
      qq: {
        zh: "QQ",
        en: "QQ",
        ja: "QQ",
        ru: "QQ",
        de: "QQ",
      } satisfies Dict,
      x: {
        zh: "X (Twitter)",
        en: "X (Twitter)",
        ja: "X (Twitter)",
        ru: "X (Twitter)",
        de: "X (Twitter)",
      } satisfies Dict,
      reddit: {
        zh: "Reddit",
        en: "Reddit",
        ja: "Reddit",
        ru: "Reddit",
        de: "Reddit",
      } satisfies Dict,
      whatsapp: {
        zh: "WhatsApp",
        en: "WhatsApp",
        ja: "WhatsApp",
        ru: "WhatsApp",
        de: "WhatsApp",
      } satisfies Dict,
      line: {
        zh: "Line",
        en: "Line",
        ja: "Line",
        ru: "Line",
        de: "Line",
      } satisfies Dict,
      facebook: {
        zh: "Facebook",
        en: "Facebook",
        ja: "Facebook",
        ru: "Facebook",
        de: "Facebook",
      } satisfies Dict,
      mail: {
        zh: "邮件",
        en: "Email",
        ja: "メール",
        ru: "Email",
        de: "E-Mail",
      } satisfies Dict,
    },
    more: {
      zh: "更多分享方式",
      en: "More share options",
      ja: "その他の共有方法",
      ru: "Другие способы",
      de: "Weitere Optionen",
    } satisfies Dict,
    less: {
      zh: "收起",
      en: "Show less",
      ja: "閉じる",
      ru: "Свернуть",
      de: "Weniger anzeigen",
    } satisfies Dict,
    copySuccess: {
      zh: "已复制",
      en: "Copied",
      ja: "コピー済み",
      ru: "Скопировано",
      de: "Kopiert",
    } satisfies Dict,
    copyError: {
      zh: "复制失败",
      en: "Copy failed",
      ja: "コピー失敗",
      ru: "Ошибка копирования",
      de: "Kopieren fehlgeschlagen",
    } satisfies Dict,
    copyUnsupported: {
      zh: "不支持复制",
      en: "Copy not supported",
      ja: "コピー非対応",
      ru: "Копирование не поддерживается",
      de: "Kopieren nicht unterstützt",
    } satisfies Dict,
  },
  breadcrumb: {
    home: {
      zh: "首页",
      en: "Home",
      ja: "ホーム",
      ru: "Главная",
      de: "Start",
    } satisfies Dict,
  },
  social: {
    github: {
      zh: (site: string) => `${site} 的 GitHub`,
      en: (site: string) => `${site} on GitHub`,
      ja: (site: string) => `${site} の GitHub`,
      ru: (site: string) => `${site} на GitHub`,
      de: (site: string) => `${site} auf GitHub`,
    } satisfies TemplateDict,
    email: {
      zh: (site: string) => `发送邮件至 ${site}`,
      en: (site: string) => `Send an email to ${site}`,
      ja: (site: string) => `${site} にメールを送信`,
      ru: (site: string) => `Отправить email на ${site}`,
      de: (site: string) => `E-Mail an ${site} senden`,
    } satisfies TemplateDict,
  },
};
