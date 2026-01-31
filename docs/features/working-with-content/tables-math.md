# Tables & Math

Blockslides supports **tables and mathematical expressions** through dedicated extensions. Create structured data tables with full editing capabilities, and embed LaTeX-formatted math equations inline or as display blocks using KaTeX rendering.

## Installation

Both table and math extensions are included in the ExtensionKit by default:

```ts
import { ExtensionKit } from '@blockslides/extension-kit'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({})
  ]
})
```

If you're building a custom extension setup, you can import them individually:

```ts
import { Table, TableRow, TableCell, TableHeader } from '@blockslides/extension-table'
import { Mathematics } from '@blockslides/extension-mathematics'

const editor = useSlideEditor({
  extensions: [
    // Table extensions (all required together)
    Table.configure({
      resizable: true,
      cellMinWidth: 50
    }),
    TableRow,
    TableCell,
    TableHeader,
    
    // Math extension
    Mathematics.configure({
      katexOptions: {
        throwOnError: false
      }
    })
  ]
})
```

### Disabling tables or math

You can disable either extension by setting it to `false`:

```ts
ExtensionKit.configure({
  table: false,
  mathematics: false
})
```

## Tables

The Table extension provides full-featured table editing with support for adding/removing rows and columns, merging cells, header rows and columns, column resizing, and keyboard navigation.

### Creating tables

Use the `insertTable()` command to create tables:

```ts
// Basic 3x3 table with header row
editor.commands.insertTable()

// Custom dimensions
editor.commands.insertTable({
  rows: 5,
  cols: 4,
  withHeaderRow: true
})

// No header row
editor.commands.insertTable({
  rows: 4,
  cols: 3,
  withHeaderRow: false
})
```

**Default parameters:**
- `rows`: 3
- `cols`: 3
- `withHeaderRow`: true

### Markdown support

Tables automatically format when you type standard markdown table syntax:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

The table converts to an interactive table node as soon as the syntax is complete.

### Row operations

Add and remove rows relative to the cursor position:

```ts
// Add a row above the current row
editor.commands.addRowBefore()

// Add a row below the current row
editor.commands.addRowAfter()

// Delete the current row
editor.commands.deleteRow()
```

### Column operations

Add and remove columns relative to the cursor position:

```ts
// Add a column to the left of the current column
editor.commands.addColumnBefore()

// Add a column to the right of the current column
editor.commands.addColumnAfter()

// Delete the current column
editor.commands.deleteColumn()
```

### Cell operations

Merge and split cells for complex table layouts:

```ts
// Merge selected cells
editor.commands.mergeCells()

// Split a merged cell
editor.commands.splitCell()

// Merge if possible, otherwise split
editor.commands.mergeOrSplit()

// Set cell attributes
editor.commands.setCellAttribute('colspan', 2)
editor.commands.setCellAttribute('rowspan', 3)
```

**Cell attributes:**
- **colspan** (`number`) - Number of columns the cell spans
- **rowspan** (`number`) - Number of rows the cell spans
- **colwidth** (`number[] | null`) - Array of column widths in pixels

### Header management

Toggle headers for rows, columns, or individual cells:

```ts
// Toggle the entire first row as headers
editor.commands.toggleHeaderRow()

// Toggle the entire first column as headers
editor.commands.toggleHeaderColumn()

// Toggle the current cell between header and regular cell
editor.commands.toggleHeaderCell()
```

### Cell navigation

Navigate between cells programmatically:

```ts
// Move to the next cell (right, then down)
editor.commands.goToNextCell()

// Move to the previous cell (left, then up)
editor.commands.goToPreviousCell()
```

### Keyboard shortcuts

The Table extension includes built-in keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| `Tab` | Move to next cell (creates new row at end) |
| `Shift+Tab` | Move to previous cell |
| `Backspace` | Delete table (when all cells selected) |
| `Delete` | Delete table (when all cells selected) |

### Deleting tables

Remove the entire table:

```ts
// Delete the table at the cursor position
editor.commands.deleteTable()
```

The table is also deleted automatically when you select all cells and press `Backspace` or `Delete`.

### Column resizing

Enable interactive column resizing by configuring the Table extension:

```ts
Table.configure({
  // Enable resizable columns
  resizable: true,
  
  // Width of the resize handle (in pixels)
  handleWidth: 5,
  
  // Minimum width of any column (in pixels)
  cellMinWidth: 25,
  
  // Allow resizing the last column
  lastColumnResizable: true
})
```

When `resizable` is enabled and the editor is editable, users can drag column borders to adjust widths.

### Cell selection

Create multi-cell selections programmatically:

```ts
// Select a range of cells
editor.commands.setCellSelection({
  anchorCell: 1,  // Start position
  headCell: 5     // End position
})
```

Cell positions are document positions where the cells are located.

### Table repair

Fix malformed table structures:

```ts
// Attempt to repair table structure issues
editor.commands.fixTables()
```

This command is useful after programmatic manipulation or pasting content that may have created an invalid table structure.

### Configuration options

Configure the Table extension with these options:

```ts
Table.configure({
  // Custom HTML attributes on the <table> element
  HTMLAttributes: {
    class: 'my-table-class'
  },
  
  // Enable column resizing
  resizable: false,
  
  // Resize handle width in pixels
  handleWidth: 5,
  
  // Minimum cell width in pixels
  cellMinWidth: 25,
  
  // Allow resizing the last column
  lastColumnResizable: true,
  
  // Allow selecting the entire table as a node
  allowTableNodeSelection: false
})
```

**Options:**

- **HTMLAttributes** (`Record<string, any>`) - Custom HTML attributes added to `<table>` elements
- **resizable** (`boolean`, default: `false`) - Enable interactive column resizing
- **handleWidth** (`number`, default: `5`) - Width of resize handles in pixels
- **cellMinWidth** (`number`, default: `25`) - Minimum width constraint for columns
- **lastColumnResizable** (`boolean`, default: `true`) - Allow resizing the rightmost column
- **allowTableNodeSelection** (`boolean`, default: `false`) - Enable selecting the table as a single node

## Mathematics

The Mathematics extension provides both inline and block-level mathematical expressions using LaTeX syntax and KaTeX rendering. It includes automatic markdown conversion, input rules, and interactive editing support.

::: tip Inline vs Block Math
Use **inline math** for expressions within text flow (e.g., "The equation $E = mc^2$ shows..."). Use **block math** for display equations that stand alone on their own lines.
:::

### Inline math

Inline math expressions flow with text and are wrapped in single dollar signs in markdown.

#### Adding inline math

Use the `insertInlineMath()` command to insert inline expressions:

```ts
// Insert at cursor position
editor.commands.insertInlineMath({
  latex: 'E = mc^2'
})

// Insert at specific position
editor.commands.insertInlineMath({
  latex: '\\sum_{i=1}^{n} x_i',
  pos: 42
})
```

#### Input rules

Inline math automatically converts when you type double dollar signs:

```
$$E = mc^2$$
```

As soon as you complete the syntax, it converts to a rendered inline math node.

::: tip Markdown vs Input Rules
When **typing in the editor**, use double dollars `$$latex$$` for inline math. When **importing markdown**, single dollars `$latex$` are parsed correctly. This distinction exists because single dollars are common in regular text and would cause false conversions while typing.
:::

#### Updating inline math

Modify existing inline math expressions:

```ts
// Update math at cursor position
editor.commands.updateInlineMath({
  latex: 'F = ma'
})

// Update math at specific position
editor.commands.updateInlineMath({
  latex: 'a^2 + b^2 = c^2',
  pos: 42
})
```

#### Deleting inline math

Remove inline math nodes:

```ts
// Delete at cursor position
editor.commands.deleteInlineMath()

// Delete at specific position
editor.commands.deleteInlineMath({ pos: 42 })
```

### Block math

Block math expressions display as standalone elements and are wrapped in double dollar signs in markdown.

#### Adding block math

Use the `insertBlockMath()` command to insert display equations:

```ts
// Insert at cursor position
editor.commands.insertBlockMath({
  latex: '\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}'
})

// Insert at specific position
editor.commands.insertBlockMath({
  latex: '\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}',
  pos: 100
})
```

#### Markdown input support

Block math automatically converts when you type the markdown syntax:

```markdown
$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

The block converts to a rendered math node when the syntax is complete.

#### Input rules

Block math also supports triple dollar sign input rules. Type `$$$` at the start of a line, add your LaTeX, then close with `$$$`:

```
$$$\sum_{i=1}^{n} x_i = X$$$
```

This converts immediately to a block math node.

#### Updating block math

Modify existing block math expressions:

```ts
// Update math at cursor position
editor.commands.updateBlockMath({
  latex: '\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}'
})

// Update math at specific position
editor.commands.updateBlockMath({
  latex: 'e^{i\\pi} + 1 = 0',
  pos: 100
})
```

#### Deleting block math

Remove block math nodes:

```ts
// Delete at cursor position
editor.commands.deleteBlockMath()

// Delete at specific position
editor.commands.deleteBlockMath({ pos: 100 })
```

### KaTeX configuration

Configure KaTeX rendering options for both inline and block math:

```ts
Mathematics.configure({
  katexOptions: {
    // Throw errors or render error message
    throwOnError: false,
    
    // Custom LaTeX macros
    macros: {
      '\\RR': '\\mathbb{R}',
      '\\ZZ': '\\mathbb{Z}',
      '\\NN': '\\mathbb{N}'
    },
    
    // Trust certain commands (use with caution)
    trust: false,
    
    // Strict mode warnings
    strict: 'warn'
  }
})
```

See the [KaTeX documentation](https://katex.org/docs/options.html) for all available options.

### Click handlers

Add interactive click handlers to math nodes:

```ts
Mathematics.configure({
  inlineOptions: {
    onClick: (node, pos) => {
      console.log('Inline math clicked:', node.attrs.latex)
      console.log('Position:', pos)
      // Open a math editor, show a tooltip, etc.
    }
  },
  blockOptions: {
    onClick: (node, pos) => {
      console.log('Block math clicked:', node.attrs.latex)
      console.log('Position:', pos)
      // Open a math editor modal, etc.
    }
  }
})
```

The click handlers receive:
- **node** - The ProseMirror node containing the math expression
- **pos** - The document position of the node

### Error handling

When LaTeX rendering fails, the math node gracefully displays the raw LaTeX text with an error class:

```ts
Mathematics.configure({
  katexOptions: {
    // Show error message instead of throwing
    throwOnError: false
  }
})
```

With `throwOnError: false`, invalid LaTeX displays as plain text with the class `inline-math-error` or `block-math-error` for styling.

### Configuring inline and block separately

You can configure inline and block math with different options:

```ts
Mathematics.configure({
  inlineOptions: {
    onClick: (node, pos) => {
      // Handle inline math clicks
    },
    katexOptions: {
      displayMode: false
    }
  },
  blockOptions: {
    onClick: (node, pos) => {
      // Handle block math clicks
    },
    katexOptions: {
      displayMode: true
    }
  }
})
```

### Using extensions separately

You can also import and configure InlineMath and BlockMath individually:

```ts
import { InlineMath, BlockMath } from '@blockslides/extension-mathematics'

const editor = useSlideEditor({
  extensions: [
    InlineMath.configure({
      onClick: (node, pos) => {
        // Handle inline math
      }
    }),
    BlockMath.configure({
      onClick: (node, pos) => {
        // Handle block math
      }
    })
  ]
})
```

## Working with Tables and Math Programmatically

### Finding tables in content

Traverse the document to find all tables:

```ts
const tables: any[] = []
editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'table') {
    tables.push({
      pos,
      rows: node.childCount,
      node
    })
  }
})

console.log('Found tables:', tables)
```

### Finding math expressions in content

Traverse the document to find all math nodes:

```ts
const mathExpressions: any[] = []
editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'inlineMath' || node.type.name === 'blockMath') {
    mathExpressions.push({
      type: node.type.name,
      latex: node.attrs.latex,
      pos
    })
  }
})

console.log('Found math expressions:', mathExpressions)
```

### Checking node at cursor

Check if the current selection is a table or math node:

```ts
const { from } = editor.state.selection
const node = editor.state.doc.nodeAt(from)

if (node?.type.name === 'table') {
  console.log('Cursor is in a table')
}

if (node?.type.name === 'inlineMath') {
  console.log('Inline math at cursor:', node.attrs.latex)
}

if (node?.type.name === 'blockMath') {
  console.log('Block math at cursor:', node.attrs.latex)
}
```
