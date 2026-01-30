# Commands API

The Commands API provides the primary interface for programmatically manipulating editor content and state. Every action in Blockslides, from formatting text to inserting nodes, is executed through commands.

## Executing Commands

Commands can be executed in three ways, each serving different use cases.

### Single Commands

Execute a command immediately and get its return value:

```ts
// Returns true if successful
editor.commands.toggleBold()

// Insert content at the current selection
editor.commands.insertContent('<p>Hello</p>')

// Update node attributes
editor.commands.updateAttributes('heading', { level: 2 })
```

Single commands execute immediately and return a value. Most commands return `boolean` indicating success or failure, but some return other types like strings, numbers, or objects depending on their purpose.

### Chained Commands

Chain multiple commands together and execute them as a single transaction:

```ts
editor
  .chain()
  .focus()
  .toggleBold()
  .toggleItalic()
  .run()
```

Chained commands build a transaction that executes atomically when `.run()` is called. The chain returns `true` only if **all** commands in the chain succeed. This is useful for complex operations that should either fully succeed or fully fail together.

```ts
// All commands must succeed for the chain to return true
const success = editor
  .chain()
  .setHeading({ level: 1 })
  .insertContent(' Welcome')
  .run()

if (success) {
  console.log('Heading created successfully')
}
```

### Dry-Run Commands

Check if a command can execute without actually running it:

```ts
// Check if bold can be toggled
if (editor.can().toggleBold()) {
  // Show bold button as enabled
}

// Check if a heading can be set
const canSetHeading = editor.can().setHeading({ level: 3 })
```

This is particularly useful for UI state management, such as enabling/disabling buttons or showing active formatting states. The `can()` method executes commands in dry-run mode with `dispatch` set to `undefined`, so no actual changes are made.

You can also check chains:

```ts
const canFormat = editor
  .can()
  .chain()
  .toggleBold()
  .toggleItalic()
  .run()
```

## Core Commands

Blockslides includes a comprehensive set of core commands for document manipulation. These are available on every editor instance.

### Content Commands

```ts
// Set entire document content
editor.commands.setContent('<p>New content</p>')
editor.commands.setContent(jsonContent)

// Insert content at current position
editor.commands.insertContent('<h1>Title</h1>')

// Insert content at specific position
editor.commands.insertContentAt({ from: 10, to: 20 }, '<p>Text</p>')

// Clear all content
editor.commands.clearContent()
```

### Selection Commands

```ts
// Select all content
editor.commands.selectAll()

// Set text selection
editor.commands.setTextSelection({ from: 5, to: 10 })

// Set node selection
editor.commands.setNodeSelection(position)

// Select parent node
editor.commands.selectParentNode()

// Navigate selections
editor.commands.selectNodeForward()
editor.commands.selectNodeBackward()
editor.commands.selectTextblockStart()
editor.commands.selectTextblockEnd()
```

### Node Commands

```ts
// Set node type
editor.commands.setNode('paragraph')
editor.commands.setNode('heading', { level: 2 })

// Toggle between node types
editor.commands.toggleNode('heading', 'paragraph', { level: 1 })

// Delete nodes
editor.commands.deleteNode('image')
editor.commands.deleteCurrentNode()

// Clear node formatting
editor.commands.clearNodes()

// Lift nodes out of parent
editor.commands.lift()
editor.commands.liftEmptyBlock()

// Wrap selection in node
editor.commands.wrapIn('blockquote')
editor.commands.toggleWrap('blockquote')
```

### Mark Commands

```ts
// Set marks (applies and merges attributes)
editor.commands.setMark('bold')
editor.commands.setMark('link', { href: 'https://example.com' })

// Toggle marks on/off
editor.commands.toggleMark('bold')
editor.commands.toggleMark('italic')

// Remove marks
editor.commands.unsetMark('bold')
editor.commands.unsetMark('link', { extendEmptyMarkRange: true })
editor.commands.unsetAllMarks()

// Extend mark range to word boundaries
editor.commands.extendMarkRange('link')
```

### List Commands

```ts
// Toggle list types
editor.commands.toggleList('bulletList', 'listItem')
editor.commands.toggleList('orderedList', 'listItem')

// Wrap in list
editor.commands.wrapInList('bulletList')

// Adjust list item depth
editor.commands.liftListItem('listItem')
editor.commands.sinkListItem('listItem')

// Split list items
editor.commands.splitListItem('listItem')

// Join list items
editor.commands.joinItemBackward()
editor.commands.joinItemForward()
```

### Text Block Commands

```ts
// Join text blocks
editor.commands.joinTextblockBackward()
editor.commands.joinTextblockForward()

// Split current block
editor.commands.splitBlock()

// Create paragraph near current block
editor.commands.createParagraphNear()
```

### Editor State Commands

```ts
// Focus editor
editor.commands.focus()
editor.commands.focus('start')
editor.commands.focus('end')
editor.commands.focus(10)
editor.commands.focus('all')

// Blur editor
editor.commands.blur()

// Scroll into view
editor.commands.scrollIntoView()

// Set transaction metadata
editor.commands.setMeta('key', value)
```

### Attribute Commands

```ts
// Update node or mark attributes
editor.commands.updateAttributes('heading', { level: 3 })
editor.commands.updateAttributes('link', { href: 'https://new-url.com' })

// Reset attributes to defaults
editor.commands.resetAttributes('heading', ['level'])
```

### Special Commands

```ts
// Execute first successful command
editor.commands.first([
  () => editor.commands.toggleBold(),
  () => editor.commands.toggleItalic()
])

// Loop through items
editor.commands.forEach([1, 2, 3], (item, { commands }) => {
  return commands.insertContent(`<p>${item}</p>`)
})

// Define inline command
editor.commands.command(({ tr, state, dispatch }) => {
  // Custom command logic
  return true
})

// Delete selection
editor.commands.deleteSelection()

// Delete range
editor.commands.deleteRange({ from: 5, to: 10 })

// Cut selection
editor.commands.cut({ from: 5, to: 10 })

// Handle keyboard events
editor.commands.enter()
editor.commands.exitCode()
editor.commands.newlineInCode()

// Undo input rules
editor.commands.undoInputRule()
```

## Extension Commands

Extensions add their own domain-specific commands. These are available when the extension is included in your editor configuration.

### Text Formatting

```ts
// Bold extension
editor.commands.setBold()
editor.commands.toggleBold()
editor.commands.unsetBold()

// Italic extension
editor.commands.setItalic()
editor.commands.toggleItalic()
editor.commands.unsetItalic()

// Underline extension
editor.commands.setUnderline()
editor.commands.toggleUnderline()
editor.commands.unsetUnderline()

// Strike extension
editor.commands.setStrike()
editor.commands.toggleStrike()
editor.commands.unsetStrike()

// Code extension
editor.commands.setCode()
editor.commands.toggleCode()
editor.commands.unsetCode()

// Highlight extension
editor.commands.setHighlight()
editor.commands.toggleHighlight({ color: '#ffcc00' })
editor.commands.unsetHighlight()

// Subscript/Superscript
editor.commands.setSubscript()
editor.commands.toggleSubscript()
editor.commands.unsetSubscript()

editor.commands.setSuperscript()
editor.commands.toggleSuperscript()
editor.commands.unsetSuperscript()
```

### Text Style

```ts
// Text color
editor.commands.setColor('#ff0000')
editor.commands.unsetColor()

// Background color
editor.commands.setBackgroundColor('#ffff00')
editor.commands.unsetBackgroundColor()

// Font family
editor.commands.setFontFamily('Georgia')
editor.commands.unsetFontFamily()

// Font size
editor.commands.setFontSize('18px')
editor.commands.unsetFontSize()

// Line height
editor.commands.setLineHeight('1.5')
editor.commands.unsetLineHeight()
```

### Block Formatting

```ts
// Headings
editor.commands.setHeading({ level: 1 })
editor.commands.toggleHeading({ level: 2 })

// Blockquote
editor.commands.setBlockquote()
editor.commands.toggleBlockquote()
editor.commands.unsetBlockquote()

// Code block
editor.commands.setCodeBlock()
editor.commands.toggleCodeBlock()
editor.commands.setCodeBlock({ language: 'javascript' })

// Text alignment
editor.commands.setTextAlign('left')
editor.commands.setTextAlign('center')
editor.commands.setTextAlign('right')
editor.commands.setTextAlign('justify')
editor.commands.unsetTextAlign()

// Horizontal rule
editor.commands.setHorizontalRule()
```

### Links

```ts
// Set link
editor.commands.setLink({ 
  href: 'https://example.com',
  target: '_blank'
})

// Toggle link
editor.commands.toggleLink({ href: 'https://example.com' })

// Remove link
editor.commands.unsetLink()
```

### Media

```ts
// Images
editor.commands.setImage({ 
  src: 'https://example.com/image.jpg',
  alt: 'Description',
  title: 'Image title'
})

// Image blocks
editor.commands.insertImageBlock({
  src: 'https://example.com/image.jpg',
  alt: 'Description',
  caption: 'Image caption',
  credit: 'Photo credit'
})

// YouTube
editor.commands.setYoutubeVideo({ 
  src: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  width: 640,
  height: 480
})
```

### Tables

```ts
// Insert table
editor.commands.insertTable({ 
  rows: 3, 
  cols: 3, 
  withHeaderRow: true 
})

// Add rows/columns
editor.commands.addRowBefore()
editor.commands.addRowAfter()
editor.commands.addColumnBefore()
editor.commands.addColumnAfter()

// Delete rows/columns
editor.commands.deleteRow()
editor.commands.deleteColumn()
editor.commands.deleteTable()

// Merge/split cells
editor.commands.mergeCells()
editor.commands.splitCell()

// Navigate cells
editor.commands.goToNextCell()
editor.commands.goToPreviousCell()

// Toggle header
editor.commands.toggleHeaderRow()
editor.commands.toggleHeaderColumn()
editor.commands.toggleHeaderCell()

// Set cell attributes
editor.commands.setCellAttribute('backgroundColor', '#f0f0f0')
editor.commands.setCellAttribute('align', 'center')
```

### Mathematics

```ts
// Inline math
editor.commands.insertInlineMath({ latex: 'E = mc^2' })

// Block math
editor.commands.insertBlockMath({ latex: '\\int_0^\\infty e^{-x^2} dx' })
```

## Creating Custom Commands

### Inline Commands

Define commands inline when you need one-off operations:

```ts
editor.commands.command(({ tr, state, dispatch, commands }) => {
  // Access transaction
  const { selection } = tr
  
  // Access current state
  const { schema, doc } = state
  
  // Execute other commands
  commands.deleteSelection()
  
  // Modify transaction
  if (dispatch) {
    tr.insertText('Custom text', selection.from)
  }
  
  // Return success/failure
  return true
})
```

The inline command receives `CommandProps` with full access to the editor context. Return `true` for success, `false` for failure.

### Extension Commands

Add commands to custom extensions using the `addCommands()` method:

```ts
import { Mark } from '@blockslides/core'

const CustomMark = Mark.create({
  name: 'customMark',

  addCommands() {
    return {
      setCustomMark: (attributes) => ({ commands }) => {
        return commands.setMark(this.name, attributes)
      },
      
      toggleCustomMark: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
      
      unsetCustomMark: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
      
      // Command with custom logic
      customOperation: () => ({ tr, state, dispatch, editor }) => {
        // Access extension options
        const { someOption } = this.options
        
        // Access extension storage
        this.storage.lastUsed = Date.now()
        
        // Perform custom operations
        if (dispatch) {
          tr.insertText('Custom operation')
        }
        
        return true
      }
    }
  }
})
```

Commands in extensions have access to `this.name`, `this.type`, `this.options`, `this.storage`, and `this.editor`.

::: tip Command Return Values
Extension commands return functions that receive `CommandProps`. The inner function performs the actual work and returns the result. Most commands return `boolean`, but you can return any value type if your command needs to return data.
:::

### Declaring Command Types

For TypeScript support, declare your commands in the module:

```ts
declare module '@blockslides/core' {
  interface Commands<ReturnType> {
    customMark: {
      /**
       * Set custom mark
       */
      setCustomMark: (attributes?: Record<string, any>) => ReturnType
      
      /**
       * Toggle custom mark
       */
      toggleCustomMark: () => ReturnType
      
      /**
       * Remove custom mark
       */
      unsetCustomMark: () => ReturnType
      
      /**
       * Perform custom operation
       */
      customOperation: () => ReturnType
    }
  }
}
```

The `ReturnType` generic allows the same command interface to work across single commands, chained commands, and can-commands.

## Command Composition

Commands are designed to be composed together for complex operations.

### Chaining with Conditional Logic

```ts
// Execute commands conditionally
const formatText = () => {
  const chain = editor.chain().focus()
  
  if (shouldBold) {
    chain.toggleBold()
  }
  
  if (shouldItalic) {
    chain.toggleItalic()
  }
  
  return chain.run()
}
```

### Calling Commands from Commands

Commands can call other commands internally:

```ts
addCommands() {
  return {
    formatAsHeader: () => ({ commands }) => {
      return commands
        .setHeading({ level: 1 })
        .setTextAlign('center')
    },
    
    clearFormatting: () => ({ commands, chain }) => {
      return chain()
        .clearNodes()
        .unsetAllMarks()
        .run()
    }
  }
}
```

### First-Match Command

Execute the first command that succeeds:

```ts
editor.commands.first([
  // Try to exit code block first
  ({ commands }) => commands.exitCode(),
  
  // Otherwise insert hard break
  ({ commands }) => commands.setHardBreak(),
  
  // Fallback to splitting block
  ({ commands }) => commands.splitBlock()
])
```

This pattern is useful for context-aware keyboard shortcuts where behavior depends on the current node type.

### Iterating with forEach

Execute commands for each item in a collection:

```ts
const headings = ['Introduction', 'Methods', 'Results', 'Conclusion']

editor.commands.forEach(headings, (title, { commands }) => {
  return commands
    .insertContent(`<h2>${title}</h2><p></p>`)
})
```

### Transaction Metadata

Use metadata to communicate between commands and plugins:

```ts
// Set metadata in command
editor.commands.setMeta('preventAutolink', true)

// Read metadata in plugin
const preventAutolink = tr.getMeta('preventAutolink')
```

This is useful for temporarily disabling plugin behavior or passing contextual information through the transaction lifecycle.

## Command Props

Every command receives a `CommandProps` object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `editor` | `SlideEditor` | The editor instance |
| `state` | `EditorState` | Current editor state (possibly from a chain) |
| `view` | `EditorView` | The ProseMirror view |
| `tr` | `Transaction` | The transaction being built |
| `dispatch` | `function \| undefined` | Dispatch function (undefined in dry-run mode) |
| `commands` | `SingleCommands` | All available commands for composition |
| `chain` | `function` | Creates a new command chain |
| `can` | `function` | Creates a dry-run command executor |

Check `dispatch` to determine if the command should apply changes or just test feasibility:

```ts
addCommands() {
  return {
    myCommand: () => ({ tr, dispatch }) => {
      // Always check feasibility
      const canExecute = /* ... check logic ... */
      
      if (!canExecute) {
        return false
      }
      
      // Only apply changes if dispatch is defined
      if (dispatch) {
        tr.insertText('text')
      }
      
      return true
    }
  }
}
```

This pattern ensures commands work correctly in both normal execution and dry-run mode.
