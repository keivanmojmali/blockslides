# Keyboard Shortcuts

Keyboard shortcuts system providing customizable key bindings for editor commands.

## 📁 Files

```
keyboard/
└── defaultShortcuts.ts   # Default keyboard shortcut definitions
```

## 🎯 Overview

The keyboard shortcuts system provides:

1. **Default Shortcuts** - Pre-configured shortcuts for common operations
2. **Customization** - Override, disable, or add custom shortcuts
3. **Platform Detection** - Shows ⌘ on Mac, Ctrl on Windows/Linux
4. **Categories** - Organized shortcuts for better discoverability
5. **Help Modal** - Built-in shortcuts help (Shift+?)

## 📖 Default Shortcuts

### Text Formatting

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Mod-b` | `toggleBold` | Toggle bold |
| `Mod-i` | `toggleItalic` | Toggle italic |
| `Mod-u` | `toggleUnderline` | Toggle underline |
| `Mod-Shift-x` | `toggleStrikethrough` | Toggle strikethrough |
| `Mod-e` | `toggleCode` | Toggle inline code |

> **Note:** `Mod` = `Cmd` on Mac, `Ctrl` on Windows/Linux

### History

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Mod-z` | `undo` | Undo last change |
| `Mod-y` | `redo` | Redo last undone change |
| `Mod-Shift-z` | `redo` | Redo (alternative) |

### Selection

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Mod-a` | `selectAll` | Select all content |
| `Escape` | `collapseSelection` | Clear selection |

### Slides (Presentation Mode)

| Shortcut | Command | Description |
|----------|---------|-------------|
| `ArrowRight` | `nextSlide` | Next slide |
| `ArrowLeft` | `prevSlide` | Previous slide |
| `ArrowDown` | `nextSlide` | Next slide (alternative) |
| `ArrowUp` | `prevSlide` | Previous slide (alternative) |
| `Space` | `nextSlide` | Next slide (alternative) |
| `Home` | `goToFirstSlide` | Go to first slide |
| `End` | `goToLastSlide` | Go to last slide |

### Help

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Shift-?` | `toggleHelp` | Show/hide shortcuts help |

## 🎨 KeyboardShortcut Type

```typescript
interface KeyboardShortcut {
  key: string;          // Key combination (e.g., 'Mod-b')
  command: string;      // Command name to execute
  description: string;  // Human-readable description
  category?: string;    // Category for grouping in help
}
```

## 🔧 Customization

### Disable Shortcuts

```tsx
<SlideEditor
  content={content}
  keyboardShortcuts={{
    disabled: ['Mod-b', 'Mod-i']  // Disable bold and italic
  }}
/>
```

### Override Shortcuts

```tsx
<SlideEditor
  content={content}
  keyboardShortcuts={{
    overrides: {
      'Mod-b': 'customBoldCommand',  // Change what Mod-b does
      'Mod-s': 'saveCommand'          // Override Mod-s
    }
  }}
/>
```

### Add Custom Shortcuts

```tsx
<SlideEditor
  content={content}
  keyboardShortcuts={{
    custom: {
      'Mod-Shift-d': {
        key: 'Mod-Shift-d',
        command: 'duplicateSlide',
        description: 'Duplicate current slide',
        category: 'Slides'
      },
      'Mod-k': {
        key: 'Mod-k',
        command: 'insertLink',
        description: 'Insert link',
        category: 'Insert'
      }
    }
  }}
/>
```

### Complete Example

```tsx
<SlideEditor
  content={content}
  keyboardShortcuts={{
    // Disable some default shortcuts
    disabled: ['Mod-u', 'Mod-Shift-x'],
    
    // Override defaults
    overrides: {
      'Mod-b': 'customBold',
      'Mod-s': 'saveDocument'
    },
    
    // Add custom shortcuts
    custom: {
      'Mod-Shift-s': {
        key: 'Mod-Shift-s',
        command: 'saveAs',
        description: 'Save as...',
        category: 'File'
      },
      'Mod-d': {
        key: 'Mod-d',
        command: 'duplicateSlide',
        description: 'Duplicate slide',
        category: 'Slides'
      }
    }
  }}
/>
```

## 🎯 Accessing Shortcuts

### From DEFAULT_SHORTCUTS

```typescript
import { DEFAULT_SHORTCUTS } from 'autoartifacts';

// Get all shortcuts
console.log(DEFAULT_SHORTCUTS);

// Get specific shortcut
const boldShortcut = DEFAULT_SHORTCUTS['Mod-b'];
console.log(boldShortcut.description);  // "Toggle bold"
```

### From Component

```tsx
import { SlideEditor, DEFAULT_SHORTCUTS } from 'autoartifacts';

function MyEditor() {
  return (
    <div>
      <ShortcutsReference shortcuts={DEFAULT_SHORTCUTS} />
      <SlideEditor content={content} />
    </div>
  );
}
```

## 🔍 Key Format

### Modifiers

- `Mod` - Cmd on Mac, Ctrl on Windows/Linux
- `Ctrl` - Control key
- `Alt` - Alt/Option key
- `Shift` - Shift key
- `Meta` - Command key (Mac only)

### Key Names

- Letters: `a`, `b`, `c`, etc.
- Numbers: `1`, `2`, `3`, etc.
- Special: `Enter`, `Escape`, `Space`, `Tab`, `Backspace`, `Delete`
- Arrows: `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`
- Function: `F1`, `F2`, etc.

### Combinations

Combine with `-`:

```typescript
'Mod-b'           // Cmd/Ctrl + B
'Mod-Shift-z'     // Cmd/Ctrl + Shift + Z
'Ctrl-Alt-Delete' // Ctrl + Alt + Delete
'Shift-?'         // Shift + ?
```

## 🎨 Shortcuts Help Modal

Built-in help modal accessible via `Shift+?`:

```tsx
// Automatically included in SlideEditor
<SlideEditor content={content} />

// Show help on mount
<SlideEditor content={content} showShortcutsHelp={true} />

// Manual control
import { KeyboardShortcutsHelp } from 'autoartifacts';

function MyEditor() {
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowHelp(true)}>Show Shortcuts</button>
      <SlideEditor content={content} />
      
      {showHelp && (
        <KeyboardShortcutsHelp
          shortcuts={DEFAULT_SHORTCUTS}
          onClose={() => setShowHelp(false)}
        />
      )}
    </>
  );
}
```

## 🔧 Helper Functions

### getKeyDisplay(key)

Convert key string to display format:

```typescript
import { getKeyDisplay } from 'autoartifacts';

getKeyDisplay('Mod-b');        // "⌘B" on Mac, "Ctrl+B" on Windows
getKeyDisplay('Mod-Shift-z');  // "⌘⇧Z" on Mac, "Ctrl+Shift+Z" on Windows
getKeyDisplay('ArrowRight');   // "→"
getKeyDisplay('Enter');        // "↵"
```

### isMacOS()

Detect if running on macOS:

```typescript
import { isMacOS } from 'autoartifacts';

if (isMacOS()) {
  console.log('Running on Mac - using Cmd key');
} else {
  console.log('Running on Windows/Linux - using Ctrl key');
}
```

## 🎯 Custom Command Implementation

To make custom shortcuts work, you need to implement the command:

```tsx
function MyEditor() {
  const editorRef = useRef<SlideEditorRef>(null);
  
  // Implement custom command handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for custom shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        
        // Execute custom command
        saveDocument(editorRef.current?.getJSON());
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <SlideEditor
      ref={editorRef}
      content={content}
      keyboardShortcuts={{
        custom: {
          'Mod-s': {
            key: 'Mod-s',
            command: 'saveDocument',
            description: 'Save document',
            category: 'File'
          }
        }
      }}
    />
  );
}
```

## 📊 Shortcut Categories

Default categories used in help modal:

- **Formatting** - Text formatting shortcuts
- **History** - Undo/redo shortcuts
- **Selection** - Selection manipulation
- **Slides** - Slide navigation (presentation mode)
- **Help** - Help and documentation

Add your own categories:

```tsx
keyboardShortcuts={{
  custom: {
    'Mod-s': {
      key: 'Mod-s',
      command: 'save',
      description: 'Save document',
      category: 'File'  // Custom category
    }
  }
}}
```

## 🧪 Testing Shortcuts

Test shortcuts in the demo:

```bash
cd demo
npm run dev
```

Try:
- All default shortcuts
- Custom shortcuts
- Disabling shortcuts
- Help modal (Shift+?)
- Platform-specific display (Cmd vs Ctrl)

## 🎨 Styling Help Modal

Customize the help modal appearance:

```css
/* Override help modal styles */
.keyboard-shortcuts-modal {
  background: rgba(0, 0, 0, 0.8);
}

.keyboard-shortcuts-content {
  background: white;
  border-radius: 12px;
}

.keyboard-shortcuts-category {
  border-bottom: 1px solid #eee;
  padding: 16px;
}

.keyboard-shortcut-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.keyboard-shortcut-key {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}
```

## 📚 Related Documentation

- [Components Documentation](../components/README.md) - Using shortcuts in components
- [Commands Documentation](../commands/README.md) - Available commands
- [Types Documentation](../types/README.md) - Type definitions
- [Main README](../../README.md)

---

For more examples, see the [demo application](../../demo/README.md).

