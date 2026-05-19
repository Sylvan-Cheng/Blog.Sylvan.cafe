import type { Locale, Dict } from "./config";

type TemplateDict = Record<Locale, (arg: string) => string>;

export const UI = {
  /** 404 / 页面未找到 */
  notFound: {
    zh: "页面未找到。",
    en: "Page not found.",
    ja: "ページが見つかりません。",
    ru: "Страница не найдена.",
    eo: "Paĝo ne trovita.",
  } satisfies Dict,

  /** Header / Navigation */
  nav: {
    skipToContent: {
      zh: "跳转到内容",
      en: "Skip to content",
      ja: "コンテンツへスキップ",
      ru: "Перейти к содержимому",
      eo: "Salti al enhavo",
    } satisfies Dict,
    posts: {
      zh: "文章",
      en: "Posts",
      ja: "記事",
      ru: "Записи",
      eo: "Afiŝoj",
    } satisfies Dict,
    tags: {
      zh: "标签",
      en: "Tags",
      ja: "タグ",
      ru: "Теги",
      eo: "Etikedoj",
    } satisfies Dict,
    about: {
      zh: "关于",
      en: "About",
      ja: "概要",
      ru: "О сайте",
      eo: "Pri",
    } satisfies Dict,
    archives: {
      zh: "归档",
      en: "Archives",
      ja: "アーカイブ",
      ru: "Архив",
      eo: "Arkivoj",
    } satisfies Dict,
    search: {
      zh: "搜索",
      en: "Search",
      ja: "検索",
      ru: "Поиск",
      eo: "Serĉi",
    } satisfies Dict,
  },

  /** Post detail */
  post: {
    prev: {
      zh: "上一篇",
      en: "Previous Post",
      ja: "前の記事",
      ru: "Предыдущая",
      eo: "Antaŭa afiŝo",
    } satisfies Dict,
    next: {
      zh: "下一篇",
      en: "Next Post",
      ja: "次の記事",
      ru: "Следующая",
      eo: "Sekva afiŝo",
    } satisfies Dict,
    goBack: {
      zh: "返回",
      en: "Go back",
      ja: "戻る",
      ru: "Назад",
      eo: "Reiri",
    } satisfies Dict,
    updated: {
      zh: "更新：",
      en: "Updated:",
      ja: "更新：",
      ru: "Обновлено:",
      eo: "Ĝisdatigita:",
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
      eo: (count: string) => `${count} vortoj`,
    } satisfies TemplateDict,
  },

  /** Home page */
  home: {
    greeting: {
      zh: "你好，欢迎来访 👋",
      en: "Hello, welcome! 👋",
      ja: "こんにちは、ようこそ！👋",
      ru: "Привет, добро пожаловать! 👋",
      eo: "Saluton, bonvenon! 👋",
    } satisfies Dict,
    desc: {
      zh: "这是 Sylvan 的个人博客。这里记录关于技术、代码和生活的思考。",
      en: "Sylvan's personal blog. Thoughts on technology, code, and life.",
      ja: "Sylvan の個人ブログです。技術、コード、そして生活についての考えを綴っています。",
      ru: "Личный блог Sylvan. Мысли о технологиях, коде и жизни.",
      eo: "Persona blogo de Sylvan. Pensoj pri teknologio, kodo kaj vivo.",
    } satisfies Dict,
    featured: {
      zh: "精选文章",
      en: "Featured",
      ja: "注目記事",
      ru: "Избранное",
      eo: "Elstaraj",
    } satisfies Dict,
    recent: {
      zh: "最近文章",
      en: "Recent Posts",
      ja: "最近の記事",
      ru: "Недавние записи",
      eo: "Lastatempaj afiŝoj",
    } satisfies Dict,
    allPosts: {
      zh: "全部文章",
      en: "All Posts",
      ja: "全ての記事",
      ru: "Все записи",
      eo: "Ĉiuj afiŝoj",
    } satisfies Dict,
  },

  /** RSS */
  rss: {
    subscribe: {
      zh: "欢迎订阅 RSS 以获取最新文章。",
      en: "Subscribe to RSS for the latest posts.",
      ja: "RSSで最新記事を購読してください。",
      ru: "Подпишитесь на RSS, чтобы получать новые записи.",
      eo: "Abonu RSS por ricevi la plej novajn afiŝojn.",
    } satisfies Dict,
  },

  /** Search */
  search: {
    title: {
      zh: "搜索",
      en: "Search",
      ja: "検索",
      ru: "Поиск",
      eo: "Serĉi",
    } satisfies Dict,
    desc: {
      zh: "搜索任意文章 ...",
      en: "Search any article ...",
      ja: "記事を検索 ...",
      ru: "Поиск статей ...",
      eo: "Serĉi ajnan artikolon...",
    } satisfies Dict,
  },

  /** Posts list */
  posts: {
    title: {
      zh: "文章",
      en: "Posts",
      ja: "記事",
      ru: "Записи",
      eo: "Afiŝoj",
    } satisfies Dict,
    desc: {
      zh: "所有已发布的文章。",
      en: "All the articles I've posted.",
      ja: "公開された全ての記事です。",
      ru: "Все опубликованные записи.",
      eo: "Ĉiuj artikoloj, kiujn mi afiŝis.",
    } satisfies Dict,
  },

  /** Tags */
  tags: {
    title: {
      zh: "标签",
      en: "Tags",
      ja: "タグ",
      ru: "Теги",
      eo: "Etikedoj",
    } satisfies Dict,
    desc: {
      zh: "文章所使用的所有标签。",
      en: "All the tags used in posts.",
      ja: "記事で使用されている全てのタグです。",
      ru: "Все теги, используемые в записях.",
      eo: "Ĉiuj etikedoj uzataj en afiŝoj.",
    } satisfies Dict,
    label: {
      zh: "标签",
      en: "Tag",
      ja: "タグ",
      ru: "Тег",
      eo: "Etikedo",
    } satisfies Dict,
    descFiltered: {
      zh: (tag: string) => `所有带有 "${tag}" 标签的文章。`,
      en: (tag: string) => `All the articles with the tag "${tag}".`,
      ja: (tag: string) => `「${tag}」タグの付いた全ての記事です。`,
      ru: (tag: string) => `Все записи с тегом "${tag}".`,
      eo: (tag: string) => `Ĉiuj artikoloj kun la etikedo "${tag}".`,
    } satisfies TemplateDict,
  },

  /** Archives */
  archives: {
    title: {
      zh: "归档",
      en: "Archives",
      ja: "アーカイブ",
      ru: "Архив",
      eo: "Arkivoj",
    } satisfies Dict,
    desc: {
      zh: "所有归档的文章。",
      en: "All the articles I've archived.",
      ja: "アーカイブされた全ての記事です。",
      ru: "Все архивные записи.",
      eo: "Ĉiuj arkivitaj artikoloj.",
    } satisfies Dict,
  },

  /** About page */
  about: {
    desc: {
      zh: "这里是 Sylvan。",
      en: "This is Sylvan.",
      ja: "ここは Sylvan です。",
      ru: "Это Sylvan.",
      eo: "Jen Sylvan.",
    } satisfies Dict,
  },

  /** License page */
  license: {
    title: {
      zh: "License",
      en: "License",
      ja: "License",
      ru: "License",
      eo: "Permesilo",
    } satisfies Dict,
    desc: {
      zh: "了解本站内容的许可规则。",
      en: "Learn about the licensing terms for this site.",
      ja: "このサイトのライセンス規約について。",
      ru: "Узнайте о правилах лицензирования контента.",
      eo: "Eksciu pri la licencaj kondiĉoj de ĉi tiu retejo.",
    } satisfies Dict,
  },

  /** Theme toggle */
  themeToggle: {
    zh: "切换亮色/暗色模式",
    en: "Toggle light & dark mode",
    ja: "ライト/ダークモード切替",
    ru: "Переключить светлую/тёмную тему",
    eo: "Ŝalti helan/malhelan reĝimon",
  } satisfies Dict,

  /** Misc */
  openMenu: {
    zh: "打开菜单",
    en: "Open Menu",
    ja: "メニューを開く",
    ru: "Открыть меню",
    eo: "Malfermi menuon",
  } satisfies Dict,
  closeMenu: {
    zh: "关闭菜单",
    en: "Close Menu",
    ja: "メニューを閉じる",
    ru: "Закрыть меню",
    eo: "Fermi menuon",
  } satisfies Dict,
  selectLanguage: {
    zh: "选择语言",
    en: "Select language",
    ja: "言語を選択",
    ru: "Выбрать язык",
    eo: "Elekti lingvon",
  } satisfies Dict,
  backToTop: {
    zh: "回到顶部",
    en: "Back to top",
    ja: "トップへ戻る",
    ru: "Наверх",
    eo: "Reiri al supro",
  } satisfies Dict,
  toc: {
    zh: "目录",
    en: "Contents",
    ja: "目次",
    ru: "Содержание",
    eo: "Enhavo",
  } satisfies Dict,
  footnotes: {
    zh: "脚注",
    en: "Footnotes",
    ja: "脚注",
    ru: "Сноски",
    eo: "Piednotoj",
  } satisfies Dict,
  goHome: {
    zh: "返回首页",
    en: "Go back home",
    ja: "ホームに戻る",
    ru: "На главную",
    eo: "Reiri al la ĉefpaĝo",
  } satisfies Dict,
  edit: {
    zh: "编辑页面",
    en: "Edit page",
    ja: "ページを編集",
    ru: "Редактировать",
    eo: "Redakti paĝon",
  } satisfies Dict,
  codeBlock: {
    expand: {
      zh: "展开",
      en: "Expand",
      ja: "展開",
      ru: "Развернуть",
      eo: "Etendi",
    } satisfies Dict,
    collapse: {
      zh: "折叠",
      en: "Collapse",
      ja: "折りたたむ",
      ru: "Свернуть",
      eo: "Faldi",
    } satisfies Dict,
    copy: {
      zh: "复制",
      en: "Copy",
      ja: "コピー",
      ru: "Копировать",
      eo: "Kopii",
    } satisfies Dict,
    copied: {
      zh: "已复制",
      en: "Copied",
      ja: "コピー済み",
      ru: "Скопировано",
      eo: "Kopiite",
    } satisfies Dict,
  },
  pagination: {
    prev: {
      zh: "上一页",
      en: "Prev",
      ja: "前へ",
      ru: "Назад",
      eo: "Antaŭa",
    } satisfies Dict,
    next: {
      zh: "下一页",
      en: "Next",
      ja: "次へ",
      ru: "Вперёд",
      eo: "Sekva",
    } satisfies Dict,
  },
  share: {
    heading: {
      zh: "分享到：",
      en: "Share this post on:",
      ja: "共有：",
      ru: "Поделиться:",
      eo: "Kundividi ĉi tiun afiŝon ĉe:",
    } satisfies Dict,
    platforms: {
      copy: {
        zh: "复制链接",
        en: "Copy link",
        ja: "リンクをコピー",
        ru: "Копировать ссылку",
        eo: "Kopii ligilon",
      } satisfies Dict,
      wechat: {
        zh: "微信",
        en: "WeChat",
        ja: "WeChat",
        ru: "WeChat",
        eo: "WeChat",
      } satisfies Dict,
      telegram: {
        zh: "Telegram",
        en: "Telegram",
        ja: "Telegram",
        ru: "Telegram",
        eo: "Telegram",
      } satisfies Dict,
      qq: {
        zh: "QQ",
        en: "QQ",
        ja: "QQ",
        ru: "QQ",
        eo: "QQ",
      } satisfies Dict,
      x: {
        zh: "X (Twitter)",
        en: "X (Twitter)",
        ja: "X (Twitter)",
        ru: "X (Twitter)",
        eo: "X (Twitter)",
      } satisfies Dict,
      reddit: {
        zh: "Reddit",
        en: "Reddit",
        ja: "Reddit",
        ru: "Reddit",
        eo: "Reddit",
      } satisfies Dict,
      whatsapp: {
        zh: "WhatsApp",
        en: "WhatsApp",
        ja: "WhatsApp",
        ru: "WhatsApp",
        eo: "WhatsApp",
      } satisfies Dict,
      line: {
        zh: "Line",
        en: "Line",
        ja: "Line",
        ru: "Line",
        eo: "Line",
      } satisfies Dict,
      facebook: {
        zh: "Facebook",
        en: "Facebook",
        ja: "Facebook",
        ru: "Facebook",
        eo: "Facebook",
      } satisfies Dict,
      mail: {
        zh: "邮件",
        en: "Email",
        ja: "メール",
        ru: "Email",
        eo: "Retpoŝto",
      } satisfies Dict,
    },
    more: {
      zh: "更多分享方式",
      en: "More share options",
      ja: "その他の共有方法",
      ru: "Другие способы",
      eo: "Pli da kundividaj elektoj",
    } satisfies Dict,
    less: {
      zh: "收起",
      en: "Show less",
      ja: "閉じる",
      ru: "Свернуть",
      eo: "Montri malpli",
    } satisfies Dict,
    copySuccess: {
      zh: "已复制",
      en: "Copied",
      ja: "コピー済み",
      ru: "Скопировано",
      eo: "Kopiite",
    } satisfies Dict,
    copyError: {
      zh: "复制失败",
      en: "Copy failed",
      ja: "コピー失敗",
      ru: "Ошибка копирования",
      eo: "Kopio malsukcesis",
    } satisfies Dict,
    copyUnsupported: {
      zh: "不支持复制",
      en: "Copy not supported",
      ja: "コピー非対応",
      ru: "Копирование не поддерживается",
      eo: "Kopiado ne subtenata",
    } satisfies Dict,
  },
  breadcrumb: {
    home: {
      zh: "首页",
      en: "Home",
      ja: "ホーム",
      ru: "Главная",
      eo: "Hejmo",
    } satisfies Dict,
  },
  social: {
    github: {
      zh: (site: string) => `${site} 的 GitHub`,
      en: (site: string) => `${site} on GitHub`,
      ja: (site: string) => `${site} の GitHub`,
      ru: (site: string) => `${site} на GitHub`,
      eo: (site: string) => `${site} ĉe GitHub`,
    } satisfies TemplateDict,
    email: {
      zh: (site: string) => `发送邮件至 ${site}`,
      en: (site: string) => `Send an email to ${site}`,
      ja: (site: string) => `${site} にメールを送信`,
      ru: (site: string) => `Отправить email на ${site}`,
      eo: (site: string) => `Sendi retmesaĝon al ${site}`,
    } satisfies TemplateDict,
  },
};
