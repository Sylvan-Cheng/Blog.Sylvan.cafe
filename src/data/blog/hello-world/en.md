---
locale: en
author: Test Author
pubDatetime: 2026-05-01T00:00:00Z
title: Hello, World!
featured: true
draft: false
math: true
license: cc-by-nc-sa-4.0
tags:
  - test
description: A comprehensive Markdown syntax test in English, covering all rendering features and verifying multilingual blog functionality.
---

## Welcome to My Blog

This is the first English article. Multilingual features are now configured:

- **中文** (zh) — Default language
- **English** (en)
- **日本語** (ja)
- **Русский** (ru)

This blog is built with Astro 6, supporting dark/light theme switching (Gruvbox palette) and integrated with the Giscus comment system. Code blocks support syntax highlighting, diff annotations, and filename display. Mathematical formulas are rendered via KaTeX, supporting both inline and block-level expressions.

This article aims to test all Markdown syntax rendering while verifying the floating table of contents (TOC) component across various scenarios.

---

## This is an Extremely Long English Heading Specially Designed to Test TOC Text Truncation and Tooltip Features

The TOC has a fixed width of 192px, fitting roughly 22–24 Latin characters at 14px font size. This heading far exceeds that length, so it should be truncated with `...` in the TOC, showing the full title on hover. Below is sample body text.

### A Similarly Lengthy Third-Level Subheading to Verify Indentation Differences During Truncation

Third-level headings have extra left indentation in the TOC, making the available width even narrower, so truncation should occur sooner. This heading is intentionally verbose to trigger overflow detection.

---

## Short Headings Are Fine

Below are short headings, which should display fully in the TOC without tooltips.

### Short Subheading

Also displayed in full.

---

## Multi-Level Heading Hierarchy Test

The TOC only captures h2 and h3, but this article includes deeper levels to verify in-article heading rendering.

### Third-Level Heading A

Visible in the TOC, with left indentation.

#### Fourth-Level Headings Do Not Appear in the TOC

They won't show up in the TOC but are rendered normally on the page.

##### Fifth-Level Headings Also Do Not Appear

Deep-level headings are only for structural testing.

### Third-Level Heading B

Back to a TOC-visible level.

---

## Markdown Syntax Overview

This section systematically tests the various syntax elements supported by Markdown, from basic text styles to complex code blocks and math formulas.

### Text Styles

This is **bold** text, this is *italic* text, this is ***bold italic*** text, this is ~~strikethrough~~ text, and this is `inline code`.

### Links & Images

[Astro Website](https://astro.build/) is the static site generator used by this blog.

<img src="https://s3.sylvan.cafe/img/blog/2026/05/ENDFIELD-1778172445940.avif" alt="Arknights: Endfield" width="800" height="450" loading="lazy" />

### Blockquotes

> This is a blockquote, used to showcase the rendering of quoted text.
>
> > This is a nested blockquote. Technically feasible, but should be used sparingly in practice.

---

## Lists & Layout

Lists are a core tool for organizing information.

### Unordered Lists

- Item one: opening content
- Item two: another point
  - Nested item A: for elaboration
    - Deeper nesting is also supported
  - Nested item B: another sub-item
- Item three: back to top level

### Ordered Lists

1. Step one: initialize the project structure
2. Step two: configure dependencies and build settings
3. Step three: write core functionality code
    1. Sub-step 3.1 — implement the data layer
    2. Sub-step 3.2 — implement business logic
4. Step four: write tests to ensure code quality
5. Step five: deploy to production

### Task Lists

- [x] Completed: configure Astro 6 project
- [x] Completed: integrate Tailwind CSS v4
- [ ] Todo: add floating TOC component
- [ ] Todo: optimize page performance
- [ ] Todo: write user documentation
- [ ] Todo: configure CI/CD pipeline

---

## Tables & Data Display

### Basic Table

| Language | Code | Font | Description |
|----------|------|------|-------------|
| Chinese  | zh   | Noto Sans SC | Optimized for Simplified Chinese |
| English  | en   | Noto Sans    | Default font for Latin characters |
| Japanese | ja   | Noto Sans JP | Japanese kana and kanji |
| Russian  | ru   | Noto Sans    | Cyrillic script support |

### Code Comparison Table

| Feature       | JavaScript     | TypeScript       | Python                    |
|---------------|----------------|------------------|---------------------------|
| Type system   | Dynamic        | Static           | Dynamic (optional hints)  |
| Runtime       | Browser/Node   | Compiles to JS   | Interpreter               |
| Package mgmt  | npm/yarn/pnpm  | npm/yarn/pnpm    | pip/poetry                |
| Learning curve| Low            | Medium           | Low                       |

---

## Code Blocks

Code blocks use Shiki syntax highlighting, supporting: default line numbers, word wrap (hanging indent), code folding (`collapse`), filename labels (`file`), and disabling line numbers (`nolines`).

### Default Line Numbers

All code blocks have line numbers enabled by default, no annotation needed.

```python
def fib(n: int) -> list[int]:
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result
```

### File Label: file

`file="name"` displays a filename label in the top-left corner, with a green dot.

```python file="fibonacci.py"
def fib(n: int) -> list[int]:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

### Disable Line Numbers: nolines

Short code snippets with `nolines` hide line numbers for brevity.

```bash nolines
pnpm install
pnpm dev
pnpm build
```

### Code Folding: collapse

Code blocks exceeding 8 lines with `collapse` are automatically folded, with a bottom fade to hint at more content. The expand button is centered at the bottom.

```python collapse file="utils.py"
def fibonacci(n: int) -> list[int]:
    """Generate the first n Fibonacci numbers"""
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result


def is_prime(num: int) -> bool:
    """Check if an integer is prime"""
    if num < 2:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True


def chunk_list(data: list, size: int):
    """Split a list into fixed-size chunks, returning a generator"""
    for i in range(0, len(data), size):
        yield data[i:i + size]


print(fibonacci(10))
primes = [x for x in fibonacci(20) if is_prime(x)]
print(f"Primes: {primes}")
```

### Folding + No Line Numbers: collapse nolines

Multiple annotations can be freely combined.

```python collapse nolines
import json
from pathlib import Path


def load_config(path: str | Path) -> dict:
    """Load a JSON config file, returning an empty dict if not found."""
    config_path = Path(path)
    if not config_path.exists():
        return {}
    return json.loads(config_path.read_text(encoding="utf-8"))


def merge_configs(base: dict, override: dict) -> dict:
    """Deep-merge two config dicts, with override taking priority."""
    result = base.copy()
    for key, value in override.items():
        if isinstance(value, dict) and key in result:
            result[key] = merge_configs(result[key], value)
        else:
            result[key] = value
    return result


cfg = load_config("defaults.json")
user_cfg = load_config("user.json")
final = merge_configs(cfg, user_cfg)
print(json.dumps(final, indent=2, ensure_ascii=False))
```

### Word Wrap + Hanging Indent

Overly long lines wrap at the container boundary, with the continuation indented to align with the first line of code.

```python collapse file="dashboard.py"
def build_dashboard_report(assignments: dict[str, list[dict]], include_history: bool = False) -> str:
    """Generate an aggregated dashboard report from task assignments across worker nodes."""
    lines = ["# Load Report", f"Generated at: {datetime.now().isoformat()}", ""]
    for node_name, tasks in assignments.items():
        pending = [t for t in tasks if t.get("status") == "pending" and t.get("priority", 0) >= 3]
        lines.append(f"## {node_name} ({len(pending)} high-priority tasks)")
        lines.extend(f"  - [{t['priority']}] {t.get('title', 'Unnamed')}" for t in sorted(pending, key=lambda x: -x["priority"]))
    if include_history:
        lines.append("\n---\n## Historical Trends\n*Requires persistent storage to be enabled*")
    return "\n".join(lines)


sample = [
    {"title": "Data Migration", "status": "pending", "priority": 5, "node": "worker-0"},
    {"title": "Log Rotation", "status": "done", "priority": 1, "node": "worker-0"},
    {"title": "Index Rebuild", "status": "pending", "priority": 4, "node": "worker-1"},
]
print(build_dashboard_report({"worker-0": sample[:2], "worker-1": sample[2:]}, include_history=True))
```

### CSS

```css nolines
.astro-code {
  @apply rounded-lg border border-border;
  font-family: var(--font-code);
}

.astro-code .line {
  min-height: 1.5rem;
}
```

---

## Mathematical Formulas

### Inline Formulas

The mass–energy equivalence $E = mc^2$ is perhaps the most famous physics formula. The Pythagorean theorem $a^2 + b^2 = c^2$ is equally familiar.

### Block Formulas

The Gaussian integral:

$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

The normal distribution PDF:

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

Euler's identity:

$$
e^{i\pi} + 1 = 0
$$

### Multi-line Formulas

Using the `aligned` environment:

$$
\begin{aligned}
\nabla \times \vec{\mathbf{B}} - \frac{1}{c} \frac{\partial\vec{\mathbf{E}}}{\partial t} &= \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} &= 4\pi\rho \\
\nabla \times \vec{\mathbf{E}} + \frac{1}{c} \frac{\partial\vec{\mathbf{B}}}{\partial t} &= \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} &= 0
\end{aligned}
$$

---

## Extended Features

### Footnotes

This is a sentence with a footnote.[^1] This is another sentence with a footnote.[^long-note]

[^1]: This is the footnote content. Footnotes are displayed at the bottom of the article.

[^long-note]: This is a long footnote to test multi-line footnote rendering. In a multilingual blog, footnote anchor links must correctly handle route prefixes.

### HTML Details Panel

<details>
<summary>Click to expand</summary>

This is collapsed content, supporting Markdown syntax.

- List item
- Another item
- Yet another item

The details panel can contain full Markdown, including code blocks and tables.

</details>

### Horizontal Rules

---

A horizontal rule uses three or more hyphens, asterisks, or underscores.

---

## Summary & Outlook

This article systematically tested all Markdown syntax supported by the blog. Through the multi-level heading structure, the following floating TOC features were verified:

- Heading level detection (h2 and h3)
- Scroll-highlight tracking (IntersectionObserver)
- Smooth scroll on click (with offset compensation)
- Multilingual content compatibility

Future improvements include full-text search, tag cloud, and RSS feed optimization.
