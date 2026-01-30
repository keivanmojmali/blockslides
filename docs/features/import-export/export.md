# Export

Blockslides supports exporting content to **four formats**: JSON, HTML, plain text, and Markdown. JSON and HTML work with the base editor, while Markdown requires the Markdown extension. Plain text export is useful for search indexing and content previews.

All export formats derive from the internal JSON representation, ensuring consistent data across different output types.

## Exporting JSON

JSON is the native format used internally by Blockslides. Exporting to JSON is the most efficient method and preserves all document structure, attributes, and marks without any loss.

### From the Editor

Export the current document as JSON:

```ts
const json = editor.getJSON()
```

This returns the complete document structure including all nodes, marks, and attributes.

### Between Editors

Transfer content between editor instances:

```ts
const sourceJson = sourceEditor.getJSON()
targetEditor.commands.setContent(sourceJson)
```

This preserves the exact document state without any conversion overhead.

### Use Cases

JSON export is ideal for:

- **Persistence** - Store the document in its native format
- **Editor transfer** - Move content between editor instances
- **Version control** - Track document changes over time
- **Collaboration** - Synchronize state across clients
- **Transformation** - Process content programmatically before importing elsewhere

## Exporting HTML

HTML export converts the document to standard HTML markup using each extension's `renderHTML` method. This is useful for rendering content outside the editor or integrating with other systems.

### From the Editor

Export the current document as HTML:

```ts
const html = editor.getHTML()
```

The output is a string of HTML that represents your document structure.

### Standalone Conversion

Convert JSON to HTML without an editor instance using the `generateHTML` helper:

#### Browser Environment

```ts
import { generateHTML } from '@blockslides/html'

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

const html = generateHTML(json, extensions)
```

#### Server Environment

When running in Node.js, use the server import:

```ts
import { generateHTML } from '@blockslides/html/server'

const html = generateHTML(json, extensions)
```

This uses happy-dom instead of the browser's native DOM implementation.

::: warning Server-side requirement
The server version requires `happy-dom` to be installed in your project.
:::

### Use Cases

HTML export is ideal for:

- **Static rendering** - Generate HTML for SSR or static site generation
- **Email content** - Export presentations for email distribution
- **Documentation** - Convert slides to web documentation
- **Archiving** - Create static HTML snapshots
- **Preview generation** - Create read-only previews

## Exporting Plain Text

Plain text export strips all formatting and extracts raw text content. Each extension can define how its content should be serialized to text through the `textSerializer` configuration.

### From the Editor

Export the current document as plain text:

```ts
const text = editor.getText()
```

By default, block-level elements are separated by two newlines (`\n\n`).

### Custom Block Separator

Control how blocks are separated:

```ts
// Single newline between blocks
const text = editor.getText({
  blockSeparator: '\n'
})

// Custom separator
const text = editor.getText({
  blockSeparator: '\n---\n'
})
```

### Custom Text Serializers

Define how specific node types should be converted to text:

```ts
const text = editor.getText({
  blockSeparator: '\n\n',
  textSerializers: {
    heading: ({ node }) => {
      // Add markdown-style heading prefix
      const prefix = '#'.repeat(node.attrs.level)
      return `${prefix} ${node.textContent}`
    },
    codeBlock: ({ node }) => {
      // Wrap code blocks
      return `\`\`\`\n${node.textContent}\n\`\`\``
    }
  }
})
```

The serializer receives an object with:
- **node** - The ProseMirror node being serialized
- **pos** - The position of the node in the document
- **parent** - The parent node
- **index** - The index within the parent

### Standalone Conversion

Convert JSON to plain text without an editor instance:

```ts
import { generateText } from '@blockslides/core'

const text = generateText(json, extensions, {
  blockSeparator: '\n\n',
  textSerializers: {
    // Custom serializers
  }
})
```

### Use Cases

Plain text export is ideal for:

- **Search indexing** - Extract searchable content
- **Content previews** - Generate text-only summaries
- **Character counting** - Measure content length
- **Clipboard operations** - Copy text without formatting
- **Accessibility** - Provide screen-reader friendly content

## Exporting Markdown

Markdown export converts the document to human-readable markdown syntax. This requires the Markdown extension and uses each extension's `renderMarkdown` method to generate the output.

### From the Editor

Export the current document as markdown:

```ts
import { Markdown } from '@blockslides/markdown'

const editor = useSlideEditor({
  extensions: [Markdown],
  content: initialContent
})

const markdown = editor.getMarkdown()
```

### Using the Markdown Manager

Access the markdown manager directly for more control:

```ts
const json = editor.getJSON()
const markdown = editor.markdown.serialize(json)
```

This approach is useful when you need to convert JSON to markdown without changing the editor content.

### Standalone Conversion

Convert JSON to markdown without an editor instance:

```ts
import { MarkdownManager } from '@blockslides/markdown'

const manager = new MarkdownManager({
  extensions: extensions
})

const markdown = manager.serialize(json)
```

### Configuration

Configure indentation style for nested content:

```ts
import { Markdown } from '@blockslides/markdown'

Markdown.configure({
  indentation: {
    style: 'space',  // or 'tab'
    size: 2
  }
})
```

**Indentation options:**

- **style** (`'space' | 'tab'`, default: `'space'`) - Character used for indentation
- **size** (`number`, default: `2`) - Number of characters per indentation level

This affects how nested lists, blockquotes, and other indented content are formatted in the markdown output.

### Use Cases

Markdown export is ideal for:

- **Documentation** - Export to markdown for documentation systems
- **Version control** - Store content in git-friendly format
- **Publishing** - Export to markdown-based publishing platforms
- **Editing** - Allow external markdown editing
- **Portability** - Share content in a widely-supported format

## Export Strategies

### Choosing the Right Format

Select the export format based on your requirements:

| Format | Use When |
|--------|----------|
| **JSON** | Preserving complete document state, transferring between editors, or storing for later editing |
| **HTML** | Rendering outside the editor, generating static content, or integrating with HTML-based systems |
| **Text** | Extracting searchable content, generating previews, or removing all formatting |
| **Markdown** | Creating human-readable content, version control, or cross-platform portability |

### Efficient Bulk Exports

When exporting multiple formats, export JSON first and convert:

```ts
// Export JSON once
const json = editor.getJSON()

// Convert to other formats as needed
const html = generateHTML(json, extensions)
const text = generateText(json, extensions)
const markdown = markdownManager.serialize(json)
```

This is more efficient than calling multiple editor export methods.

### Partial Content Export

Export specific slides or sections by extracting from JSON:

```ts
const json = editor.getJSON()

// Export a specific slide
const slideJson = {
  type: 'doc',
  content: [json.content[2]] // Third slide
}

const html = generateHTML(slideJson, extensions)
```

### Format Detection

When importing exported content later, the format is automatically detected:

```ts
// Export as HTML
const html = editor.getHTML()

// Later, import automatically detects HTML
editor.commands.setContent(html)
```

See [Import](/features/import-export/import) for details on content detection and import strategies.
