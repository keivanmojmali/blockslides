# Undo/Redo & History

Blockslides provides **undo and redo functionality** through the UndoRedo extension. This extension maintains a history stack of document changes, allowing users to revert and reapply edits.

::: tip History Management
The history system automatically groups rapid changes together and maintains separate undo/redo stacks. Changes are preserved across multiple operations and can be reverted individually or in groups.
:::

## Installation

The UndoRedo extension is included in the ExtensionKit by default:

```ts
import { ExtensionKit } from '@blockslides/extension-kit'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({})
  ]
})
```

If you're building a custom extension setup, import the UndoRedo extension directly:

```ts
import { UndoRedo } from '@blockslides/extensions'

const editor = useSlideEditor({
  extensions: [
    // ... other extensions
    UndoRedo
  ]
})
```

### Disabling undo/redo

Disable the extension by setting it to `false`:

```ts
ExtensionKit.configure({
  undoRedo: false
})
```

## Basic Commands

### Undo

Revert the most recent change or group of changes:

```ts
// Undo the last change
editor.commands.undo()

// Use in a chain
editor.chain().focus().undo().run()
```

**Keyboard shortcut:** `Mod-Z` (Cmd-Z on Mac, Ctrl-Z on Windows/Linux)

### Redo

Reapply a change that was undone:

```ts
// Redo the last undone change
editor.commands.redo()

// Use in a chain
editor.chain().focus().redo().run()
```

**Keyboard shortcuts:**
- `Mod-Shift-Z` (Cmd-Shift-Z on Mac, Ctrl-Shift-Z on Windows/Linux)
- `Mod-Y` (Cmd-Y on Mac, Ctrl-Y on Windows/Linux)

::: tip Russian Keyboard Support
The extension includes built-in support for Russian keyboard layouts with the я key (Mod-я for undo, Shift-Mod-я for redo).
:::

## Configuration

The UndoRedo extension accepts two configuration options that control history behavior:

```ts
UndoRedo.configure({
  depth: 100,
  newGroupDelay: 500
})
```

Or through ExtensionKit:

```ts
ExtensionKit.configure({
  undoRedo: {
    depth: 100,
    newGroupDelay: 500
  }
})
```

### depth

Controls the maximum number of history items stored before the oldest items are discarded.

**Type:** `number`  
**Default:** `100`

```ts
// Store up to 50 undo steps
UndoRedo.configure({
  depth: 50
})

// Store up to 500 undo steps
UndoRedo.configure({
  depth: 500
})
```

Higher values consume more memory but provide longer undo history. Lower values conserve memory at the cost of limited undo capability.

### newGroupDelay

Controls how long (in milliseconds) to wait after a change before starting a new undo group. Changes made within this delay are grouped together as a single undoable action.

**Type:** `number`  
**Default:** `500`

```ts
// Group changes within 1 second
UndoRedo.configure({
  newGroupDelay: 1000
})

// Group changes within 250ms (more granular undo)
UndoRedo.configure({
  newGroupDelay: 250
})
```

**How it works:**
- When you type "hello", if each character is typed within 500ms of the previous one, all characters are grouped together
- A single undo will remove the entire word "hello"
- If you pause for more than 500ms between characters, a new group starts
- Each group can be undone individually

Shorter delays create more granular undo steps. Longer delays group more changes together, creating larger undo steps that feel more natural for rapid typing.

## Understanding History Groups

The history system intelligently groups related changes to create intuitive undo behavior:

**Continuous typing:**
```ts
// User types "Hello world" quickly
// Result: One undo group containing all characters
```

When you undo, the entire phrase is removed at once because all changes occurred within the `newGroupDelay` window.

**Typing with pauses:**
```ts
// User types "Hello" (pause > 500ms) "world"
// Result: Two undo groups
```

The first undo removes "world", the second undo removes "Hello".

**Complex operations:**
```ts
editor.chain()
  .setHeading({ level: 1 })
  .insertContent('Title')
  .toggleBold()
  .run()
```

Chained commands execute in a single transaction and create one undo group. A single undo reverts all three operations.

## Transactions and History

### Changes That Create History Items

Most editor operations create history items:
- Text insertion and deletion
- Formatting changes (bold, italic, colors)
- Node creation and removal (headings, lists, images)
- Attribute updates (changing heading levels, image sizes)
- Content insertion via commands

### Changes That Don't Create History Items

Some operations explicitly exclude themselves from history:
- Focus and blur events
- Selection changes
- ID generation (unique IDs, TOC IDs)
- Math rendering updates
- Transactions marked with `addToHistory: false`

This ensures the undo stack only contains meaningful content changes, not ephemeral state updates.

### Understanding Input Rules

Input rules (like markdown shortcuts) integrate with the undo system:

```ts
// Type: **bold
// → Automatically formats to bold text
// → Creates a history item
```

The `undoInputRule` command specifically reverts input rule transformations, which is separate from the general undo system. This is used internally for the Backspace key to undo automatic formatting.

## Performance Considerations

**Memory usage:**
- Each history item stores document state
- Higher `depth` values increase memory consumption
- For large presentations with many slides, consider the memory impact

**Typical configurations:**

| Use Case | Recommended Depth |
|----------|------------------|
| Simple presentations | 50-100 |
| Standard editing | 100-150 |
| Complex documents | 150-250 |
| Memory-constrained | 25-50 |

**Grouping trade-offs:**

| Delay | Undo Granularity | User Experience |
|-------|-----------------|-----------------|
| 200ms | Very fine | Character-level undo, technical editing |
| 500ms | Balanced | Natural word/phrase undo (default) |
| 1000ms | Coarse | Large content blocks, rapid creation |
