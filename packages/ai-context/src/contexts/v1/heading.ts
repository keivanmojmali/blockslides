export const heading = `
<heading>
Node: heading (block group)
Attrs (heading-specific):
- level (required): 1 | 2 | 3 | 4 | 5 | 6

Attrs (inherited from BaseBlockAttributes):
- align: "left" | "center" | "right"
- padding: "none" | "sm" | "md" | "lg"
- margin: "none" | "sm" | "md" | "lg"
- backgroundColor: string (CSS color)
- borderRadius: "none" | "sm" | "md" | "lg"
- (and other base attributes)

Content:
- Inline content (text, marks, inline nodes).

Semantics:
- Renders as <h1>…<h6> depending on level.
- Use level 1–2 for main slide titles, 3–4 for section headings, 5–6 for subtle labels.
</heading>
`.trim();


