# Schema

ProseMirror schema definitions that define the document structure and formatting capabilities of AutoArtifacts.

## 📁 Directory Structure

```
schema/
├── index.ts          # Schema exports and main schema object
├── nodes/            # Node type definitions (structure)
│   ├── index.ts
│   ├── slides.ts         # Document and slide nodes
│   ├── row.ts            # Row container (horizontal layout)
│   ├── column.ts         # Column container (vertical layout)
│   ├── image.ts          # Image node
│   ├── video.ts          # Video embed node
│   ├── bulletList.ts     # Bullet list
│   ├── orderedList.ts    # Ordered list
│   └── listItem.ts       # List item
└── marks/            # Mark type definitions (formatting)
    ├── index.ts
    ├── bold.ts           # Bold text
    ├── italic.ts         # Italic text
    ├── underline.ts      # Underlined text
    ├── strikethrough.ts  # Strikethrough text
    ├── code.ts           # Inline code
    ├── link.ts           # Hyperlinks
    ├── textColor.ts      # Text color
    ├── highlight.ts      # Background highlight
    ├── fontFamily.ts     # Font family
    ├── fontSize.ts       # Font size
    ├── letterSpacing.ts  # Letter spacing
    ├── lineHeight.ts     # Line height
    ├── textShadow.ts     # Text shadow
    ├── textTransform.ts  # Text transform (uppercase, etc.)
    ├── subscript.ts      # Subscript
    └── superscript.ts    # Superscript
```

## 🎯 What is a Schema?

In ProseMirror, a **schema** defines:
1. **What content types can exist** (nodes like paragraphs, headings, images)
2. **How content can be formatted** (marks like bold, italic, colors)
3. **What attributes they can have** (e.g., heading level, image src)
4. **What can contain what** (e.g., slides contain rows, rows contain columns)
5. **How content is rendered** (toDOM) and parsed (parseDOM)

## 📦 Main Schema Object

```typescript
// src/schema/index.ts
import { Schema } from 'prosemirror-model';
import { nodes } from './nodes';
import { marks } from './marks';

export const schema = new Schema({
  nodes,
  marks
});
```

This schema is used to:
- Create the initial editor state
- Validate document structure
- Render content to the DOM
- Parse content from JSON/HTML

## 🧱 Nodes

Nodes represent the document structure (block-level and inline elements).

### Document Structure Nodes

#### doc
Root document node.
```typescript
{
  type: 'doc',
  content: [/* slides */]
}
```

#### slide
Individual presentation slide.
```typescript
{
  type: 'slide',
  attrs: {
    className?: string  // Optional CSS class
  },
  content: [/* rows */]
}
```

#### row
Horizontal container for columns.
```typescript
{
  type: 'row',
  attrs: {
    layout?: string,    // e.g., '2-1', '1-1-1'
    className?: string
  },
  content: [/* columns */]
}
```

#### column
Vertical container for content.
```typescript
{
  type: 'column',
  attrs: {
    contentMode?: 'default' | 'cover' | 'contain',
    verticalAlign?: 'top' | 'center' | 'bottom',
    horizontalAlign?: 'left' | 'center' | 'right',
    padding?: 'none' | 'small' | 'medium' | 'large',
    className?: string
  },
  content: [/* blocks or nested rows */]
}
```

### Content Nodes

#### paragraph
Text paragraph.
```typescript
{
  type: 'paragraph',
  content: [/* inline content */]
}
```

#### heading
Heading (H1-H6).
```typescript
{
  type: 'heading',
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6
  },
  content: [/* inline content */]
}
```

#### text
Text node (inline).
```typescript
{
  type: 'text',
  text: 'Hello world',
  marks?: [/* formatting marks */]
}
```

### Media Nodes

#### image
Image element.
```typescript
{
  type: 'image',
  attrs: {
    src: string,
    alt?: string,
    width?: number | string,
    display?: 'default' | 'cover' | 'contain' | 'fill',
    align?: 'left' | 'center' | 'right'
  }
}
```

#### video
Video embed (YouTube, Vimeo, etc.).
```typescript
{
  type: 'video',
  attrs: {
    src: string,
    provider?: 'youtube' | 'vimeo' | 'embed',
    width?: number | string,
    aspectRatio?: '16:9' | '4:3' | '1:1',
    align?: 'left' | 'center' | 'right'
  }
}
```

### List Nodes

#### bulletList
Unordered list.
```typescript
{
  type: 'bulletList',
  content: [/* listItem nodes */]
}
```

#### orderedList
Ordered (numbered) list.
```typescript
{
  type: 'orderedList',
  attrs: {
    start?: number  // Starting number
  },
  content: [/* listItem nodes */]
}
```

#### listItem
List item (used in both bullet and ordered lists).
```typescript
{
  type: 'listItem',
  content: [/* block content */]
}
```

## 🎨 Marks

Marks represent text formatting (can overlap and combine).

### Basic Formatting

#### bold
Bold text.
```typescript
{ type: 'bold' }
```

#### italic
Italic text.
```typescript
{ type: 'italic' }
```

#### underline
Underlined text.
```typescript
{ type: 'underline' }
```

#### strikethrough
Strikethrough text.
```typescript
{ type: 'strikethrough' }
```

#### code
Inline code formatting.
```typescript
{ type: 'code' }
```

### Link

#### link
Hyperlink.
```typescript
{
  type: 'link',
  attrs: {
    href: string,
    title?: string,
    target?: string  // e.g., '_blank'
  }
}
```

### Colors

#### textColor
Text foreground color.
```typescript
{
  type: 'textColor',
  attrs: {
    color: string  // CSS color value
  }
}
```

#### highlight
Text background color (highlight).
```typescript
{
  type: 'highlight',
  attrs: {
    color: string  // CSS color value
  }
}
```

### Typography

#### fontFamily
Font family.
```typescript
{
  type: 'fontFamily',
  attrs: {
    fontFamily: string  // CSS font-family value
  }
}
```

#### fontSize
Font size.
```typescript
{
  type: 'fontSize',
  attrs: {
    fontSize: string  // CSS font-size value (e.g., '16px', '1.5em')
  }
}
```

#### letterSpacing
Letter spacing (tracking).
```typescript
{
  type: 'letterSpacing',
  attrs: {
    letterSpacing: string  // CSS letter-spacing value
  }
}
```

#### lineHeight
Line height (leading).
```typescript
{
  type: 'lineHeight',
  attrs: {
    lineHeight: string  // CSS line-height value
  }
}
```

#### textShadow
Text shadow effect.
```typescript
{
  type: 'textShadow',
  attrs: {
    textShadow: string  // CSS text-shadow value
  }
}
```

#### textTransform
Text transformation.
```typescript
{
  type: 'textTransform',
  attrs: {
    textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  }
}
```

### Script

#### subscript
Subscript text (e.g., H₂O).
```typescript
{ type: 'subscript' }
```

#### superscript
Superscript text (e.g., x²).
```typescript
{ type: 'superscript' }
```

## 🏗️ Content Model

The schema enforces a strict content hierarchy:

```
doc
└── slide+
    └── row+
        └── column+
            ├── (block | row)+
            │   ├── paragraph
            │   ├── heading
            │   ├── image
            │   ├── video
            │   ├── bulletList
            │   └── orderedList
            └── row (nested)
```

### Content Rules

1. **doc** can only contain **slide** nodes
2. **slide** can only contain **row** nodes
3. **row** can only contain **column** nodes
4. **column** can contain **block nodes** or nested **row** nodes
5. **Lists** contain **listItem** nodes
6. **Text nodes** can have multiple **marks** applied

## 🎯 Example Document

```json
{
  "type": "doc",
  "content": [
    {
      "type": "slide",
      "content": [
        {
          "type": "row",
          "attrs": { "layout": "2-1" },
          "content": [
            {
              "type": "column",
              "attrs": {
                "verticalAlign": "center",
                "padding": "large"
              },
              "content": [
                {
                  "type": "heading",
                  "attrs": { "level": 1 },
                  "content": [
                    {
                      "type": "text",
                      "text": "Hello World",
                      "marks": [
                        { "type": "bold" },
                        { "type": "textColor", "attrs": { "color": "#ff0000" } }
                      ]
                    }
                  ]
                },
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "type": "text",
                      "text": "Welcome to "
                    },
                    {
                      "type": "text",
                      "text": "AutoArtifacts",
                      "marks": [{ "type": "bold" }]
                    }
                  ]
                }
              ]
            },
            {
              "type": "column",
              "content": [
                {
                  "type": "image",
                  "attrs": {
                    "src": "image.jpg",
                    "alt": "Logo",
                    "display": "cover"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 🔧 Customizing the Schema

### Adding a Custom Node

1. Create node definition in `nodes/` directory:

```typescript
// nodes/callout.ts
export const callout = {
  content: 'block+',
  group: 'block',
  attrs: {
    type: { default: 'info' }  // info, warning, error
  },
  parseDOM: [{
    tag: 'div.callout',
    getAttrs: (dom: HTMLElement) => ({
      type: dom.getAttribute('data-type') || 'info'
    })
  }],
  toDOM: (node: Node) => [
    'div',
    {
      class: `callout callout-${node.attrs.type}`,
      'data-type': node.attrs.type
    },
    0  // Content hole
  ]
};
```

2. Add to nodes index:

```typescript
// nodes/index.ts
import { callout } from './callout';

export const nodes = {
  // ... existing nodes
  callout
};
```

3. Add TypeScript type:

```typescript
// types/index.ts
export interface CalloutNode {
  type: 'callout';
  attrs: {
    type: 'info' | 'warning' | 'error';
  };
  content: BlockNode[];
}
```

### Adding a Custom Mark

1. Create mark definition in `marks/` directory:

```typescript
// marks/backgroundColor.ts
export const backgroundColor = {
  attrs: {
    color: {}
  },
  parseDOM: [{
    style: 'background-color',
    getAttrs: (value: string) => ({ color: value })
  }],
  toDOM: (mark: Mark) => [
    'span',
    { style: `background-color: ${mark.attrs.color}` },
    0
  ]
};
```

2. Add to marks index and types similarly.

## 📚 Schema Files Deep Dive

### Node Files

Each node file exports a node spec object:

```typescript
// nodes/heading.ts
export const heading = {
  content: 'inline*',           // Can contain inline content
  group: 'block',               // Part of 'block' group
  attrs: {
    level: { default: 1 }       // Heading level attribute
  },
  parseDOM: [                   // How to parse from HTML
    { tag: 'h1', attrs: { level: 1 } },
    { tag: 'h2', attrs: { level: 2 } },
    // ... h3-h6
  ],
  toDOM: (node) => [            // How to render to DOM
    `h${node.attrs.level}`,
    0  // Content hole
  ]
};
```

### Mark Files

Each mark file exports a mark spec object:

```typescript
// marks/bold.ts
export const bold = {
  parseDOM: [
    { tag: 'strong' },
    { tag: 'b' },
    { style: 'font-weight', getAttrs: value => 
        /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null 
    }
  ],
  toDOM: () => ['strong', 0]
};
```

## 🧪 Testing the Schema

Test schema definitions in the demo:

```bash
cd demo
npm run dev
```

Try:
- Creating all node types
- Applying all marks
- Combining marks
- Nesting structures
- Invalid structures (should be prevented)

## 📚 Related Documentation

- [ProseMirror Schema Guide](https://prosemirror.net/docs/guide/#schema)
- [Types Documentation](../types/README.md) - TypeScript types for schema
- [Validation Documentation](../validation/README.md) - Content validation
- [Main README](../../README.md)

---

For more examples, see the [demo application](../../demo/README.md).

