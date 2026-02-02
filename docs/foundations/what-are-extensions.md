# What are extensions?

Extensions are **modular pieces of code that add functionality to BlockSlides**. While blocks define your content structure (headings, paragraphs, images), extensions define how those blocks work, what features they have, and how users interact with them.

Think of it this way:
- **Blocks** are the content (a heading, an image, a slide)
- **Extensions** are the code that makes them functional (defining behaviors, adding commands, enabling keyboard shortcuts)

## How extensions and blocks relate

Every block type in BlockSlides is defined by an extension. When you use a `heading` block in your content, it's powered by the `Heading` extension running in your editor.

Extensions do more than just define blocks though. They also add:
- **Editor behaviors** (undo/redo, drag-and-drop, keyboard shortcuts)
- **UI controls** (bubble menus, floating menus, add-slide buttons)
- **Text formatting** (bold, italic, colors, fonts)
- **Special features** (markdown parsing, placeholder text, file handling)

## A simple example

Here's how you might add extensions when creating an editor:

```ts
import { useSlideEditor } from '@blockslides/react';
import { Document } from '@blockslides/extension-document';
import { Heading } from '@blockslides/extension-heading';
import { Paragraph } from '@blockslides/extension-paragraph';
import { Bold } from '@blockslides/extension-bold';
import { ImageBlock } from '@blockslides/extension-image-block';
import { Text } from '@blockslides/extension-text';

const editor = useSlideEditor({
  extensions: [
    Document,        // Root document node
    Text,           // Base text node
    Paragraph,      // Paragraph blocks
    Heading,        // Heading blocks
    Bold,          // Bold text formatting
    ImageBlock,    // Image blocks with sizing/cropping
  ]
});
```

Each extension is a self-contained module that adds specific capabilities to your editor. You import only what you need and compose them together.

## Built-in extensions

Blockslides ships with a comprehensive set of extensions covering everything from basic text formatting to media embeds and advanced editor behaviors.

### Core extensions
- **Document** — Top-level document node (slide+ or block+)
- **Text** — Base text node for all content
- **Slide** — The main slide container
- **Column** / **ColumnGroup** — Layout system for multi-column content

### Text formatting
- **Bold** — Bold text formatting
- **Italic** — Italic text formatting
- **Underline** — Underlined text
- **Strike** — Strike-through text
- **Code** — Inline code formatting
- **Subscript** / **Superscript** — Subscript and superscript text
- **Highlight** — Text highlighting with colors
- **Color** — Text color
- **BackgroundColor** — Text background color
- **FontFamily** — Font family control
- **FontSize** — Font size control
- **LineHeight** — Line height control
- **TextAlign** — Text alignment (left, center, right)
- **TextStyle** — Base text styling extension

### Block types
- **Paragraph** — Basic text block
- **Heading** — Headings (levels 1-6)
- **Blockquote** — Quoted content
- **CodeBlock** — Syntax-highlighted code blocks
- **HorizontalRule** — Divider lines

### Lists
- **BulletList** — Unordered lists
- **OrderedList** — Numbered lists
- **ListItem** — List item nodes
- **ListKeymap** — Keyboard shortcuts for lists

### Media
- **Image** — Inline images
- **ImageBlock** — Full-featured image blocks with sizing/cropping
- **Youtube** — Embedded YouTube videos

### Interactive
- **Link** — Hyperlinks with auto-detection
- **Details** — Collapsible content sections
- **Table** — Tables with rows, cells, and headers
- **TableOfContents** — Auto-generated table of contents

### Special content
- **Mathematics** — LaTeX/KaTeX math expressions
- **Markdown** — Markdown parsing and serialization

### Editor behaviors
- **UndoRedo** — Undo and redo functionality
- **Dropcursor** — Visual cursor for drag-and-drop
- **Gapcursor** — Cursor for empty spaces
- **HardBreak** — Line breaks
- **TrailingNode** — Ensures editor always has a final node
- **SelectWithinSlide** — Keyboard selection scoped to slides
- **FileHandler** — Drag-and-drop and paste file handling
- **Typography** — Smart quotes, dashes, and typography rules
- **NodeRange** — Node range selection
- **UniqueID** — Automatic unique ID generation
- **BlockAttributes** — Common attributes for all blocks (padding, gap, colors, etc.)

### UI extensions
- **Placeholder** — Placeholder text in empty blocks
- **BubbleMenu** — Context menu that appears on selection
- **FloatingMenu** — Menu that appears in empty lines
- **AddSlideButton** — Button to add new slides with preset templates

## Using the ExtensionKit

The ExtensionKit is the easiest way to get started. It includes all extensions with sensible defaults:

```ts
import { ExtensionKit } from '@blockslides/extension-kit';

// Use all defaults
const extensions = [ExtensionKit.configure({})];
```

::: warning Note
The ExtensionKit includes **all** extensions in your bundle, even if you disable them with `false`. This is convenient but heavier than importing individual extensions. If bundle size is a concern, you should import and compose only the extensions you need instead of using ExtensionKit.
:::

### Disabling extensions

Set any extension to `false` to exclude it:

```ts
const extensions = [
  ExtensionKit.configure({
    codeBlock: false,
    mathematics: false,
    youtube: false,
  })
];
```

### Customizing extensions

Pass options to customize extension behavior:

```ts
const extensions = [
  ExtensionKit.configure({
    heading: { 
      levels: [1, 2, 3] // Only allow H1, H2, H3
    },
    link: { 
      openOnClick: false,
      linkOnPaste: true 
    },
    placeholder: {
      placeholder: 'Start typing...'
    },
    slide: {
      renderMode: 'fixed',
      hoverOutline: { color: '#3b82f6' }
    }
  })
];
```

### Using individual extensions

You can also import and use extensions individually instead of using the kit:

```ts
import { Heading } from '@blockslides/extension-heading';
import { Paragraph } from '@blockslides/extension-paragraph';
import { Bold } from '@blockslides/extension-bold';

const extensions = [
  Document,
  Text,
  Paragraph.configure({ HTMLAttributes: { class: 'custom-paragraph' } }),
  Heading.configure({ levels: [1, 2, 3] }),
  Bold.configure({})
];
```

This gives you complete control but requires more manual setup.

## Extension capabilities

Extensions can provide several types of functionality:

### 1. Commands
Extensions add commands you can call on the editor:

```ts
// Commands from various extensions
editor.commands.setHeading({ level: 1 });
editor.commands.toggleBold();
editor.commands.setLink({ href: 'https://example.com' });
editor.commands.insertImageBlock({ src: 'image.jpg' });
```

### 2. Keyboard shortcuts
Extensions register keyboard shortcuts:

```ts
// Examples of built-in shortcuts
Mod-B          // Toggle bold
Mod-I          // Toggle italic
Mod-Z          // Undo
Mod-Shift-Z    // Redo
Mod-Alt-1      // Set heading level 1
```

### 3. Input rules
Extensions can respond to typed patterns (markdown-style):

```ts
// Type these patterns and hit space
**bold text**  // Becomes bold
*italic*       // Becomes italic
# heading      // Becomes H1
---            // Becomes horizontal rule
```

### 4. Paste rules
Extensions can handle pasted content:

```ts
// Paste a URL → automatically creates a link
// Paste an image → inserts image block
// Paste markdown → converts to blocks
```

### 5. Attributes
Extensions can add configurable attributes to nodes:

```ts
{
  type: "heading",
  attrs: { 
    level: 2,
    align: 'center',
    padding: 'lg'
  }
}
```

## Creating custom extensions

Want to add your own functionality? You can extend any existing extension or create entirely new ones.

Check out the [Custom Extensions guide](/features/customization/creating-extensions) to learn how to build custom extensions.
<br/>