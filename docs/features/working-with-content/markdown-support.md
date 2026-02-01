# Markdown Support

The Markdown extension enables **converting between markdown and JSON** for your slide content. It's perfect for importing markdown files, exporting presentations, or programmatically working with content.

::: tip Not a markdown editor
This extension provides conversion tools, not real-time markdown editing. Users edit in the visual editor, and you can import/export markdown programmatically.
:::

## Installation

The Markdown extension is included in the ExtensionKit by default. If you're using a custom extension setup:

```ts
import { Markdown } from '@blockslides/markdown'

const editor = useEditor({
  extensions: [
    // ... other extensions
    Markdown.configure({
      // optional configuration
    })
  ]
})
```

## Importing Markdown

There are several ways to load markdown content into the editor:

### At Initialization

Load markdown when creating the editor:

```ts
const editor = useEditor({
  extensions: [Markdown],
  content: '# Welcome\n\nThis is a **slide** with markdown.',
  contentType: 'markdown'
})
```

### Programmatically

Parse and insert markdown at any time:

```ts
const markdown = `# My Slide

- First item
- Second item
- **Bold text**`

const json = editor.markdown.parse(markdown)
editor.commands.setContent(json)
```

### Insert at Cursor

Insert markdown content at the current cursor position:

```ts
const markdown = '## New Section\n\nSome content here.'

editor.commands.insertContent(markdown, { 
  contentType: 'markdown' 
})
```

### Insert at Specific Position

Insert markdown at a specific document position:

```ts
editor.commands.insertContentAt(100, markdown, { 
  contentType: 'markdown' 
})
```

## Exporting Markdown

Get the current editor content as markdown:

```ts
const markdown = editor.getMarkdown()

console.log(markdown)
// Output:
// # Welcome
// 
// This is a **slide** with markdown.
```

You can also serialize specific JSON content:

```ts
const json = editor.getJSON()
const markdown = editor.markdown.serialize(json)
```

## Configuration

### Indentation

Control how nested content (like lists and code blocks) is indented:

```ts
Markdown.configure({
  indentation: {
    style: 'space',  // 'space' or 'tab'
    size: 2          // number of spaces/tabs per level
  }
})
```

**Examples:**

```ts
// Use tabs instead of spaces
indentation: { style: 'tab', size: 1 }

// Use 4 spaces
indentation: { style: 'space', size: 4 }
```

### Custom Marked Instance

Provide your own configured `marked` instance:

```ts
import { marked } from 'marked'

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: false
})

// Use it in Blockslides
Markdown.configure({
  marked: marked
})
```

### Marked Options

Pass options directly to `marked.setOptions()`:

```ts
Markdown.configure({
  markedOptions: {
    gfm: true,           // GitHub Flavored Markdown
    breaks: false,       // Line breaks as <br>
    pedantic: false,     // Strict markdown
    smartypants: false   // Typographic punctuation
  }
})
```

See the [marked.js documentation](https://marked.js.org/using_advanced#options) for all available options.

## Supported Markdown Syntax

The following markdown syntax is supported when you have the corresponding extensions enabled:

### Text Formatting
- `**bold**` → **bold**
- `*italic*` → *italic*
- `~~strikethrough~~` → ~~strikethrough~~
- `` `code` `` → `code`
- `[link](url)` → [link](url)

### Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Lists

**Bullet lists:**
```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested
- Item 3
```

**Numbered lists:**
```markdown
1. First item
2. Second item
3. Third item
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
```

### Code Blocks

````markdown
```javascript
function hello() {
  console.log('Hello, world!')
}
```
````

### Images

```markdown
![Alt text](https://example.com/image.jpg)
```

### Horizontal Rules

```markdown
---
```

### Tables

If you're using the Table extension:

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### Math

If you're using the Mathematics extension:

```markdown
Inline math: $E = mc^2$

Block math:
$$
\frac{n!}{k!(n-k)!}
$$
```

## Markdown-Style Input Rules

While typing in the editor, you can use markdown-style shortcuts to quickly format content:

- `# ` → Heading 1
- `## ` → Heading 2
- `### ` → Heading 3
- `> ` → Blockquote
- `- ` → Bullet list
- `1. ` → Numbered list
- `---` → Horizontal rule

::: tip Input rules are separate
These input rules are built into individual extensions (Heading, Blockquote, etc.), not the Markdown extension. They work automatically when you have those extensions enabled.
:::

## Working with Slides

Since Blockslides uses a slide-based structure, markdown conversion handles slides specially:

### Single Slide

When you parse markdown with multiple blocks, they'll be wrapped in a single slide:

```ts
const markdown = `
# Welcome

This is paragraph 1.

This is paragraph 2.
`

const json = editor.markdown.parse(markdown)
// Result: { type: 'doc', content: [{ type: 'slide', content: [...] }] }
// One doc containing one slide with heading and two paragraphs
```

### Multiple Slides

To create multiple slides, you'll need to structure your JSON and then serialize/parse appropriately. Markdown doesn't have a native "slide break" concept, so you'll typically:

1. Import markdown as a single slide
2. Split content manually if needed
3. Or structure your JSON with multiple slides first, then export

## Common Use Cases

### Import a Markdown File

```ts
async function importMarkdown(file: File) {
  const text = await file.text()
  const json = editor.markdown.parse(text)
  editor.commands.setContent(json)
}
```

### Export as Markdown File

```ts
function exportMarkdown() {
  const markdown = editor.getMarkdown() // <--

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'presentation.md'
  a.click()
  URL.revokeObjectURL(url)
}
```

### Convert Between Formats

```ts
// Markdown → JSON
const json = editor.markdown.parse(markdownString)

// JSON → Markdown
const markdown = editor.markdown.serialize(jsonContent)

// Get current content as markdown
const currentMarkdown = editor.getMarkdown()
```

## Extending with Custom Markdown

Extensions can define custom markdown parsing and rendering. This allows you to add support for custom syntax.

Each extension can provide:
- `parseMarkdown` - How to convert markdown tokens to JSON nodes
- `renderMarkdown` - How to convert JSON nodes back to markdown
- `markdownTokenizer` - Custom tokenization rules for unique syntax

For details on creating custom extensions with markdown support, see [Creating Custom Extensions](/features/customization/creating-extensions).
<br/>

