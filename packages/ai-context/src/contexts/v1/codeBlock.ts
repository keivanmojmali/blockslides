export const codeBlock = `
<codeBlock>
Node: codeBlock
Attrs:
- language (optional): string | null (e.g., "js", "ts", "python").

Content:
- Plain text only (no child nodes); used for preformatted code samples.

Semantics:
- Renders as <pre><code>…</code></pre>.
- language controls a CSS class (e.g., "language-js") for syntax highlighting.
- Use when the user explicitly wants a fenced code block, not inline code in a paragraph.
</codeBlock>
`.trim();


