# Creating Custom Extensions

Extensions are **modular pieces of code that add functionality to Blockslides**. You can create custom extensions to add new block types, text formatting options, or editor behaviors tailored to your needs.

## Extension Types

Blockslides supports three types of extensions, each serving a different purpose:

### Node Extensions

Use `Node.create()` for **block-level content elements** like headings, images, slides, or custom content blocks.

```ts
import { Node } from '@blockslides/core'

export const CustomBlock = Node.create({
  name: 'customBlock',
  
  group: 'block',
  content: 'inline*',
  
  parseHTML() {
    return [{ tag: 'div.custom-block' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'custom-block' }, 0]
  }
})
```

### Mark Extensions

Use `Mark.create()` for **inline text formatting** like bold, colors, or custom text styles.

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

### Generic Extensions

Use `Extension.create()` for **behaviors and features** that don't directly render content, like keyboard shortcuts, plugins, or utilities.

```ts
import { Extension } from '@blockslides/core'

export const CustomBehavior = Extension.create({
  name: 'customBehavior',
  
  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        // Your custom keyboard shortcut logic
        return true
      }
    }
  }
})
```

## Configuration Options

Extensions can accept configuration options to customize their behavior.

### Defining Options

Use `addOptions()` to define configurable properties:

```ts
export interface CustomBlockOptions {
  HTMLAttributes: Record<string, any>
  defaultColor: string
  allowedColors: string[]
}

export const CustomBlock = Node.create<CustomBlockOptions>({
  name: 'customBlock',
  
  addOptions() {
    return {
      HTMLAttributes: {},
      defaultColor: '#000000',
      allowedColors: ['#000000', '#ff0000', '#00ff00', '#0000ff']
    }
  }
})
```

Access options throughout the extension using `this.options`:

```ts
renderHTML({ node }) {
  const color = node.attrs.color || this.options.defaultColor
  return ['div', { style: `color: ${color}` }, 0]
}
```

### Configuring Extensions

When using your extension, configure it with `.configure()`:

```ts
import { CustomBlock } from './custom-block'

const editor = useSlideEditor({
  extensions: [
    CustomBlock.configure({
      defaultColor: '#333333',
      HTMLAttributes: { class: 'my-custom-block' }
    })
  ]
})
```

## Node Attributes

Define custom attributes for nodes to store data and state.

```ts
export const CustomBlock = Node.create({
  name: 'customBlock',
  
  addAttributes() {
    return {
      color: {
        default: '#000000',
        parseHTML: element => element.getAttribute('data-color'),
        renderHTML: attributes => {
          if (!attributes.color) return {}
          return { 'data-color': attributes.color }
        }
      },
      size: {
        default: 'medium',
        parseHTML: element => element.getAttribute('data-size') || 'medium'
      },
      caption: {
        default: null
      }
    }
  }
})
```

**Attribute configuration:**

- **default** - Default value when attribute is not specified
- **parseHTML** - Extract attribute value from HTML element during parsing
- **renderHTML** - Convert attribute to HTML attributes/data attributes during rendering
- **rendered** - Set to `false` to exclude from DOM output (useful for internal state)

Access attributes in commands and rendering:

```ts
renderHTML({ node, HTMLAttributes }) {
  const { color, size, caption } = node.attrs
  
  return [
    'div',
    {
      class: `custom-block custom-block--${size}`,
      'data-color': color,
      'data-caption': caption || undefined
    },
    0
  ]
}
```

## Commands

Commands provide APIs for programmatically manipulating content.

### Registering Commands

Use `addCommands()` to register commands on the editor:

```ts
declare module '@blockslides/core' {
  interface Commands<ReturnType> {
    customBlock: {
      setCustomBlock: (attributes?: { color?: string, size?: string }) => ReturnType
      updateCustomBlockColor: (color: string) => ReturnType
    }
  }
}

export const CustomBlock = Node.create({
  name: 'customBlock',
  
  addCommands() {
    return {
      setCustomBlock: (attributes = {}) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes
        })
      },
      
      updateCustomBlockColor: (color: string) => ({ commands }) => {
        return commands.updateAttributes(this.name, { color })
      }
    }
  }
})
```

The `declare module` block extends the Commands interface for full TypeScript support.

### Using Commands

```ts
// Insert a custom block
editor.commands.setCustomBlock({ 
  color: '#ff0000', 
  size: 'large' 
})

// Update the color of the currently selected custom block
editor.commands.updateCustomBlockColor('#00ff00')
```

### Command Context

Commands receive a context object with helpful utilities:

```ts
addCommands() {
  return {
    myCommand: (args) => ({ commands, state, chain, tr, dispatch }) => {
      // commands - Access other editor commands
      // state - Current editor state
      // chain - Chain multiple commands
      // tr - Transaction for advanced operations
      // dispatch - Dispatch function for applying changes
      
      return commands.insertContent({ type: this.name })
    }
  }
}
```

## Keyboard Shortcuts

Add keyboard shortcuts to trigger commands.

```ts
export const CustomBlock = Node.create({
  name: 'customBlock',
  
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-b': () => this.editor.commands.setCustomBlock(),
      'Mod-Alt-c': () => {
        const { color } = this.editor.getAttributes('customBlock')
        const nextColor = color === '#ff0000' ? '#0000ff' : '#ff0000'
        return this.editor.commands.updateCustomBlockColor(nextColor)
      },
      'Backspace': () => {
        // Custom backspace behavior for this node type
        // Return false to let default behavior handle it
        return false
      }
    }
  }
})
```

**Key modifiers:**

- `Mod` - Cmd on Mac, Ctrl on Windows/Linux
- `Shift` - Shift key
- `Alt` - Alt/Option key
- `Ctrl` - Control key (use sparingly, prefer `Mod`)

Return `true` to indicate the shortcut was handled and prevent default behavior. Return `false` to let other handlers or default behavior proceed.

## Input Rules

Input rules respond to typed patterns, enabling markdown-style shortcuts.

```ts
import { Node, nodeInputRule } from '@blockslides/core'

export const CustomBlock = Node.create({
  name: 'customBlock',
  
  addInputRules() {
    return [
      nodeInputRule({
        find: /^:::custom\s$/,
        type: this.type,
        getAttributes: () => ({ color: '#ff0000' })
      })
    ]
  }
})
```

When a user types `:::custom ` (with a space), it converts to a custom block. Use `nodeInputRule` for nodes and `markInputRule` for marks:

```ts
import { Mark, markInputRule } from '@blockslides/core'

export const Highlight = Mark.create({
  name: 'highlight',
  
  addInputRules() {
    return [
      markInputRule({
        find: /==([^=]+)==$/,
        type: this.type
      })
    ]
  }
})
```

Typing `==highlighted text==` applies the highlight mark.

## Paste Rules

Paste rules process pasted content, converting patterns to formatted content.

```ts
import { Mark, markPasteRule } from '@blockslides/core'

const urlRegex = /https?:\/\/[^\s]+/g

export const AutoLink = Mark.create({
  name: 'autoLink',
  
  addPasteRules() {
    return [
      markPasteRule({
        find: urlRegex,
        type: this.type,
        getAttributes: match => ({
          href: match[0]
        })
      })
    ]
  }
})
```

Use `markPasteRule` for marks and `nodePasteRule` for nodes.

## HTML Parsing and Rendering

Control how your extension converts between HTML and the editor's internal representation.

### Parsing HTML

Define rules for converting HTML elements into your node or mark:

```ts
export const CustomBlock = Node.create({
  name: 'customBlock',
  
  parseHTML() {
    return [
      {
        tag: 'div.custom-block',
        getAttrs: element => {
          const color = element.getAttribute('data-color')
          const size = element.getAttribute('data-size')
          
          return { color, size }
        }
      },
      {
        tag: 'section[data-custom]',
        priority: 100  // Higher priority checked first
      }
    ]
  }
})
```

### Rendering HTML

Define how your node or mark renders to HTML:

```ts
import { mergeAttributes } from '@blockslides/core'

export const CustomBlock = Node.create({
  name: 'customBlock',
  
  renderHTML({ node, HTMLAttributes }) {
    const { color, size, caption } = node.attrs
    
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          class: `custom-block custom-block--${size}`,
          'data-color': color,
          'data-caption': caption || undefined
        }
      ),
      0  // Content placeholder (0 means render children here)
    ]
  }
})
```

The return format is `[tagName, attributes, ...children]`:
- First element: HTML tag name
- Second element: Attributes object
- Remaining elements: Children (use `0` as placeholder for node content)

For marks, always include a content placeholder:

```ts
export const Highlight = Mark.create({
  name: 'highlight',
  
  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes), 0]
  }
})
```

## Styling with CSS

Extensions can inject CSS styles into the document.

### Using ProseMirror Plugins for CSS

```ts
import { Node, createStyleTag } from '@blockslides/core'
import { Plugin, PluginKey } from '@blockslides/pm/state'

const styles = `
  .custom-block {
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--custom-bg, #f5f5f5);
  }
  
  .custom-block--small { padding: 0.5rem; }
  .custom-block--large { padding: 2rem; }
`

export const CustomBlock = Node.create({
  name: 'customBlock',
  
  addOptions() {
    return {
      injectCSS: true,
      injectNonce: undefined
    }
  },
  
  addProseMirrorPlugins() {
    if (!this.options.injectCSS || typeof document === 'undefined') {
      return []
    }
    
    return [
      new Plugin({
        key: new PluginKey('customBlock'),
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

The `createStyleTag` helper injects a `<style>` tag with a unique ID to prevent duplicate injections. The optional nonce parameter supports Content Security Policy requirements.

## Global Attributes

Add attributes to other extensions without modifying them.

```ts
export const CustomStyling = Extension.create({
  name: 'customStyling',
  
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          theme: {
            default: 'default',
            parseHTML: element => element.getAttribute('data-theme'),
            renderHTML: attributes => {
              if (!attributes.theme) return {}
              return { 'data-theme': attributes.theme }
            }
          }
        }
      }
    ]
  }
})
```

This extension adds a `theme` attribute to both heading and paragraph nodes.

## Node-Specific Properties

Nodes support additional properties for controlling behavior.

### Content Expression

Define what content a node can contain:

```ts
export const CustomContainer = Node.create({
  name: 'customContainer',
  
  content: 'block+',  // One or more block nodes
  // content: 'inline*',  // Zero or more inline nodes
  // content: 'heading paragraph+',  // Heading followed by paragraphs
  // content: 'customBlock*',  // Zero or more custom blocks
})
```

### Group

Assign nodes to groups for content expressions:

```ts
export const CustomBlock = Node.create({
  name: 'customBlock',
  
  group: 'block',  // Can be used anywhere 'block' is allowed
  // group: 'block inline',  // Multiple groups
})
```

### Atom and Selectable

Control selection behavior:

```ts
export const CustomWidget = Node.create({
  name: 'customWidget',
  
  atom: true,        // Treated as single unit (like images)
  selectable: true,  // Can be selected as node selection
  draggable: true    // Can be dragged
})
```

### Isolating and Defining

Control how the node affects surrounding content:

```ts
export const Slide = Node.create({
  name: 'slide',
  
  isolating: true,  // Selections can't cross this node's boundaries
  defining: true    // Defines a structural boundary (affects undo behavior)
})
```

## Mark-Specific Properties

Marks have unique properties for controlling inline formatting behavior.

```ts
export const CustomMark = Mark.create({
  name: 'customMark',
  
  // Keep mark when splitting text node (Enter key)
  keepOnSplit: false,
  
  // Mark extends to include typed text at boundaries
  inclusive: true,
  
  // Mark cannot coexist with other marks
  excludes: 'link customMark',
  
  // User can press arrow key to exit mark at boundaries
  exitable: true
})
```

## Lifecycle Hooks

Extensions can respond to lifecycle events.

```ts
export const CustomExtension = Extension.create({
  name: 'customExtension',
  
  onCreate() {
    // Called when extension is added to editor
    // Initialize resources, register external libraries, etc.
  },
  
  onUpdate() {
    // Called whenever editor content changes
    // Use sparingly as this fires frequently
  },
  
  onDestroy() {
    // Called when extension is removed or editor is destroyed
    // Clean up resources, unregister listeners, etc.
  }
})
```

## ProseMirror Plugins

For advanced functionality, add ProseMirror plugins directly.

```ts
import { Extension } from '@blockslides/core'
import { Plugin, PluginKey } from '@blockslides/pm/state'
import { Decoration, DecorationSet } from '@blockslides/pm/view'

export const CustomPlugin = Extension.create({
  name: 'customPlugin',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('customPlugin'),
        
        state: {
          init: (_, state) => {
            // Initialize plugin state
            return { count: 0 }
          },
          apply: (tr, pluginState, oldState, newState) => {
            // Update plugin state on each transaction
            return { count: pluginState.count + 1 }
          }
        },
        
        props: {
          decorations: (state) => {
            // Add decorations (visual elements) to the document
            return DecorationSet.empty
          },
          
          handleDOMEvents: {
            click: (view, event) => {
              // Handle DOM events
              return false  // false = let other handlers process
            }
          }
        }
      })
    ]
  }
})
```

## Storage

Store extension-level state accessible throughout your application.

```ts
interface CustomStorage {
  counter: number
  items: string[]
}

export const CustomExtension = Extension.create<{}, CustomStorage>({
  name: 'customExtension',
  
  addStorage() {
    return {
      counter: 0,
      items: []
    }
  },
  
  onUpdate() {
    this.storage.counter += 1
  }
})
```

Access storage from your application:

```ts
const count = editor.storage.customExtension.counter
const items = editor.storage.customExtension.items
```

## Priority

Control the order in which extensions are loaded and processed.

```ts
export const CustomExtension = Extension.create({
  name: 'customExtension',
  
  priority: 1000,  // Higher numbers load first (default: 100)
})
```

Extensions with higher priority:
- Are registered first in the schema
- Have their keyboard shortcuts checked first
- Have their input/paste rules evaluated first

## Extending Existing Extensions

Build upon existing extensions instead of creating from scratch.

```ts
import { Heading } from '@blockslides/extension-heading'

export const CustomHeading = Heading.extend({
  name: 'customHeading',
  
  addAttributes() {
    return {
      ...this.parent?.(),  // Include parent attributes
      customAttr: {
        default: null
      }
    }
  },
  
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),  // Include parent shortcuts
      'Mod-Shift-h': () => this.editor.commands.toggleHeading({ level: 1 })
    }
  }
})
```

Access parent configuration with `this.parent?.()` to preserve base functionality while adding customizations.

## Complete Example

Here's a complete custom extension combining multiple concepts:

```ts
import { Node, mergeAttributes, createStyleTag } from '@blockslides/core'
import { Plugin, PluginKey } from '@blockslides/pm/state'

const styles = `
  .callout {
    padding: 1rem 1.5rem;
    border-left: 4px solid var(--callout-color);
    background: var(--callout-bg);
    border-radius: 0.25rem;
  }
  .callout[data-variant="info"] {
    --callout-color: #3b82f6;
    --callout-bg: #eff6ff;
  }
  .callout[data-variant="warning"] {
    --callout-color: #f59e0b;
    --callout-bg: #fffbeb;
  }
  .callout[data-variant="error"] {
    --callout-color: #ef4444;
    --callout-bg: #fef2f2;
  }
`

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>
  variants: string[]
  defaultVariant: string
}

declare module '@blockslides/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes?: { variant?: string }) => ReturnType
      toggleCallout: (attributes?: { variant?: string }) => ReturnType
      setCalloutVariant: (variant: string) => ReturnType
    }
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: 'callout',
  
  group: 'block',
  content: 'block+',
  defining: true,
  
  addOptions() {
    return {
      HTMLAttributes: {},
      variants: ['info', 'warning', 'error'],
      defaultVariant: 'info'
    }
  },
  
  addAttributes() {
    return {
      variant: {
        default: this.options.defaultVariant,
        parseHTML: element => element.getAttribute('data-variant') || this.options.defaultVariant,
        renderHTML: attributes => ({ 'data-variant': attributes.variant })
      }
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'div.callout',
        getAttrs: element => ({
          variant: element.getAttribute('data-variant') || this.options.defaultVariant
        })
      }
    ]
  },
  
  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        { class: 'callout' }
      ),
      0
    ]
  },
  
  addCommands() {
    return {
      setCallout: (attributes = {}) => ({ commands }) => {
        return commands.wrapIn(this.name, attributes)
      },
      
      toggleCallout: (attributes = {}) => ({ commands }) => {
        return commands.toggleWrap(this.name, attributes)
      },
      
      setCalloutVariant: (variant: string) => ({ commands }) => {
        if (!this.options.variants.includes(variant)) {
          return false
        }
        return commands.updateAttributes(this.name, { variant })
      }
    }
  },
  
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-i': () => this.editor.commands.toggleCallout({ variant: 'info' }),
      'Mod-Shift-w': () => this.editor.commands.toggleCallout({ variant: 'warning' })
    }
  },
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('callout'),
        state: {
          init: () => {
            if (typeof document !== 'undefined') {
              createStyleTag(styles, undefined, 'callout-styles')
            }
            return {}
          },
          apply: (_tr, pluginState) => pluginState
        }
      })
    ]
  }
})
```

Usage:

```ts
import { Callout } from './callout'

const editor = useSlideEditor({
  extensions: [
    Callout.configure({
      variants: ['info', 'warning', 'error', 'success'],
      defaultVariant: 'info'
    })
  ]
})

// Wrap selection in a callout
editor.commands.setCallout({ variant: 'warning' })

// Change variant of existing callout
editor.commands.setCalloutVariant('error')
```
