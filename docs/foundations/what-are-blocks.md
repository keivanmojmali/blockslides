# What are blocks?

Blocks are the **building elements inside your slides**. Things like paragraphs, headings, images, lists, code blocks, and more.

Remember from [What can you make?](/foundations/what-can-you-make) that your content is stored as slides:

```ts
{
  type: "slide",
  attrs: { size: "16x9" },
  content: [...] // <-- This is where blocks live
}
```

**Blocks are what go inside the `content` array of each slide.**

## A simple example

Here's a slide with three blocks: a heading, a paragraph, and a bullet list.

```ts
{
  type: "slide",
  attrs: { size: "16x9" },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Welcome" }]
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "This is a paragraph." }]
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "First item" }]
            }
          ]
        }
      ]
    }
  ]
}
```

Each block is a structured piece of content that knows how to render and behave.

::: tip Technical note
Blockslides is built on [ProseMirror](https://prosemirror.net/) and follows [ProseMirror](https://prosemirror.net/) and [TipTap](https://tiptap.dev/) conventions, where blocks are technically called **"nodes"**. You might see both terms used interchangeably in the codebase and documentation.
:::

## How blocks nest

Blocks can contain other blocks, creating a hierarchy:

- **Document** → contains slides
- **Slide** → contains blocks  
- **Blocks** → contain inline content (text) or other blocks

For example, a `bulletList` block contains `listItem` blocks, and each `listItem` contains a `paragraph` block, which contains `text`.

## Built-in blocks

Blockslides ships with a comprehensive set of blocks out of the box. These are all available in the ExtensionKit
<br/>

### Text blocks
- **Paragraph** — Basic text block
- **Heading** — Headings (levels 1-6)
- **Blockquote** — Quoted content
- **CodeBlock** — Syntax-highlighted code

### Lists
- **BulletList** — Unordered lists
- **OrderedList** — Numbered lists
- **TaskList** — Checkable todo items

### Media
- **Image** — Inline images
- **ImageBlock** — Full-featured image block with sizing, cropping, and alignment
- **Youtube** — Embedded YouTube videos

### Layout
- **Column** — Multi-column layouts
- **ColumnGroup** — Container for column groups

### Special blocks
- **HorizontalRule** — Divider line
- **Table** — Tables with rows, cells, and headers
- **Details** — Expandable content sections
- **InlineMath** / **BlockMath** — Mathematical expressions

### Structure
- **Slide** — The main container for your content
- **Document** — Top-level document (always present)
- **Text** — The actual text content within blocks

## Block characteristics

All blocks share these common features:

### 1. Content model
Blocks define what they can contain:

```ts
// Paragraph can contain inline content (text + marks)
content: 'inline*'

// Bullet list contains list items
content: 'listItem+'

// Slide can contain any block
content: 'block*'
```

### 2. Attributes
Blocks can have attributes to configure their behavior:

```ts
{
  type: "heading",
  attrs: { level: 2 }  // This is an H2
}

{
  type: "slide",
  attrs: { 
    size: "16x9",
    background: "#ffffff"
  }
}
```

### 3. Commands
Every block comes with editor commands you can call:

```ts
// Set a heading
editor.commands.setHeading({ level: 1 })

// Insert an image block
editor.commands.insertImageBlock({
  src: "https://example.com/image.jpg",
  alt: "Description"
})

// Toggle a bullet list
editor.commands.toggleBulletList()
```

### 4. Keyboard shortcuts
Blocks have built-in keyboard shortcuts:
- `Mod-Alt-1` through `Mod-Alt-6` — Headings
- `Mod-Alt-0` — Paragraph
- `---` followed by space — Horizontal rule
- `#` followed by space — Heading

### 5. Markdown support
Most blocks support markdown parsing and rendering, making it easy to import/export content.

## Creating custom blocks

Want to add your own block types? You can extend any existing block or create entirely new ones by building custom extensions.

Check out the [Extension Kit overview](/features/customization/extension-kit-overview) to learn more.
<br/>
