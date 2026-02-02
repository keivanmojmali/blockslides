# What are the schemas?

The schema defines **the rules and structure** for your slide documents. It determines what blocks can exist, where they can go, and how they can nest together.


## The basic structure

Every Blockslides document follows this hierarchy:

```
doc → slide+ → block+ → inline content
```

- **`doc`** is the top-level container (always present, always the same)
- **`slide+`** means one or more slides (the `+` means "at least one")
- **`block+`** means one or more blocks inside each slide
- **inline content** is text with formatting (marks like bold, italic, etc.)

Here's what that looks like in practice:
```ts
{
  type: "doc",
  content: [
    {
      type: "slide",
      attrs: { size: "16x9" },
      content: [
        {
          type: "heading",
          content: [{ type: "text", text: "Hello" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "World" }]
        }
      ]
    }
  ]
}
```

The schema enforces this structure. You can't put a paragraph directly in the `doc`, and you can't put a slide inside another slide.

## What the schema controls

The schema defines several important rules:

### 1. Which blocks can exist
The schema defines all available block types: `paragraph`, `heading`, `bulletList`, `image`, `slide`, etc.

If a block type isn't defined in the schema, the editor won't recognize it.

### 2. What content each block can contain
Every block has a `content` expression that defines what it can hold:

```ts
// Paragraph can contain inline content (text + marks)
paragraph: {
  content: 'inline*'  // * means "zero or more"
}

// Bullet list must contain list items
bulletList: {
  content: 'listItem+' // + means "one or more"
}

// Slide can contain any block
slide: {
  content: 'block+' // Must have at least one block
}
```

### 3. What attributes blocks can have
Blocks can define attributes with default values:

```ts
slide: {
  attrs: {
    size: { default: "16x9" },
    className: { default: "" }
  }
}

heading: {
  attrs: {
    level: { default: 1 } // H1, H2, H3, etc.
  }
}
```

### 4. How blocks can nest
The schema determines which blocks can be nested inside others:

```ts
// ✅ Valid - follows schema rules
{
  type: "slide",
  content: [
    { type: "paragraph", content: [...] }
  ]
}

// ❌ Invalid - paragraphs can't be direct children of doc
{
  type: "doc",
  content: [
    { type: "paragraph", content: [...] }
  ]
}

// ❌ Invalid - slides can't nest inside slides
{
  type: "slide",
  content: [
    { type: "slide", content: [...] }
  ]
}
```

## Schema components

The Blockslides schema is made up of two main parts:

### Nodes (blocks)
Structural elements that make up your document:
- `doc` - Top-level document container
- `slide` - Individual slide container
- `paragraph` - Text paragraphs
- `heading` - Headings (H1-H6)
- `bulletList`, `orderedList` - Lists
- `listItem` - Individual list items
- `image`, `video` - Media elements
- `text` - The actual text content

These are defined in `packages/core/src/schema/nodes/`.

### Marks (inline formatting)
Formatting that can be applied to text:
- `bold`, `italic`, `underline`
- `code`, `strike`
- `link`
- `textColor`, `highlight`
- `fontSize`, `fontFamily`
- `superscript`, `subscript`

These are defined in `packages/core/src/schema/marks/`.

::: tip Technical note
Blockslides uses [ProseMirror's schema system](https://prosemirror.net/docs/guide/#schema) under the hood. The schema is defined at `packages/core/src/schema/` and combines node specs and mark specs into a single Schema object.
:::

## Why schemas matter

The schema is what makes the editor predictable and reliable:

### 1. Ensures consistent structure
Every document follows the same rules, so you always know what to expect.

### 2. Prevents invalid content
You can't accidentally create broken structures—the editor won't allow it.

```ts
// The editor prevents this invalid structure
editor.commands.insertContent({
  type: "paragraph" // ❌ Can't insert paragraph at doc level
})

// Instead, paragraphs must go inside a slide
editor.commands.insertContent({
  type: "slide",
  content: [
    { type: "paragraph", content: [...] } // ✅ Valid
  ]
})
```

### 3. Enables predictable behavior
Commands, keyboard shortcuts, and UI controls all work with the schema to provide consistent editing experiences.

### 4. Makes serialization reliable
Because the structure is well-defined, converting to/from JSON, HTML, or Markdown is straightforward and lossless.

## Extending the schema

While the base schema is fixed, you can extend it by creating custom extensions that add new nodes or marks.

For example, you could add:
- A `callout` block for highlighted information
- A `video` mark for inline video timestamps
- A `custom-layout` block with special rendering

**Extensions register their nodes and marks, and the editor automatically incorporates them into the schema.**

Learn more about building custom extensions in [What are extensions?](/foundations/what-are-extensions)

## Content expressions reference

When you're building custom extensions, you'll work with these content expressions:

- `inline*` - Zero or more inline content (text + marks)
- `inline+` - One or more inline content
- `block*` - Zero or more block-level elements
- `block+` - One or more block-level elements
- `slide+` - One or more slides
- `listItem+` - One or more list items
- `text*` - Plain text only

You can combine these to create complex content models:

```ts
// A block that can contain either inline content OR blocks
content: '(inline | block)+'

// A block that must contain exactly one image
content: 'image'

// A block that contains paragraphs or headings
content: '(paragraph | heading)+'
```
