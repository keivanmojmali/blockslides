# Import

Blockslides supports importing content from **three formats**: Markdown, HTML, and JSON. All formats are converted to the internal JSON representation, making it easy to integrate content from various sources into your presentations.

The Markdown extension is required for markdown imports, but HTML and JSON work with the base editor.

## Importing Markdown

The Markdown extension provides multiple ways to import markdown content into the editor.

### At Initialization

Load markdown when creating the editor by specifying the `contentType` option:

```ts
import { useSlideEditor } from '@blockslides/react'
import { Markdown } from '@blockslides/markdown'

const editor = useSlideEditor({
  extensions: [Markdown],
  content: '# Welcome\n\nThis is a **slide** with markdown.',
  contentType: 'markdown'
})
```

### Using Commands

Import markdown content at any time using editor commands with the `contentType` option:

```ts
// Replace entire document
editor.commands.setContent(markdownString, { 
  contentType: 'markdown' 
})

// Insert at cursor position
editor.commands.insertContent(markdownString, { 
  contentType: 'markdown' 
})

// Insert at specific position
editor.commands.insertContentAt(100, markdownString, { 
  contentType: 'markdown' 
})
```

### Using the Markdown Manager

Parse markdown directly to JSON, then set it:

```ts
const markdown = `# My Slide

- First item
- Second item
- **Bold text**`

const json = editor.markdown.parse(markdown)
editor.commands.setContent(json)
```

This approach is useful when you need the JSON representation for validation or transformation before inserting.

### Configuration

Configure the Markdown extension to control parsing behavior:

```ts
import { Markdown } from '@blockslides/markdown'

Markdown.configure({
  // Control indentation style for nested content
  indentation: {
    style: 'space',  // or 'tab'
    size: 2
  },
  
  // Use a custom marked instance
  marked: customMarkedInstance,
  
  // Pass options to marked.setOptions()
  markedOptions: {
    gfm: true,
    breaks: false
  }
})
```

See [Markdown Support](/features/working-with-content/markdown-support) for exporting markdown and additional configuration details.

## Importing HTML

HTML content is automatically parsed using extension-defined `parseHTML` rules, ensuring custom extensions are correctly recognized.

### Browser Environment

Import HTML using the `generateJSON` helper:

```ts
import { generateJSON } from '@blockslides/html'

const htmlString = '<h1>Welcome</h1><p>Content here</p>'
const json = generateJSON(htmlString, extensions)
editor.commands.setContent(json)
```

### Server Environment

When running in a Node.js environment, use the server import:

```ts
import { generateJSON } from '@blockslides/html/server'

const json = generateJSON(htmlString, extensions)
```

This uses happy-dom instead of the browser's DOMParser.

### Automatic Detection

HTML is auto-detected when you pass a string to content commands without specifying `contentType`:

```ts
// HTML is automatically parsed
editor.commands.setContent('<p>Hello <strong>world</strong></p>')

editor.commands.insertContent('<h2>New Section</h2>')

editor.commands.insertContentAt(50, '<blockquote>Quote</blockquote>')
```

The editor determines whether the string is HTML or plain text based on its structure.

## Importing JSON

JSON is the native format used internally by Blockslides. Importing JSON is the most efficient method since no parsing is required.

### Direct Import

Import JSON objects directly:

```ts
const json = {
  type: 'doc',
  content: [
    {
      type: 'slide',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [
            { type: 'text', text: 'Welcome' }
          ]
        }
      ]
    }
  ]
}

editor.commands.setContent(json)
```

### Between Editors

Copy content between editor instances:

```ts
const sourceJson = sourceEditor.getJSON()
targetEditor.commands.setContent(sourceJson)
```

This preserves all attributes, marks, and structure without any conversion.

### With Content Validation

Enable strict validation when importing JSON:

```ts
editor.commands.setContent(json, {
  errorOnInvalidContent: true
})
```

If the JSON doesn't match the schema, this throws an error instead of silently dropping invalid nodes.

## File Upload Handling

For handling file uploads via drag-and-drop or paste events, Blockslides provides the FileHandler extension. This is covered in detail in [Media & Embeds](/features/working-with-content/media-embeds#file-handling), including:

- Configuring drop and paste handlers
- Filtering allowed MIME types
- Processing images and other files
- Integration with ExtensionKit

## Import Options

All import commands support additional options for fine-tuned control:

### Parse Options

Control how content is parsed:

```ts
editor.commands.setContent(content, {
  parseOptions: {
    preserveWhitespace: 'full'
  }
})
```

### Error Handling

Control validation behavior:

```ts
// Throw errors on invalid content
editor.commands.setContent(content, {
  errorOnInvalidContent: true
})

// Suppress update events during bulk imports
editor.commands.setContent(content, {
  emitUpdate: false
})
```

### Selection Management

Control cursor position after insertion:

```ts
editor.commands.insertContent(content, {
  updateSelection: true  // Move cursor to end of inserted content
})

editor.commands.insertContentAt(100, content, {
  updateSelection: false  // Keep current selection
})
```

## Import Strategies

### Bulk Content Migration

When replacing the entire document, use `setContent()` and suppress update events:

```ts
editor.commands.setContent(largeContent, {
  emitUpdate: false
})
```

Re-enable updates after migration is complete.

### Incremental Imports

For inserting content at specific locations without disrupting the document:

```ts
// At cursor
editor.commands.insertContent(partialContent)

// At specific position
editor.commands.insertContentAt(position, partialContent)
```

### Format Detection

When the source format is unknown, try JSON first, then fall back to HTML:

```ts
let content: any

try {
  content = JSON.parse(sourceString)
  editor.commands.setContent(content)
} catch {
  editor.commands.setContent(sourceString) // Auto-detects HTML
}
```