# Keyboard Shortcuts

Blockslides provides keyboard shortcuts for text formatting, navigation, and editor operations. All shortcuts work cross-platform with automatic key mapping. `Mod` maps to `Cmd` on macOS and `Ctrl` on Windows/Linux.

## Default Shortcuts

### Text Formatting

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Mod-b` | Toggle bold | Bold |
| `Mod-i` | Toggle italic | Italic |
| `Mod-u` | Toggle underline | Underline |
| `Mod-e` | Toggle inline code | Code |
| `Mod-Shift-s` | Toggle strikethrough | Strike |
| `Mod-Shift-h` | Toggle highlight | Highlight |

### Headings and Paragraphs

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Mod-Alt-1` | Set heading level 1 | Heading |
| `Mod-Alt-2` | Set heading level 2 | Heading |
| `Mod-Alt-3` | Set heading level 3 | Heading |
| `Mod-Alt-4` | Set heading level 4 | Heading |
| `Mod-Alt-5` | Set heading level 5 | Heading |
| `Mod-Alt-6` | Set heading level 6 | Heading |
| `Mod-Alt-0` | Convert to paragraph | Paragraph |

### Lists

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Mod-Shift-7` | Toggle ordered list | OrderedList |
| `Mod-Shift-8` | Toggle bullet list | BulletList |

### Text Alignment

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Mod-Shift-l` | Align left | TextAlign |
| `Mod-Shift-e` | Align center | TextAlign |
| `Mod-Shift-r` | Align right | TextAlign |
| `Mod-Shift-j` | Justify text | TextAlign |

### Blocks

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Mod-Shift-b` | Toggle blockquote | Blockquote |

### History

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Mod-z` | Undo last change | UndoRedo |
| `Mod-Shift-z` | Redo last undone change | UndoRedo |
| `Mod-y` | Redo last undone change | UndoRedo |

### Selection

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Mod-a` | Progressive selection within slide | SelectWithinSlide |

The `Mod-a` shortcut progressively expands selection scope within the current slide, moving from text selection to block selection to slide selection.

### Line Breaks

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Enter` | New paragraph or split block | Keymap |
| `Shift-Enter` | Insert hard break (line break) | HardBreak |
| `Mod-Enter` | Exit code block or insert hard break | Keymap, HardBreak |

The `Mod-Enter` shortcut is context-sensitive. Inside a code block, it exits the block. Outside a code block, it inserts a hard break.

### Tables

When the cursor is inside a table:

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Tab` | Move to next cell (creates new row if at end) | Table |
| `Shift-Tab` | Move to previous cell | Table |
| `Backspace` | Delete table (when all cells selected) | Table |
| `Delete` | Delete table (when all cells selected) | Table |

### Code Blocks

When the cursor is inside a code block:

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Tab` | Indent line or selection | CodeBlock |
| `Shift-Tab` | Outdent line or selection | CodeBlock |
| `Enter` | Insert newline (exits block after 3 consecutive empty lines) | CodeBlock |

### Platform Differences

Mac-specific shortcuts:

| Shortcut | Action | Extension |
|----------|--------|-----------|
| `Ctrl-h` | Backspace | Keymap |
| `Alt-Backspace` | Delete word backward | Keymap |
| `Ctrl-d` | Delete forward | Keymap |
| `Ctrl-Alt-Backspace` | Delete forward | Keymap |
| `Alt-Delete` | Delete forward | Keymap |
| `Alt-d` | Delete forward | Keymap |
| `Ctrl-a` | Move to start of text block | Keymap |
| `Ctrl-e` | Move to end of text block | Keymap |

These shortcuts automatically activate on macOS and iOS platforms.

## Adding Custom Shortcuts

### Via Custom Extension

Create an extension with `addKeyboardShortcuts()` to define custom keyboard shortcuts:

```ts
import { Extension } from '@blockslides/core'

const CustomShortcuts = Extension.create({
  name: 'customShortcuts',

  addKeyboardShortcuts() {
    return {
      'Mod-k': ({ editor }) => {
        // Your custom logic here
        console.log('Custom shortcut triggered')
        return true
      },
      'Mod-Shift-k': ({ editor }) => {
        editor.commands.toggleBold()
        return true
      }
    }
  }
})

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({}),
    CustomShortcuts
  ]
})
```

Return `true` if the shortcut handled the action, `false` to allow other handlers to process it.

### Overriding Extension Shortcuts

Extensions that define keyboard shortcuts can have higher `priority` to override default shortcuts:

```ts
import { Extension } from '@blockslides/core'

const CustomBoldShortcut = Extension.create({
  name: 'customBoldShortcut',
  priority: 1000, // Higher priority than default Bold extension

  addKeyboardShortcuts() {
    return {
      'Mod-b': ({ editor }) => {
        // Custom bold behavior
        console.log('Custom bold shortcut')
        return editor.commands.toggleBold()
      }
    }
  }
})
```

Extensions with higher priority have their shortcuts evaluated first.

## Disabling Shortcuts

### Disable entire extensions

Remove keyboard shortcuts by disabling their extensions:

```ts
const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      // Disable specific extensions to remove their shortcuts
      strike: false,
      highlight: false,
      textAlign: false
    })
  ]
})
```

### Override with no-op handler

Override specific shortcuts without affecting the rest of the extension:

```ts
import { Extension } from '@blockslides/core'

const DisableShortcuts = Extension.create({
  name: 'disableShortcuts',
  priority: 1000,

  addKeyboardShortcuts() {
    return {
      // Disable Mod-b by returning false
      'Mod-b': () => false,
      // Disable Mod-i by returning true but doing nothing
      'Mod-i': () => true
    }
  }
})

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({}),
    DisableShortcuts
  ]
})
```

## Programmatic Shortcuts

Trigger keyboard shortcuts programmatically using the `keyboardShortcut` command:

```ts
// Trigger bold shortcut
editor.commands.keyboardShortcut('Mod-b')

// Trigger heading level 1 shortcut
editor.commands.keyboardShortcut('Mod-Alt-1')

// Trigger custom shortcut
editor.commands.keyboardShortcut('Mod-Shift-k')
```

This synthesizes a keyboard event and runs it through the normal shortcut handling pipeline.

## Key Notation

Keyboard shortcuts use standardized key notation:

**Modifier keys:**
- `Mod` - `Cmd` on macOS, `Ctrl` on Windows/Linux
- `Ctrl` - Control key
- `Alt` - Option/Alt key
- `Shift` - Shift key
- `Meta` - Windows/Command key

**Special keys:**
- `Enter` - Return/Enter key
- `Space` - Spacebar
- `Tab` - Tab key
- `Backspace` - Backspace/Delete key
- `Delete` - Forward delete key
- `Escape` - Escape key
- `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` - Arrow keys

**Combination format:**

Combine modifiers with `-`:

```ts
'Mod-b'           // Cmd-B on Mac, Ctrl-B on Windows
'Mod-Shift-s'     // Cmd-Shift-S on Mac, Ctrl-Shift-S on Windows
'Mod-Alt-1'       // Cmd-Option-1 on Mac, Ctrl-Alt-1 on Windows
'Ctrl-Alt-Delete' // Ctrl-Alt-Delete (platform-specific)
```

## Context-Aware Shortcuts

Some shortcuts behave differently based on editor context:

**Enter key behavior:**

The `Enter` key tries these actions in sequence until one succeeds:
1. Insert newline in code block
2. Create paragraph near current position
3. Lift empty block out of parent
4. Split current block

**Backspace key behavior:**

The `Backspace` key tries these actions in sequence:
1. Undo last input rule transformation
2. Clear node formatting (when at start of block)
3. Delete selection
4. Join with previous block

**Delete key behavior:**

The `Delete` key tries these actions in sequence:
1. Delete selection
2. Delete current node
3. Join with next block
4. Select node forward

This progressive fallback ensures shortcuts work intuitively across different editor states.

## Extension-Specific Shortcuts

### Code Block Shortcuts

The CodeBlock extension provides Tab indentation within code blocks:

```ts
CodeBlock.configure({
  // Customize tab size for indentation
  tabSize: 2  // Default: 2 spaces
})
```

Pressing `Tab` indents the current line or selection by the configured `tabSize`. `Shift-Tab` removes indentation.

### Table Navigation

The Table extension provides cell navigation and automatic row creation:

- `Tab` at the last cell creates a new row and moves to its first cell
- `Shift-Tab` cycles backward through cells
- Selecting all cells and pressing `Backspace` or `Delete` removes the entire table

### List Keymap

The ListKeymap extension modifies `Backspace` and `Delete` behavior inside lists to properly join list items:

```ts
ExtensionKit.configure({
  listKeymap: {
    listTypes: [
      { itemName: 'listItem', wrapperNames: ['bulletList', 'orderedList'] },
      { itemName: 'taskItem', wrapperNames: ['taskList'] }
    ]
  }
})
```

This prevents default ProseMirror behavior that would lift or sink list items incorrectly.

## Building a Shortcut Reference UI

To display keyboard shortcuts to users with platform-appropriate symbols, detect the platform and format keys accordingly:

```ts
import { isMacOS } from '@blockslides/core'

const isMac = isMacOS()

function formatShortcut(key: string): string {
  return key
    .replace(/Mod/g, isMac ? '⌘' : 'Ctrl')
    .replace(/Shift/g, isMac ? '⇧' : 'Shift')
    .replace(/Alt/g, isMac ? '⌥' : 'Alt')
    .replace(/Enter/g, '↵')
}

// Example
const boldShortcut = formatShortcut('Mod-b')
// Mac: "⌘-b"
// Windows/Linux: "Ctrl-b"
```

**Platform-specific symbol mapping:**

macOS:
- `Mod` → `⌘` (Command)
- `Shift` → `⇧`
- `Alt` → `⌥` (Option)
- `Ctrl` → `⌃` (Control)

Windows/Linux:
- `Mod` → `Ctrl`
- `Shift` → `Shift`
- `Alt` → `Alt`
- `Ctrl` → `Ctrl`
