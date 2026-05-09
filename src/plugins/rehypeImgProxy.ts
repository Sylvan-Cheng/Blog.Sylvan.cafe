/**
 * Rehype 构建期插件：拦截 s3.sylvan.cafe 的图片，替换为 imgproxy 处理链接。
 *
 * 处理规则：
 *  - 提取相对路径 [PATH] = src.replace("https://s3.sylvan.cafe/", "")
 *  - 原图 URL  → https://img.sylvan.cafe/unsafe/plain/[PATH]（赋给 data-zoom-src，点击放大用）
 *  - 缩略图 URL → 有宽高时 rs:fit:w:h，否则默认 w:800（赋给 src，首屏渲染用）
 *  - 添加 class="img-zoomable"，供客户端脚本按需加载 medium-zoom
 *
 * 注意：Markdown 中的原始 HTML <img> 标签在 HAST 中会被保留为 raw 节点，
 * 需要 rehype-raw 在前面将其转为 element 节点，本插件才能命中。
 */
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

const S3_BASE = "https://s3.sylvan.cafe/";
const PROXY_BASE = "https://img.sylvan.cafe/unsafe/";

export function rehypeImgProxy() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;

      const src = node.properties?.src;
      if (typeof src !== "string" || !src.startsWith(S3_BASE)) return;

      const path = src.slice(S3_BASE.length);
      const fullUrl = `${PROXY_BASE}plain/${path}`;

      const w = node.properties?.width;
      const h = node.properties?.height;

      let thumbUrl: string;
      if (w !== undefined && h !== undefined) {
        thumbUrl = `${PROXY_BASE}rs:fit:${Number(w)}:${Number(h)}/plain/${path}`;
      } else {
        thumbUrl = `${PROXY_BASE}w:800/plain/${path}`;
      }

      node.properties!.src = thumbUrl;
      node.properties!["data-zoom-src"] = fullUrl;

      const cls = node.properties?.className;
      const classList = Array.isArray(cls)
        ? cls
        : typeof cls === "string"
          ? [cls]
          : [];
      node.properties!.className = [...classList, "img-zoomable"].filter(Boolean);
    });
  };
}
