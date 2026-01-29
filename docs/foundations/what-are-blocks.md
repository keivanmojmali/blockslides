# What are blocks (and nodes)?

Blocks are the **fundamental building units** of your slides. Think of them as structured content elements like paragraphs, headings, images, lists, and more.

In Blockslides, we follow [TipTap](https://tiptap.dev/) and [ProseMirror](https://prosemirror.net/) conventions, where blocks are technically called **"nodes"**. But we'll use both terms interchangeably since "blocks" is more intuitive.

## The big picture

Everything in Blockslides is an **extension**. Extensions come in three flavors:

1. **Nodes** (blocks) — Structured content elements (Paragraph, Heading, Image, etc.)
2. **Marks** — Inline text formatting (Bold, Italic, Link, etc.)
3. **Extensions** — Editor functionality (DragHandle, UndoRedo, BubbleMenu, etc.)

This page focuses on **nodes/blocks** — the structural elements that make up your slide content.

## How blocks work

Each block in your slide is a node in the document structure. Here's what a simple slide with a few blocks looks like:

```ts
const doc = {
  type: "doc",
  content: [
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
  ]
};
```

Notice the hierarchy:
- **Document** → contains slides
- **Slide** → contains blocks
- **Blocks** → contain inline content or other blocks

## Built-in blocks

Blockslides ships with a comprehensive set of blocks out of the box. These are all available in the [StarterKit](/getting-started/quickstart/react).

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

Want to add your own block types? You can extend any existing block or create entirely new ones. 

Check out the [Extensions documentation](/features/blocks-and-extensions/extensions/overview) to learn how to build custom blocks.

## Next steps

- Learn about [Extensions](/foundations/what-are-extensions) and how they add functionality
- Explore [Schemas](/foundations/what-are-the-schemas) to understand content validation
- See [What can you make?](/foundations/what-can-you-make) for real-world examples
