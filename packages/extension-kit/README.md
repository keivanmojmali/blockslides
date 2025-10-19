# @autoartifacts/extension-kit

A comprehensive bundle of all available AutoArtifacts extensions. The ExtensionKit makes it easy to configure your editor with all the extensions you need in one place.

## Installation

```bash
npm install @autoartifacts/extension-kit
```

## Usage

### Basic Usage

Import the ExtensionKit and use it with your editor:

```typescript
import { useSlideEditor } from '@autoartifacts/react'
import { ExtensionKit } from '@autoartifacts/extension-kit'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit
  ]
})
```

This will include all extensions with their default configurations.

### Exclude Extensions

Set any extension to `false` to exclude it:

```typescript
const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      document: false,
      heading: false,
      blockquote: false,
    })
  ]
})
```

### Configure Extensions

Pass an object with options to configure an extension:

```typescript
const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      heading: {
        levels: [1, 2, 3], // Only allow h1, h2, h3
      },
      link: {
        openOnClick: false,
        linkOnPaste: true,
      },
      placeholder: {
        placeholder: 'Start typing your presentation...',
      },
      codeBlockLowlight: {
        lowlight: lowlight,
        defaultLanguage: 'javascript',
      },
    })
  ]
})
```

### Mix of Configuration Styles

You can mix excluded extensions with configured ones:

```typescript
const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      // Exclude these
      document: false,
      dropcursor: false,
      
      // Configure these
      heading: { levels: [2, 3] },
      image: { inline: true, allowBase64: true },
      
      // Include with defaults (implicit)
      bold: {},
      italic: {},
    })
  ]
})
```

## Configuration Behavior

- **Not included** (undefined): Extension is included with default options
- **Set to `false`**: Extension is excluded
- **Set to object**: Extension is included with custom configuration

## Available Extensions

### Text Formatting
- `bold` - Bold text
- `italic` - Italic text
- `underline` - Underlined text
- `strike` - Strike-through text
- `code` - Inline code
- `subscript` - Subscript text
- `superscript` - Superscript text

### Text Styling
- `textStyle` - Custom text styling
- `color` - Text color
- `fontFamily` - Font family
- `highlight` - Text highlighting
- `textAlign` - Text alignment

### Block Elements
- `paragraph` - Paragraphs
- `heading` - Headings (h1-h6)
- `blockquote` - Blockquotes
- `codeBlock` - Code blocks
- `codeBlockLowlight` - Code blocks with syntax highlighting
- `horizontalRule` - Horizontal rules

### Lists
- `bulletList` - Bullet lists
- `orderedList` - Ordered lists
- `listItem` - List items
- `listKeymap` - List keyboard shortcuts

### Media
- `image` - Images
- `youtube` - YouTube embeds

### Interactive
- `link` - Hyperlinks
- `details` - Collapsible details/summary

### Tables
- `table` - Tables
- `tableOfContents` - Table of contents

### Special Content
- `emoji` - Emoji support
- `mathematics` - LaTeX/KaTeX math

### Editor Behavior
- `document` - Root document node
- `text` - Text node
- `hardBreak` - Hard line breaks
- `dropcursor` - Drop cursor indicator
- `gapcursor` - Gap cursor
- `undoRedo` - Undo/redo functionality
- `trailingNode` - Trailing node

### UI
- `placeholder` - Placeholder text
- `invisibleCharacters` - Show invisible characters
- `bubbleMenu` - Bubble menu
- `floatingMenu` - Floating menu

### Utilities
- `fileHandler` - File drag & drop, paste handling
- `nodeRange` - Node range utilities
- `typography` - Smart typography (quotes, dashes)
- `uniqueId` - Unique node IDs

### Slide-Specific
- `slide` - Slide nodes
- `addSlideButton` - Add slide button

## TypeScript Support

The ExtensionKit is fully typed and provides autocomplete for all extension options:

```typescript
import type { ExtensionKitOptions } from '@autoartifacts/extension-kit'

const config: Partial<ExtensionKitOptions> = {
  heading: {
    levels: [1, 2, 3], // TypeScript will validate this
  },
}
```

## License

MIT
