# Custom Blocks & Marks

BlockSlides allows you to extend the editor with **custom blocks and marks**. Blocks are structural elements like paragraphs or headings, while marks are inline formatting like bold or italic. Creating custom extensions lets you add domain-specific content types tailored to your presentation needs.

::: tip Blocks vs Marks
**Blocks** are nodes that define structure (paragraphs, headings, custom cards). **Marks** are inline formatting applied to text (bold, italic, custom highlights). Learn more in [What are blocks?](/foundations/what-are-blocks)
:::

## Creating Custom Blocks

Custom blocks extend the `Node` type from `@blockslides/core`. They define structural elements that can contain content.

### Basic Block Structure

A minimal custom block includes a name, group, content model, and rendering logic:

```ts
import { Node, mergeAttributes } from '@blockslides/core'

export const CustomBlock = Node.create({
  name: 'customBlock',
  
  group: 'block',
  
  content: 'inline*',
  
  parseHTML() {
    return [{ tag: 'div[data-type="custom"]' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ 'data-type': 'custom' }, HTMLAttributes),
      0
    ]
  }
})
```

**Key properties:**

- **name** - Unique identifier for this block type
- **group** - Typically `'block'` for block-level elements
- **content** - Content expression defining what can go inside (e.g., `'inline*'`, `'block+'`, `'paragraph+'`)
- **parseHTML** - Rules for parsing HTML into this block
- **renderHTML** - How to render this block as HTML/DOM

### Adding Attributes

Blocks can have attributes to store configuration and state:

```ts
export const CalloutBlock = Node.create({
  name: 'callout',
  
  group: 'block',
  
  content: 'block+',
  
  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-callout-type'),
        renderHTML: attributes => {
          return { 'data-callout-type': attributes.type }
        }
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('data-title')
      }
    }
  },
  
  parseHTML() {
    return [{ tag: 'div.callout' }]
  },
  
  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { class: 'callout' },
        HTMLAttributes
      ),
      node.attrs.title ? ['div', { class: 'callout-title' }, node.attrs.title] : null,
      ['div', { class: 'callout-content' }, 0]
    ].filter(Boolean)
  }
})
```

**Attribute configuration:**

- **default** - Default value when attribute is not specified
- **parseHTML** - Extract attribute value from HTML element
- **renderHTML** - Add attribute to rendered HTML
- **rendered** - Set to `false` to exclude from HTML output (only in document model)

### Adding Commands

Commands provide programmatic control over your block:

```ts
declare module '@blockslides/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes?: { type?: string; title?: string }) => ReturnType
      toggleCallout: () => ReturnType
      updateCallout: (attributes: { type?: string; title?: string }) => ReturnType
    }
  }
}

export const CalloutBlock = Node.create({
  name: 'callout',
  
  // ... other configuration ...
  
  addCommands() {
    return {
      setCallout:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes)
        },
      toggleCallout:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph')
        },
      updateCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes)
        }
    }
  }
})
```

Commands are called via `editor.commands.setCallout()` and provide chainable operations on the editor state.

### Keyboard Shortcuts

Add keyboard shortcuts for quick access:

```ts
export const CalloutBlock = Node.create({
  name: 'callout',
  
  // ... other configuration ...
  
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-i': () => this.editor.commands.toggleCallout(),
      'Escape': () => {
        // Custom behavior when inside a callout
        if (this.editor.isActive('callout')) {
          return this.editor.commands.lift('callout')
        }
        return false
      }
    }
  }
})
```

### Input Rules

Input rules enable markdown-like shortcuts:

```ts
import { Node, wrappingInputRule } from '@blockslides/core'

export const CalloutBlock = Node.create({
  name: 'callout',
  
  // ... other configuration ...
  
  addInputRules() {
    return [
      wrappingInputRule({
        find: /^:::\s$/,
        type: this.type,
        getAttributes: () => ({ type: 'info' })
      })
    ]
  }
})
```

This allows users to type `:::` followed by space to create a callout block.

### Configuration Options

Make your block configurable:

```ts
export interface CalloutOptions {
  types: string[]
  HTMLAttributes: Record<string, any>
  defaultType: string
}

export const CalloutBlock = Node.create<CalloutOptions>({
  name: 'callout',
  
  addOptions() {
    return {
      types: ['info', 'warning', 'error', 'success'],
      HTMLAttributes: {},
      defaultType: 'info'
    }
  },
  
  addAttributes() {
    return {
      type: {
        default: this.options.defaultType,
        parseHTML: element => {
          const type = element.getAttribute('data-callout-type')
          return this.options.types.includes(type) ? type : this.options.defaultType
        }
      }
    }
  }
})
```

Configure when instantiating:

```ts
import { CalloutBlock } from './callout'

const editor = useSlideEditor({
  extensions: [
    CalloutBlock.configure({
      types: ['tip', 'warning'],
      defaultType: 'tip'
    })
  ]
})
```

### Advanced: Drag and Drop

Make blocks draggable:

```ts
export const CustomCard = Node.create({
  name: 'customCard',
  
  group: 'block',
  
  content: 'block+',
  
  draggable: true,  // Enable drag and drop
  
  selectable: true,  // Make it selectable
  
  atom: true,  // Treat as a single unit (no editing inside)
  
  // ... rest of configuration ...
})
```

### Advanced: CSS Injection

Inject styles for your custom block:

```ts
import { Node, createStyleTag } from '@blockslides/core'
import { Plugin, PluginKey } from '@blockslides/pm/state'

const CustomBlockPluginKey = new PluginKey('customBlock')

const styles = `
  .custom-block {
    border: 2px solid #4a90e2;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
  }
  
  .custom-block[data-variant="danger"] {
    border-color: #e74c3c;
  }
`

export interface CustomBlockOptions {
  HTMLAttributes: Record<string, any>
  injectCSS: boolean
  injectNonce?: string
}

export const CustomBlock = Node.create<CustomBlockOptions>({
  name: 'customBlock',
  
  addOptions() {
    return {
      HTMLAttributes: {},
      injectCSS: true,
      injectNonce: undefined
    }
  },
  
  // ... other configuration ...
  
  addProseMirrorPlugins() {
    if (!this.options.injectCSS || typeof document === 'undefined') {
      return []
    }
    
    return [
      new Plugin({
        key: CustomBlockPluginKey,
        state: {
          init: () => {
            createStyleTag(styles, this.options.injectNonce, 'custom-block-styles')
            return {}
          },
          apply: (_tr, pluginState) => pluginState
        }
      })
    ]
  }
})
```

## Creating Custom Marks

Custom marks extend the `Mark` type from `@blockslides/core`. They apply inline formatting to text.

### Basic Mark Structure

A minimal custom mark:

```ts
import { Mark, mergeAttributes } from '@blockslides/core'

export const Highlight = Mark.create({
  name: 'highlight',
  
  parseHTML() {
    return [{ tag: 'mark' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes), 0]
  }
})
```

### Adding Mark Attributes

Marks can have attributes for customization:

```ts
export const Highlight = Mark.create({
  name: 'highlight',
  
  addAttributes() {
    return {
      color: {
        default: 'yellow',
        parseHTML: element => element.getAttribute('data-color'),
        renderHTML: attributes => {
          if (!attributes.color) return {}
          return {
            'data-color': attributes.color,
            style: `background-color: ${attributes.color}`
          }
        }
      }
    }
  },
  
  parseHTML() {
    return [
      { tag: 'mark' },
      {
        style: 'background-color',
        getAttrs: value => {
          return { color: value }
        }
      }
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes), 0]
  }
})
```

### Mark Commands

Add commands to control your mark:

```ts
declare module '@blockslides/core' {
  interface Commands<ReturnType> {
    highlight: {
      setHighlight: (attributes?: { color?: string }) => ReturnType
      toggleHighlight: (attributes?: { color?: string }) => ReturnType
      unsetHighlight: () => ReturnType
    }
  }
}

export const Highlight = Mark.create({
  name: 'highlight',
  
  // ... other configuration ...
  
  addCommands() {
    return {
      setHighlight:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes)
        },
      toggleHighlight:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes)
        },
      unsetHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        }
    }
  }
})
```

### Mark Input Rules

Enable markdown-style shortcuts for marks:

```ts
import { Mark, markInputRule } from '@blockslides/core'

// Match ==highlighted text==
export const inputRegex = /(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))$/

export const Highlight = Mark.create({
  name: 'highlight',
  
  // ... other configuration ...
  
  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type
      })
    ]
  }
})
```

### Mark Paste Rules

Handle pasted content:

```ts
import { Mark, markPasteRule } from '@blockslides/core'

// Match ==highlighted text== when pasting
export const pasteRegex = /(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))/g

export const Highlight = Mark.create({
  name: 'highlight',
  
  // ... other configuration ...
  
  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type
      })
    ]
  }
})
```

### Mark Behavior Options

Control mark behavior with these options:

```ts
export const Highlight = Mark.create({
  name: 'highlight',
  
  // Keep mark when splitting a node (e.g., pressing Enter)
  keepOnSplit: true,
  
  // Whether this mark is inclusive at the boundaries
  // If true, typing at the edge extends the mark
  inclusive() {
    return true
  },
  
  // Marks that this mark excludes (can't coexist with)
  excludes() {
    return 'code'  // Can't highlight code marks
  },
  
  // ... other configuration ...
})
```

### Mark Keyboard Shortcuts

```ts
export const Highlight = Mark.create({
  name: 'highlight',
  
  // ... other configuration ...
  
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-h': () => this.editor.commands.toggleHighlight(),
      'Mod-Shift-H': () => this.editor.commands.toggleHighlight({ color: 'red' })
    }
  }
})
```

### Configuration Options

```ts
export interface HighlightOptions {
  colors: string[]
  defaultColor: string
  HTMLAttributes: Record<string, any>
}

export const Highlight = Mark.create<HighlightOptions>({
  name: 'highlight',
  
  addOptions() {
    return {
      colors: ['yellow', 'green', 'blue', 'red'],
      defaultColor: 'yellow',
      HTMLAttributes: {}
    }
  },
  
  addAttributes() {
    return {
      color: {
        default: this.options.defaultColor,
        parseHTML: element => {
          const color = element.getAttribute('data-color')
          return this.options.colors.includes(color) ? color : this.options.defaultColor
        }
      }
    }
  }
})
```

## Using Custom Extensions

Once created, use your custom extensions like any built-in extension:

```ts
import { useSlideEditor } from '@blockslides/react'
import { ExtensionKit } from '@blockslides/extension-kit'
import { CalloutBlock } from './extensions/callout'
import { Highlight } from './extensions/highlight'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit,
    CalloutBlock.configure({
      types: ['info', 'warning', 'success'],
      defaultType: 'info'
    }),
    Highlight.configure({
      colors: ['yellow', 'pink', 'blue'],
      defaultColor: 'yellow'
    })
  ]
})

// Use commands
editor.commands.setCallout({ type: 'warning', title: 'Important' })
editor.commands.toggleHighlight({ color: 'pink' })
```

## Checking Active State

Query whether custom blocks or marks are active:

```ts
// Check if custom block is active
const isCallout = editor.isActive('callout')
const isWarningCallout = editor.isActive('callout', { type: 'warning' })

// Check if custom mark is active
const isHighlighted = editor.isActive('highlight')
const isPinkHighlight = editor.isActive('highlight', { color: 'pink' })

// Get attributes of active node
const calloutAttrs = editor.getAttributes('callout')
// => { type: 'warning', title: 'Important' }
```

## Content Expressions

Control what content blocks can contain:

```ts
// Allow only inline content (text and marks)
content: 'inline*'

// Require at least one block
content: 'block+'

// Allow zero or more blocks
content: 'block*'

// Specific node types
content: 'paragraph+'

// Multiple types
content: '(paragraph | heading)+'

// Complex expressions
content: 'heading paragraph block*'
```

**Common patterns:**

- `inline*` - Text blocks (paragraphs, headings)
- `block+` - Container blocks (slides, columns, callouts)
- `paragraph+` - Lists (bullet list, ordered list)
- Empty (no content property) - Leaf nodes (images, horizontal rules)

## Extension Priority

Control extension loading order:

```ts
export const CustomBlock = Node.create({
  name: 'customBlock',
  
  // Higher priority loads first (default: 100)
  priority: 1000,
  
  // ... rest of configuration ...
})
```

Priority affects:
- Which extension's keyboard shortcuts take precedence
- Input rule matching order
- Command execution order

## TypeScript Types

Export types for better developer experience:

```ts
export interface CalloutAttributes {
  type: 'info' | 'warning' | 'error' | 'success'
  title?: string | null
}

export interface CalloutOptions {
  types: string[]
  HTMLAttributes: Record<string, any>
  defaultType: string
}

export const CalloutBlock = Node.create<CalloutOptions>({
  name: 'callout',
  // ... configuration ...
})

// Usage with type safety
editor.commands.setCallout({ 
  type: 'warning',  // ✓ Type-checked
  title: 'Alert'
})
```

## Best Practices

### Naming Conventions

- Use camelCase for extension names: `customBlock`, `highlightMark`
- Prefix related extensions: `customCard`, `customCardHeader`, `customCardFooter`
- Match command names to extension functionality: `setCallout`, `toggleHighlight`

### HTML Attributes

- Use `data-` attributes for custom metadata
- Use `mergeAttributes()` to combine option attributes with runtime attributes
- Add semantic class names for CSS styling

### Performance

- Set `atom: true` for blocks that should be treated as a single unit
- Use `defining: true` for blocks that define document structure (prevents unwrapping)
- Avoid expensive computations in `renderHTML` (runs frequently)

### Validation

- Validate attributes in `addAttributes().parseHTML()`
- Provide sensible defaults for all attributes
- Use TypeScript for compile-time type safety

### Documentation

- Add JSDoc comments to commands for editor autocompletion
- Document keyboard shortcuts in your README
- Provide usage examples for complex configurations
