# Extension Kit Overview

The **ExtensionKit** is a comprehensive bundle that includes all available Blockslides extensions with configurable options. It provides the fastest way to get a fully-featured editor up and running without manually importing and configuring dozens of individual extensions.

::: tip When to use ExtensionKit
Use ExtensionKit when you want most or all available features and prefer convenience over bundle size optimization. If you only need specific extensions, import them individually instead to reduce your bundle size.
:::

## What's Included

ExtensionKit bundles **every extension** available in Blockslides:

- **Core** — Document, Text, Slide, Column, ColumnGroup
- **Text formatting** — Bold, Italic, Underline, Strike, Code, Subscript, Superscript, Highlight, Color, BackgroundColor, FontFamily, FontSize, LineHeight, TextAlign, TextStyle
- **Blocks** — Paragraph, Heading, Blockquote, CodeBlock, HorizontalRule
- **Lists** — BulletList, OrderedList, ListItem, ListKeymap
- **Media** — Image, ImageBlock, Youtube
- **Interactive** — Link, Details, Table (with TableRow, TableHeader, TableCell), TableOfContents
- **Special content** — Mathematics, Markdown
- **Editor behaviors** — UndoRedo, Dropcursor, Gapcursor, HardBreak, TrailingNode, SelectWithinSlide, FileHandler, Typography, NodeRange, UniqueID, BlockAttributes
- **UI** — Placeholder, BubbleMenu, FloatingMenu, AddSlideButton

## Installation

Install the ExtensionKit package:

```bash
npm install @blockslides/extension-kit
```

Then import and configure it in your editor:

```ts
import { ExtensionKit } from '@blockslides/extension-kit'
import { useEditor } from '@blockslides/react'

const editor = useEditor({
  extensions: [
    ExtensionKit.configure({})
  ]
})
```

This single import gives you access to all extensions with their default configurations.

::: tip Using useSlideEditor in React
If you're using the `useSlideEditor` hook in React, ExtensionKit is automatically included for you. Configure it using the `extensionKitOptions` prop instead:

```ts
const { editor } = useSlideEditor({
  extensionKitOptions: {
    mathematics: false,
    youtube: false
  }
})
```
:::

## Basic Usage

### Using all defaults

The simplest configuration includes everything with defaults:

```ts
const editor = useEditor({
  extensions: [
    ExtensionKit.configure({})
  ]
})
```

This gives you a fully-featured editor with text formatting, media embeds, tables, math support, keyboard shortcuts, drag-and-drop, and more. All working out of the box.

### Customizing extensions

Pass configuration options to customize individual extensions:

```ts
ExtensionKit.configure({
  heading: {
    levels: [1, 2, 3]  // Only H1-H3
  },
  link: {
    openOnClick: false,
    linkOnPaste: true
  },
  placeholder: {
    placeholder: 'Start typing your slide content...'
  },
  codeBlock: {
    defaultLanguage: 'typescript'
  }
})
```

Each extension accepts its specific configuration options. Check individual extension documentation for available options.

### Disabling extensions

Set any extension to `false` to exclude it from your editor:

```ts
ExtensionKit.configure({
  // Disable features you don't need
  mathematics: false,
  youtube: false,
  codeBlock: false,
  table: false,
  details: false
})
```

::: warning Bundle size consideration
Disabled extensions are still included in your JavaScript bundle. They're just not registered with the editor. For smaller bundles, import only the extensions you need instead of using ExtensionKit.
:::

## Document Type Selection

ExtensionKit supports two top-level document structures via the `topLevelDoc` option:

```ts
ExtensionKit.configure({
  // Slideshow document (default)
  topLevelDoc: 'slide'
})
```

```ts
ExtensionKit.configure({
  // Asset document
  topLevelDoc: 'asset'
})
```

**Document types:**

- **slide** (default) — The standard slideshow document where content is organized into individual slides. This is what you'll use for presentations.
- **asset** — A simpler document structure for non-slideshow use cases like rich text editing or content blocks.

## Configuration Examples

### Minimal text editor

Disable advanced features to create a simple text editor:

```ts
ExtensionKit.configure({
  // Disable slide-specific features
  addSlideButton: false,
  selectWithinSlide: false,
  
  // Disable media
  image: false,
  imageBlock: false,
  youtube: false,
  
  // Disable advanced content
  mathematics: false,
  table: false,
  codeBlock: false,
  details: false,
  
  // Keep basic formatting
  heading: { levels: [1, 2, 3] },
  bold: {},
  italic: {},
  underline: {},
  link: {}
})
```

### Presentation-focused editor

Optimize for slide presentations:

```ts
ExtensionKit.configure({
  // Slide configuration
  slide: {
    renderMode: 'fixed',
    hoverOutline: { color: '#3b82f6' }
  },
  
  // Rich media
  imageBlock: {},
  youtube: {
    nocookie: true,
    modestBranding: true
  },
  
  // Disable code features
  code: false,
  codeBlock: false,
  
  // Enable presenter aids
  tableOfContents: {},
  placeholder: {
    placeholder: 'Add slide content...'
  }
})
```

### Developer documentation editor

Configure for technical content:

```ts
ExtensionKit.configure({
  // Code support
  code: {},
  codeBlock: {
    defaultLanguage: 'typescript'
  },
  
  // Math and tables
  mathematics: {},
  table: {
    resizable: true,
    cellMinWidth: 50
  },
  
  // Technical formatting
  subscript: {},
  superscript: {},
  
  // Content organization
  heading: { levels: [1, 2, 3, 4] },
  bulletList: {},
  orderedList: {},
  blockquote: {},
  horizontalRule: {}
})
```

## ExtensionKit vs Individual Extensions

### Use ExtensionKit when:

- You want most or all available features
- You're prototyping or building an internal tool
- Development speed is more important than bundle size
- You don't want to manually manage extension dependencies

### Use individual extensions when:

- Bundle size is a critical concern
- You only need a specific subset of features
- You're building a public-facing application
- You want explicit control over what's included

### Example: Individual extension setup

```ts
import { useEditor } from '@blockslides/react'
import { Document } from '@blockslides/extension-document'
import { Text } from '@blockslides/extension-text'
import { Paragraph } from '@blockslides/extension-paragraph'
import { Heading } from '@blockslides/extension-heading'
import { Bold } from '@blockslides/extension-bold'
import { Italic } from '@blockslides/extension-italic'
import { Link } from '@blockslides/extension-link'
import { BulletList, OrderedList, ListItem, ListKeymap } from '@blockslides/extension-list'
import { UndoRedo } from '@blockslides/extensions'

const editor = useEditor({
  extensions: [
    Document,
    Text,
    Paragraph,
    Heading.configure({ levels: [1, 2, 3] }),
    Bold,
    Italic,
    Link,
    BulletList,
    OrderedList,
    ListItem,
    ListKeymap,
    UndoRedo
  ]
})
```

This approach gives you a smaller bundle that includes only what you explicitly import.

## Common Configuration Patterns

### Restricting text formatting

Limit formatting options to specific marks:

```ts
ExtensionKit.configure({
  // Keep only basic formatting
  bold: {},
  italic: {},
  underline: {},
  
  // Disable advanced styling
  color: false,
  backgroundColor: false,
  fontFamily: false,
  fontSize: false,
  highlight: false,
  subscript: false,
  superscript: false
})
```

### Customizing file handling

Configure drag-and-drop and paste behavior:

```ts
ExtensionKit.configure({
  fileHandler: {
    onDrop: (editor, files, pos) => {
      // Handle file drops
      files.forEach(file => {
        // Upload and insert logic
      })
    },
    onPaste: (editor, files, htmlContent) => {
      // Handle file pastes
    },
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }
})
```

### Configuring keyboard behavior

Customize undo/redo and other keyboard-driven features:

```ts
ExtensionKit.configure({
  undoRedo: {
    depth: 100,  // Maximum undo steps
    newGroupDelay: 500  // Milliseconds before new undo group
  },
  typography: {
    // Enable smart typography
    emDash: true,
    ellipsis: true,
    openDoubleQuote: true,
    closeDoubleQuote: true
  }
})
```

### Block-level attributes

The BlockAttributes extension adds common styling attributes to all block types:

```ts
ExtensionKit.configure({
  blockAttributes: {
    types: ['heading', 'paragraph', 'blockquote'],
    // Enables align, padding, gap, backgroundColor, 
    // borderRadius, fill attributes on specified blocks
  }
})
```

## Working with ExtensionKit Programmatically

### Checking active extensions

Determine which extensions are active in your editor:

```ts
const extensions = editor.extensionManager.extensions
const extensionNames = extensions.map(ext => ext.name)

console.log('Active extensions:', extensionNames)
```

### Checking if specific features are available

```ts
// Check if an extension is registered
const hasImageBlock = editor.extensionManager.extensions.some(
  ext => ext.name === 'imageBlock'
)

// Check if a command is available
const canInsertImage = editor.can().insertImageBlock({ src: 'test.jpg' })
```

## Migration from StarterKit

If you're currently using StarterKit and want to upgrade to ExtensionKit:

```ts
// Before: StarterKit
import { StarterKit } from '@blockslides/starter-kit'

const editor = useEditor({
  extensions: [
    StarterKit.configure({}),
    // ... additional extensions
  ]
})

// After: ExtensionKit
import { ExtensionKit } from '@blockslides/extension-kit'

const editor = useEditor({
  extensions: [
    ExtensionKit.configure({})
    // No need for additional extensions - ExtensionKit includes everything
  ]
})
```

ExtensionKit includes all StarterKit extensions plus many more. Your existing StarterKit configuration options will work with ExtensionKit.

## Tips & Best Practices

### Start with ExtensionKit, optimize later

Begin development with ExtensionKit to access all features. Once you know which features you actually use, you can optionally switch to individual imports for better bundle optimization.

### Disable unused features early

Even if using ExtensionKit, disable features you know you won't need. This prevents users from accidentally accessing unavailable functionality in your UI:

```ts
ExtensionKit.configure({
  mathematics: false,  // No math UI to build
  youtube: false,      // No video embed UI to build
  table: false         // No table UI to build
})
```

### Configuration is type-safe

ExtensionKit's configuration is fully typed. Your editor will autocomplete available options and catch configuration errors:

```ts
ExtensionKit.configure({
  heading: {
    levels: [1, 2, 3],
    // TypeScript will suggest valid options
  }
})
```

### Extension order matters internally

ExtensionKit handles extension registration order automatically. BlockAttributes is registered early so its attributes are available to other extensions. Core extensions like Document and Text are registered before content extensions.

When importing individual extensions, you need to manage this order yourself.
