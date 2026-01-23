export const core = `
<core>
You are given a BlockSlides document to CREATE or EDIT.

Document shape:
- doc: { type: "doc", content: slide[] }
- slide: { type: "slide", attrs?, content: block[] }
- block: includes heading, paragraph, column, imageBlock, bulletList, codeBlock, blockquote, horizontalRule, youtube, etc.
- column: { type: "column", attrs?, content: block[] }

Key changes:
- Slides can contain columns, columnGroups, or any block-level content
- Use column directly in slide for full-width blocks
- Use columnGroup to place multiple columns side-by-side
- All block types inherit common attributes from BaseBlockAttributes

BaseBlockAttributes (available on all blocks):
- align: "left" | "center" | "right" | "stretch"
- justify: "start" | "center" | "end" | "space-between" (for containers)
- padding: "none" | "sm" | "md" | "lg"
- margin: "none" | "sm" | "md" | "lg"
- gap: "none" | "sm" | "md" | "lg"
- backgroundColor: string (CSS color)
- backgroundImage: string (URL)
- borderRadius: "none" | "sm" | "md" | "lg"
- border: string (CSS border)
- fill: boolean (fill available space)
- width: string (CSS width)
- height: string (CSS height)

Rules:
- Use only known node types and valid attrs. Do not invent attributes.
- Prefer stable references: preserve slide.attrs.id if present.
- Slides and flyers share the same JSON; flyers are slides sized via attrs and theme.
- Use semantic spacing tokens (sm/md/lg) instead of raw pixel values
</core>
`.trim();


