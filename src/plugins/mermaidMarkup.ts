export function wrapMermaidSvg(svg: string): string {
  return `<figure class="mermaid-diagram">${svg}</figure>`;
}
