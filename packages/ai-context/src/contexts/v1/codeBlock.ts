export const codeBlock = `
<codeBlock>
Node: codeBlock (block group)
Attrs (codeBlock-specific):
- language (optional): string | null (e.g., "js", "ts", "python")

Attrs (inherited from BaseBlockAttributes):
- align: "left" | "center" | "right"
- padding: "none" | "sm" | "md" | "lg"
- margin: "none" | "sm" | "md" | "lg"
- backgroundColor: string (CSS color)
- borderRadius: "none" | "sm" | "md" | "lg"
- (and other base attributes)

Content:
- Plain text only (no child nodes); used for preformatted code samples.

Semantics:
- Renders as <pre><code>…</code></pre>.
- language controls a CSS class (e.g., "language-js") for syntax highlighting.
- Use when the user explicitly wants a fenced code block, not inline code in a paragraph.
</codeBlock>
`.trim();


