export const image = `
Node: image
Attrs:
- src (required): string (URL to the image).
- alt (optional): string (accessibility text).
- title (optional): string (tooltip / caption).
- width, height (optional): numbers (px) used as hints for rendering.

Content:
- No children; this is an atomic inline or block-level image node depending on editor configuration.

Semantics:
- Renders as a simple <img>, unlike imageBlock which adds rich framing/caption UI.
- Prefer imageBlock for designed layouts; use image for simple inline images in paragraphs.
`.trim();


