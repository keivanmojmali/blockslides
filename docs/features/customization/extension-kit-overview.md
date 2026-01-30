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
