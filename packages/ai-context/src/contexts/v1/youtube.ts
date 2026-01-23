export const youtube = `
<youtube>
Node: youtube (block group)
Attrs (youtube-specific):
- src (required): string (public YouTube URL)
- start (optional): number (start time in seconds)
- width (optional): number (frame width in px)
- height (optional): number (frame height in px)

Attrs (inherited from BaseBlockAttributes):
- align: "left" | "center" | "right" | "stretch"
- padding: "none" | "sm" | "md" | "lg"
- margin: "none" | "sm" | "md" | "lg"
- borderRadius: "none" | "sm" | "md" | "lg"
- (and other base attributes)

Content:
- No children; this is an atomic embed node.

Semantics:
- Renders as an embedded YouTube iframe wrapped in a container <div>.
- Use for video embeds inside a column or slide.
- Do not embed raw <iframe> HTML directly; always use the youtube node with attrs.
</youtube>
`.trim();


