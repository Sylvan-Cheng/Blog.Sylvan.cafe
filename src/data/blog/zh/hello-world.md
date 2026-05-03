---
locale: zh
translationKey: hello-world
author: 测试作者
pubDatetime: 2026-05-01T00:00:00Z
title: 你好，世界！
slug: hello-world-zh
featured: true
draft: false
tags:
  - 测试
description: 一篇包含完整 Markdown 语法测试的中文文章，用于验证博客渲染和多语言功能。
---

## 欢迎来到我的博客

这是第一篇中文文章。多语言功能已配置完成：

- **中文** (zh) — 默认语言
- **English** (en)
- **日本語** (ja)
- **Русский** (ru)

---

## Markdown 语法测试

### 文本样式

这是**粗体**文本，这是*斜体*文本，这是***粗斜体***文本，这是~~删除线~~文本，这是`行内代码`。

### 链接与图片

[Astro 官网](https://astro.build/)

### 引用

> 这是一段引用文字。
>
> > 这是嵌套引用。

### 列表

无序列表：

- 项目一
- 项目二
  - 嵌套项目 A
  - 嵌套项目 B
- 项目三

有序列表：

1. 第一步
2. 第二步
3. 第三步
   1. 子步骤 3.1
   2. 子步骤 3.2

任务列表：

- [x] 已完成任务
- [ ] 待办任务
- [ ] 另一项待办

### 表格

| 语言 | 代码 | 字体 |
|------|------|------|
| 中文 | zh | Noto Sans SC |
| 英文 | en | Noto Sans |
| 日文 | ja | Noto Sans JP |
| 俄文 | ru | Noto Sans |

### 代码块

```ts
export function greet(name: string): string {
  return `你好，${name}！`;
}

const msg = greet("世界");
console.log(msg);
```

```python
def fibonacci(n: int) -> list[int]:
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result
```

```css
.astro-code {
  @apply rounded-lg border border-border;
  font-family: var(--font-code);
}
```

### 数学公式 (LaTeX)

行内公式：$E = mc^2$

块级公式：

$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

### 分隔线

---

### 脚注

这是一个带脚注的句子。[^1]

[^1]: 这是脚注内容。

### HTML 元素

<details>
<summary>点击展开详情</summary>

这是折叠的内容，支持 Markdown。

- 列表项
- 另一项

</details>

### 水平导航测试

← 上一条 &nbsp;|&nbsp; 下一条 →
