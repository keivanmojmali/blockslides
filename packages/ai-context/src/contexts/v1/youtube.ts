export const youtube = `
Node: youtube
Attrs:
- src (required): string (public YouTube URL).
- start (optional): number (start time in seconds).
- width (optional): number (frame width in px).
- height (optional): number (frame height in px).

Content:
- No children; this is an atomic embed node.

Semantics:
- Renders as an embedded YouTube iframe wrapped in a container <div>.
- Use for video embeds inside a column or row; keep other text in separate paragraphs/columns.
- Do not embed raw <iframe> HTML directly; always use the youtube node with attrs.
`.trim();


