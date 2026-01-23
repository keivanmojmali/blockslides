export const paragraph = `
<paragraph>
Node: paragraph (block group)
Attrs (inherited from BaseBlockAttributes):
- align: "left" | "center" | "right"
- padding: "none" | "sm" | "md" | "lg"
- margin: "none" | "sm" | "md" | "lg"
- backgroundColor: string (CSS color)
- borderRadius: "none" | "sm" | "md" | "lg"
- (and other base attributes)

Content:
- Inline content (text with marks, inline nodes such as image or hardBreak).

Semantics:
- Default text block inside columns and slides.
- Multiple paragraphs can be stacked to create vertical rhythm.
- Use gap on parent column instead of margin on individual paragraphs for consistent spacing.
</paragraph>
`.trim();


