export const MERMAID_STYLE_INJECTION = `<style>
  svg {
    --_text:         var(--diagram-fg);
    --_text-sec:     var(--diagram-fg);
    --_text-muted:   var(--diagram-fg);
    --_text-faint:   var(--diagram-fg);
    --_line:         var(--diagram-line);
    --_arrow:        var(--diagram-line);
    --_node-fill:    var(--diagram-node-fill);
    --_node-stroke:  var(--diagram-node-stroke);
    --_group-fill:   var(--diagram-group-fill);
    --_group-hdr:    var(--diagram-group-hdr);
    --_inner-stroke: var(--diagram-inner-stroke);
    --_key-badge:    var(--diagram-inner-stroke);
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
