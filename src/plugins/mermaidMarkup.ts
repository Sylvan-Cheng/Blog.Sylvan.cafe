export const MERMAID_STYLE_INJECTION = `<style>
  svg {
    --_text:         var(--mermaid-fg);
    --_text-sec:     var(--mermaid-fg);
    --_text-muted:   var(--mermaid-fg);
    --_text-faint:   var(--mermaid-fg);
    --_line:         var(--mermaid-line);
    --_arrow:        var(--mermaid-line);
    --_node-fill:    var(--mermaid-node-fill);
    --_node-stroke:  var(--mermaid-node-stroke);
    --_group-fill:   var(--mermaid-group-fill);
    --_group-hdr:    var(--mermaid-group-hdr);
    --_inner-stroke: var(--mermaid-inner-stroke);
    --_key-badge:    var(--mermaid-inner-stroke);
  }
  text { font-family: var(--font-body), system-ui, sans-serif; }
</style>`;

export const MERMAID_TRUST_ATTRIBUTE = "data-sylvan-mermaid-token";
export const MERMAID_TRUST_TOKEN = `mermaid-${Math.random().toString(36).slice(2)}`;

export function injectMermaidStyle(svg: string): string {
  return svg.replace(
    /<style\b[^>]*>[\s\S]*?<\/style>/,
    MERMAID_STYLE_INJECTION,
  );
}

export function wrapMermaidSvg(svg: string): string {
  return `<figure class="mermaid-diagram" ${MERMAID_TRUST_ATTRIBUTE}="${MERMAID_TRUST_TOKEN}">${svg}</figure>`;
}
