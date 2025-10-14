# Components

This directory contains the React components that make up the AutoArtifacts editor UI.

## 📁 Files

```
components/
├── SlideEditor.tsx           # Main editor component (700+ lines)
└── KeyboardShortcutsHelp.tsx # Keyboard shortcuts help modal
```

## 🎯 Components Overview

### SlideEditor

The main editor component that integrates ProseMirror with React.

**File**: `SlideEditor.tsx`  
**Lines**: ~710  
**Complexity**: High  

#### Responsibilities

1. **ProseMirror Integration**: Creates and manages ProseMirror EditorView
2. **State Management**: Handles both controlled and uncontrolled modes
3. **Ref API**: Exposes comprehensive API through React refs
4. **Event System**: Fires lifecycle and content change events
5. **Validation**: Validates content before rendering
6. **Layout Management**: Applies column layouts to rendered content
7. **Slide Navigation**: Manages slide visibility and navigation
8. **Keyboard Shortcuts**: Implements keyboard navigation and help

#### Usage

**Basic (Controlled)**:
```tsx
import { SlideEditor } from 'autoartifacts';

function App() {
  const [content, setContent] = useState(myContent);
  
  return (
    <SlideEditor
      content={content}
      onChange={setContent}
      slideTheme="dark"
    />
  );
}
```

**With Ref API**:
```tsx
import { useRef } from 'react';
import { SlideEditor, SlideEditorRef } from 'autoartifacts';

function App() {
  const editorRef = useRef<SlideEditorRef>(null);
  
  const handleBold = () => {
    editorRef.current?.commands.toggleBold();
  };
  
  return (
    <>
      <button onClick={handleBold}>Bold</button>
      <SlideEditor ref={editorRef} content={content} />
    </>
  );
}
```

**Uncontrolled Mode**:
```tsx
const [content, setContent] = useState(initialContent);

<SlideEditor
  content={content}
  onChange={setContent}
  onContentChange={({ content }) => {
    console.log('Content changed:', content);
  }}
/>
```

#### Props

See [`SlideEditorProps`](../types/README.md#slideeditorprops) for complete type definition.

**Core Props**:
- `content`: DocNode - Editor content (required, serves as initial content)
- `onChange`: (content: DocNode) => void - Change handler (optional, for tracking updates)

**Appearance Props**:
- `editorTheme`: 'light' | 'dark' | 'presentation' | string
- `slideTheme`: string - Theme applied to all slides
- `editorStyles`: string - Additional CSS classes

**Behavior Props**:
- `editorMode`: 'edit' | 'present' | 'preview'
- `readOnly`: boolean - Make editor read-only
- `currentSlide`: number - Current slide index (for present mode)

**Event Props**:
- `onCreate`: Fired when editor is created
- `onUpdate`: Fired on any transaction that changes content
- `onContentChange`: Fired when content changes
- `onSelectionUpdate`: Fired when selection changes
- `onFocus`, `onBlur`: Focus events
- `onTransaction`: Fired on every transaction
- `onUndo`, `onRedo`: Fired on history operations
- `onSlideChange`: Fired when slide changes
- `onError`: Fired on errors

**Configuration Props**:
- `historyDepth`: number - Max undo steps (default: 100)
- `newGroupDelay`: number - Undo grouping delay (default: 500ms)
- `validationMode`: 'strict' | 'lenient' | 'off' - Validation mode
- `autoFixContent`: boolean - Auto-fix validation issues
- `keyboardShortcuts`: Customize keyboard shortcuts
- `showShortcutsHelp`: Show help modal on mount

#### Ref API

The component exposes a comprehensive API through refs:

```typescript
interface SlideEditorRef {
  view: EditorView;                    // Raw ProseMirror view
  
  // Editability
  setEditable(editable: boolean): void;
  isEditable(): boolean;
  
  // State Access
  getCurrentSlide(): number;
  getTotalSlides(): number;
  getSlideContent(index: number): SlideNode | null;
  getJSON(): DocNode;
  getHTML(): string;
  getText(): string;
  isEmpty(): boolean;
  isFocused(): boolean;
  getSelection(): SelectionInfo | null;
  
  // Commands (70+ commands)
  commands: Commands;
  
  // History
  canUndo(): boolean;
  canRedo(): boolean;
  getHistoryState(): HistoryState;
  
  // Validation
  validator: ContentValidator;
  
  // Content Management
  setContent(content: DocNode): void;
  
  // Export
  exportAs(format: ExportFormat, options?: ExportOptions): string;
  downloadAs(format: ExportFormat, filename: string, options?: ExportOptions): void;
  
  // Utilities
  destroy(): void;
  getElement(): HTMLElement | null;
}
```

#### Internal Architecture

**Key Effects**:

1. **Main Editor Effect** (`lines 410-612`):
   - Creates ProseMirror EditorView
   - Validates content
   - Sets up plugins (history, keymap)
   - Handles transactions and events
   - Applies layouts after render

2. **Layout Re-application** (`lines 614-625`):
   - Re-applies layouts when content changes
   - Debounced with setTimeout

3. **Slide Visibility** (`lines 627-638`):
   - Shows/hides slides based on editor mode
   - In 'present' mode: shows only current slide
   - In 'edit'/'preview' modes: shows all slides

4. **Slide Change Detection** (`lines 640-649`):
   - Detects slide changes
   - Fires onSlideChange callback

5. **Keyboard Navigation** (`lines 651-679`):
   - Arrow keys, space, Home, End for slide navigation
   - Only active in 'present' mode

6. **Editable State Sync** (`lines 681-691`):
   - Syncs editable state with props
   - Updates on editorMode or readOnly changes

**Transaction Flow**:

```
User Action → ProseMirror Transaction → dispatchTransaction
                                              ↓
                                    onTransaction callback
                                              ↓
                              (if docChanged) onUpdate callback
                                              ↓
                    (if controlled) onChange(newContent)
                    (if uncontrolled) setInternalContent
                                              ↓
                                  onContentChange callback
                                              ↓
                    (if selection changed) onSelectionUpdate
                                              ↓
                        (if undo/redo) onUndo/onRedo
```

**Event Dispatching**:

All events receive the editor ref as first parameter:
```typescript
onCreate({ editor: SlideEditorRef })
onUpdate({ editor, transaction })
onContentChange({ editor, content })
onSelectionUpdate({ editor, selection })
```

#### Validation

Content is validated before rendering:

```typescript
if (validationMode !== 'off') {
  const result = validateContentFn(content, {
    mode: validationMode,
    autoFix: autoFixContent,
    throwOnError: false
  });
  
  if (!result.valid) {
    // Fire onValidationError
    // Use fixed content if autoFix enabled
    // In strict mode, don't create editor
  }
}
```

#### Keyboard Shortcuts

Built-in shortcuts (customizable):
- `Mod-z`: Undo
- `Mod-y` / `Mod-Shift-z`: Redo
- `Shift-?`: Toggle shortcuts help
- `Escape`: Close help modal

In presentation mode:
- `Arrow Right/Down/Space`: Next slide
- `Arrow Left/Up`: Previous slide
- `Home`: First slide
- `End`: Last slide

---

### KeyboardShortcutsHelp

Modal component displaying available keyboard shortcuts.

**File**: `KeyboardShortcutsHelp.tsx`  

#### Responsibilities

1. Display all active keyboard shortcuts
2. Group shortcuts by category
3. Show platform-specific key names (Cmd vs Ctrl)
4. Provide close functionality

#### Usage

```tsx
import { KeyboardShortcutsHelp } from 'autoartifacts';
import { DEFAULT_SHORTCUTS } from 'autoartifacts';

function App() {
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowHelp(true)}>
        Show Shortcuts
      </button>
      
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

#### Props

```typescript
interface KeyboardShortcutsHelpProps {
  shortcuts: Record<string, KeyboardShortcut>;
  onClose: () => void;
}

interface KeyboardShortcut {
  key: string;          // e.g., 'Mod-b'
  command: string;      // Command name
  description: string;  // Human-readable description
  category?: string;    // Category for grouping
}
```

#### Features

- **Platform Detection**: Shows `⌘` on Mac, `Ctrl` on Windows/Linux
- **Categorization**: Groups shortcuts by category
- **Search**: (future) Filter shortcuts
- **Responsive**: Works on mobile and desktop

#### Styling

The component uses CSS classes:
- `.keyboard-shortcuts-modal`: Modal container
- `.keyboard-shortcuts-overlay`: Dark overlay
- `.keyboard-shortcuts-content`: Modal content
- `.keyboard-shortcuts-category`: Category section
- `.keyboard-shortcut-item`: Individual shortcut

---

## 🎨 Styling

Both components use the main `styles.css` file for styling.

**Key CSS Classes**:

```css
/* Editor container */
.autoartifacts-editor { }

/* Theme variations */
.autoartifacts-editor.theme-light { }
.autoartifacts-editor.theme-dark { }
.autoartifacts-editor.theme-presentation { }

/* Mode variations */
.autoartifacts-editor.mode-edit { }
.autoartifacts-editor.mode-present { }
.autoartifacts-editor.mode-preview { }

/* Slide themes */
.autoartifacts-editor.slide-theme-default { }
.autoartifacts-editor.slide-theme-dark { }
.autoartifacts-editor.slide-theme-minimal { }
.autoartifacts-editor.slide-theme-gradient { }

/* Read-only state */
.autoartifacts-editor.read-only { }
```

## 🔄 Component Lifecycle

### SlideEditor Lifecycle

1. **Mount**:
   - Props validation (controlled/uncontrolled check)
   - Create ProseMirror state from content
   - Create EditorView
   - Apply layouts
   - Fire `onCreate` callback

2. **Update** (content changes):
   - Re-create editor if content changes (controlled mode)
   - Re-apply layouts
   - Fire `onUpdate` callback

3. **Unmount**:
   - Fire `onDestroy` callback
   - Destroy EditorView
   - Clean up event listeners

## 🧪 Testing

Test the components using the demo application:

```bash
cd demo
npm run dev
```

The demo includes:
- All component variations
- All props and callbacks
- Edge cases and error handling
- Performance testing

## 🔧 Extending

### Custom Themes

Add custom themes by passing a theme name:

```tsx
<SlideEditor slideTheme="custom-blue" />
```

Then add CSS:

```css
.autoartifacts-editor.slide-theme-custom-blue [data-node-type="slide"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### Custom Event Handlers

Intercept any event:

```tsx
<SlideEditor
  content={content}
  onTransaction={({ transaction }) => {
    console.log('Transaction meta:', transaction.getMeta('custom'));
  }}
  onUpdate={({ editor, transaction }) => {
    // Custom analytics
    trackEdit(editor.getJSON());
  }}
/>
```

## 📚 Related Documentation

- [Main README](../../README.md)
- [Hooks Documentation](../hooks/README.md)
- [Commands Documentation](../commands/README.md)
- [Types Documentation](../types/README.md)

---

For more examples, see the [demo application](../../demo/README.md).

