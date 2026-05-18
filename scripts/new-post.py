# /// script
# requires-python = ">=3.12"
# dependencies = ["rich>=13", "python-slugify>=8"]
# ///
"""
对话式 Markdown 元数据生成器
为 Sylvan's Blog (Astro + Gruvbox) 创建新文章骨架
用法: uv run scripts/new-post.py
"""

from datetime import datetime, timezone
from pathlib import Path

from rich.console import Console
from rich.panel import Panel
from rich.prompt import Confirm, Prompt
from rich.table import Table
from rich.text import Text
from slugify import slugify as slugify_text

console = Console()
err_console = Console(stderr=True)

BLOG_BASE = Path(__file__).resolve().parent.parent / "src" / "data" / "blog"

LOCALES = {
    "zh": "中文",
    "en": "English",
    "ja": "日本語",
    "ru": "Русский",
}

TAG_PRESETS = [
    "tech",
    "life",
    "astro",
    "python",
    "linux",
    "devops",
    "frontend",
    "backend",
    "others",
]

LICENSE_OPTIONS = [
    ("cc-by-nc-sa-4.0", "CC BY-NC-SA 4.0（署名-非商业-相同方式共享）"),
    ("copyright", "保留所有权利"),
]


# ── 通用交互组件 ──────────────────────────────────────────────


def ask_text(prompt: str, default: str = "", validator=None) -> str:
    """单行文本输入，可选校验"""
    while True:
        suffix = f" [dim]{default}[/dim]" if default else ""
        value = Prompt.ask(f"{prompt}{suffix}", default=default or None)
        if validator:
            ok, msg = validator(value)
            if not ok:
                err_console.print(f"[red]✗ {msg}[/red]")
                continue
        return value


def ask_choice(prompt: str, options: list[str], default_idx: int = 0) -> int:
    """编号列表选择，返回索引"""
    console.print(f"\n[bold]{prompt}[/bold]")
    for i, opt in enumerate(options, 1):
        marker = "▸" if i - 1 == default_idx else " "
        console.print(f"  {marker} [cyan]{i}[/cyan]. {opt}")

    while True:
        raw = Prompt.ask(
            "输入编号",
            default=str(default_idx + 1),
        )
        try:
            idx = int(raw) - 1
            if 0 <= idx < len(options):
                return idx
        except ValueError:
            pass
        err_console.print(f"[red]请输入 1-{len(options)} 之间的数字[/red]")


def ask_multi(prompt: str, options: list[str]) -> list[str]:
    """多选，输入逗号分隔的编号"""
    console.print(f"\n[bold]{prompt}[/bold]")
    for i, opt in enumerate(options, 1):
        console.print(f"  [cyan]{i}[/cyan]. {opt}")

    while True:
        raw = Prompt.ask("输入编号（逗号分隔，如 1,3,5）")
        if not raw.strip():
            return []
        try:
            indices = [int(x.strip()) - 1 for x in raw.split(",")]
            selected = [options[i] for i in indices if 0 <= i < len(options)]
            if selected:
                return selected
        except (ValueError, IndexError):
            pass
        err_console.print("[red]输入格式错误，请用逗号分隔编号[/red]")


# ── 字段校验器 ────────────────────────────────────────────────


def validate_description(text: str) -> tuple[bool, str]:
    length = len(text)
    if length < 10:
        return False, f"描述至少 10 字符（当前 {length}）"
    if length > 320:
        return False, f"描述最多 320 字符（当前 {length}）"
    return True, ""


def validate_slug(text: str) -> tuple[bool, str]:
    if not text.strip():
        return False, "slug 不能为空"
    if " " in text:
        return False, "slug 不能包含空格，用连字符 - 代替"
    return True, ""


# ── 主流程 ────────────────────────────────────────────────────


def prompt_frontmatter() -> dict:
    console.print()

    title = ask_text("标题", validator=lambda t: (bool(t.strip()), "标题不能为空"))

    locale_idx = ask_choice(
        "语言",
        [f"{v} ({k})" for k, v in LOCALES.items()],
    )
    locale_code = list(LOCALES.keys())[locale_idx]

    description = ask_text("描述（10-320 字符，SEO 用）", validator=validate_description)

    tag_indices = ask_multi(
        "预设标签",
        TAG_PRESETS,
    )
    tags = tag_indices if tag_indices else ["others"]

    custom = ask_text("自定义标签（逗号分隔，留空跳过）", default="")
    if custom:
        tags.extend(t.strip() for t in custom.split(",") if t.strip())

    use_math = Confirm.ask("启用 KaTeX 数学公式？", default=False)
    featured = Confirm.ask("置顶文章？", default=False)
    draft = Confirm.ask("保存为草稿？", default=False)

    lic_idx = ask_choice("版权协议", [desc for _, desc in LICENSE_OPTIONS])
    license_val = LICENSE_OPTIONS[lic_idx][0]

    author = ask_text("作者", default="Sylvan")

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    pub_date = ask_text("发布日期（ISO 8601）", default=now_iso)

    return {
        "locale": locale_code,
        "title": title,
        "pubDatetime": pub_date,
        "description": description,
        "author": author,
        "tags": tags,
        "featured": featured,
        "draft": draft,
        "math": use_math,
        "license": license_val,
    }


def build_frontmatter(data: dict) -> str:
    lines = [
        "---",
        f"locale: {data['locale']}",
        f'title: "{data["title"]}"',
        f"pubDatetime: {data['pubDatetime']}",
        f'description: "{data["description"]}"',
    ]

    if data["author"] != "Sylvan":
        lines.append(f'author: "{data["author"]}"')

    if data["featured"]:
        lines.append("featured: true")
    if data["draft"]:
        lines.append("draft: true")
    if data["math"]:
        lines.append("math: true")

    lines.append(f"license: {data['license']}")

    lines.append("tags:")
    for tag in data["tags"]:
        lines.append(f"  - {tag}")

    lines.append("---")
    return "\n".join(lines)


def make_slug(title: str) -> str:
    default = slugify_text(title, max_length=50, word_boundary=True, allow_unicode=True)
    return ask_text("文章 slug（文件夹名）", default=default, validator=validate_slug)


BODY_TEMPLATES = {
    "zh": "## 开始写作\n\n在这里写正文...\n",
    "en": "## Start Writing\n\nWrite your content here...\n",
    "ja": "## 書き始める\n\nここに本文を書く...\n",
    "ru": "## Начать писать\n\nПишите здесь...\n",
}


def create_post(slug: str, locale: str, frontmatter: str) -> Path | None:
    post_dir = BLOG_BASE / slug
    post_dir.mkdir(parents=True, exist_ok=True)
    file_path = post_dir / f"{locale}.md"

    if file_path.exists():
        if not Confirm.ask(f"[yellow]{file_path}[/yellow] 已存在，覆盖？", default=False):
            console.print("[dim]已跳过[/dim]")
            return None

    body = BODY_TEMPLATES.get(locale, BODY_TEMPLATES["zh"])
    content = f"{frontmatter}\n\n{body}"
    file_path.write_text(content, encoding="utf-8")

    rel = file_path.relative_to(Path(__file__).resolve().parent.parent)
    console.print(f"[green]✓ 已创建：[/green]{rel}")
    return file_path


def main():
    console.print(
        Panel(
            Text("Sylvan's Blog — 新文章生成器", justify="center"),
            style="bold cyan",
            width=44,
        )
    )

    try:
        data = prompt_frontmatter()
    except KeyboardInterrupt:
        console.print("\n[dim]已取消[/dim]")
        return

    slug = make_slug(data["title"])
    fm = build_frontmatter(data)

    console.print()
    console.print(Panel(fm, title="Frontmatter 预览", border_style="green", width=50))
    console.print()

    create_post(slug, data["locale"], fm)

    if Confirm.ask("为其他语言创建副本？", default=False):
        available = [k for k in LOCALES if k != data["locale"]]
        choices = [f"{LOCALES[k]} ({k})" for k in available]
        choice_to_locale = dict(zip(choices, available))
        selected = ask_multi("选择语言", choices)

        for display in selected:
            loc = choice_to_locale[display]
            copy = {**data, "locale": loc}
            create_post(slug, loc, build_frontmatter(copy))

    console.print("\n[bold green]完成！祝写作愉快 ✨[/bold green]")


if __name__ == "__main__":
    main()
