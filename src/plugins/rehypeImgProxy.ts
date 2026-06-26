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
import { toClassList } from "./hastUtils";
import { buildImgProxyUrls } from "./imgProxyUrls";

export function rehypeImgProxy() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;

      const src = node.properties?.src;
      if (typeof src !== "string") return;

      const w = node.properties?.width;
      const h = node.properties?.height;
      const urls = buildImgProxyUrls(src, w, h);
      if (!urls) return;

      const props = node.properties ?? {};
      node.properties = props;
      props.src = urls.thumbUrl;
      props["data-zoom-src"] = urls.fullUrl;

      const classList = toClassList(props.className);
      props.className = [...classList, "img-zoomable"].filter(Boolean);
    });
  };
}
