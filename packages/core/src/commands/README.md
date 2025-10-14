# Commands API

The Commands API provides a comprehensive, programmatic interface for controlling the editor. All commands are null-safe and return boolean values indicating success or failure.

## 📁 Files

```
commands/
└── index.ts    # Complete commands implementation (~675 lines)
```

## 🎯 Overview

The Commands API includes **70+ commands** organized into categories:

1. **Text Formatting** - Bold, italic, colors, etc.
2. **Headings** - Set and toggle heading levels
3. **Links** - Add, update, and remove links
4. **Lists** - Bullet and ordered lists (planned)
5. **Media** - Insert images and videos
6. **Slides** - Add, delete, duplicate slides
7. **Navigation** - Navigate between slides
8. **Layouts** - Change column layouts
9. **History** - Undo, redo, clear history
10. **Selection** - Select, collapse, expand
11. **Focus** - Focus and blur editor
12. **Content** - Clear content
13. **Chaining** - Chain multiple commands

## 📖 API Reference

### Text Formatting

#### `toggleBold()`
Toggle bold formatting on selected text.
```tsx
editor.commands.toggleBold();
```

#### `toggleItalic()`
Toggle italic formatting on selected text.
```tsx
editor.commands.toggleItalic();
```

#### `toggleUnderline()`
Toggle underline on selected text.
```tsx
editor.commands.toggleUnderline();
```

#### `toggleStrikethrough()`
Toggle strikethrough on selected text.
```tsx
editor.commands.toggleStrikethrough();
```

#### `toggleCode()`
Toggle inline code formatting.
```tsx
editor.commands.toggleCode();
```

#### `setTextColor(color: string)`
Set text color of selected text.
```tsx
editor.commands.setTextColor('#ff0000');
editor.commands.setTextColor('rgb(255, 0, 0)');
```

#### `setHighlight(color: string)`
Set background highlight color.
```tsx
editor.commands.setHighlight('#ffff00');
```

#### `removeTextColor()`
Remove text color from selection.
```tsx
editor.commands.removeTextColor();
```

#### `removeHighlight()`
Remove highlight from selection.
```tsx
editor.commands.removeHighlight();
```

---

### Headings

#### `setHeading(level: 1 | 2 | 3 | 4 | 5 | 6)`
Convert current block to heading.
```tsx
editor.commands.setHeading(1); // H1
editor.commands.setHeading(2); // H2
```

#### `toggleHeading(level: 1 | 2 | 3 | 4 | 5 | 6)`
Toggle heading level (converts to paragraph if already at that level).
```tsx
editor.commands.toggleHeading(1); // Toggle H1
```

#### `setParagraph()`
Convert current block to paragraph.
```tsx
editor.commands.setParagraph();
```

---

### Links

#### `setLink(href: string, title?: string)`
Add link to selected text.
```tsx
editor.commands.setLink('https://example.com', 'Example Site');
```

#### `updateLink(href: string, title?: string)`
Update existing link (same as setLink).
```tsx
editor.commands.updateLink('https://newurl.com');
```

#### `removeLink()`
Remove link from selection.
```tsx
editor.commands.removeLink();
```

---

### Lists

#### `toggleBulletList()`
Toggle bullet list (planned feature).
```tsx
editor.commands.toggleBulletList();
```

#### `toggleOrderedList()`
Toggle ordered list (planned feature).
```tsx
editor.commands.toggleOrderedList();
```

---

### Media

#### `insertImage(attrs)`
Insert an image.
```tsx
editor.commands.insertImage({
  src: 'https://example.com/image.jpg',
  alt: 'Description',
  width: 500
});
```

Parameters:
```typescript
interface ImageAttrs {
  src: string;
  alt?: string;
  width?: number | string;
}
```

#### `insertVideo(attrs)`
Insert a video embed.
```tsx
editor.commands.insertVideo({
  src: 'https://youtube.com/watch?v=xxxxx',
  provider: 'youtube',
  aspectRatio: '16:9'
});
```

Parameters:
```typescript
interface VideoAttrs {
  src: string;
  provider?: 'youtube' | 'vimeo' | 'embed';
  aspectRatio?: '16:9' | '4:3' | '1:1';
}
```

---

### Slides

#### `addSlide(position?: 'before' | 'after' | 'end')`
Add a new slide.
```tsx
editor.commands.addSlide('end');      // Add at end
editor.commands.addSlide('before');   // Add before current
editor.commands.addSlide('after');    // Add after current
```

#### `deleteSlide(slideIndex?: number)`
Delete a slide.
```tsx
editor.commands.deleteSlide();   // Delete current slide
editor.commands.deleteSlide(2);  // Delete slide at index 2
```

#### `duplicateSlide(slideIndex?: number)`
Duplicate a slide.
```tsx
editor.commands.duplicateSlide();   // Duplicate current
editor.commands.duplicateSlide(1);  // Duplicate slide 1
```

---

### Navigation

#### `nextSlide(options?: NavigationOptions)`
Navigate to next slide.
```tsx
editor.commands.nextSlide();
editor.commands.nextSlide({ 
  transition: 'fade', 
  duration: 500 
});
```

#### `prevSlide(options?: NavigationOptions)`
Navigate to previous slide.
```tsx
editor.commands.prevSlide();
```

#### `goToSlide(slideIndex: number, options?: NavigationOptions)`
Navigate to specific slide.
```tsx
editor.commands.goToSlide(3);
```

#### `goToFirstSlide(options?: NavigationOptions)`
Navigate to first slide.
```tsx
editor.commands.goToFirstSlide();
```

#### `goToLastSlide(options?: NavigationOptions)`
Navigate to last slide.
```tsx
editor.commands.goToLastSlide();
```

#### `canGoNext(circular?: boolean): boolean`
Check if can navigate to next slide.
```tsx
const canNext = editor.commands.canGoNext();
const canNextCircular = editor.commands.canGoNext(true);
```

#### `canGoPrev(circular?: boolean): boolean`
Check if can navigate to previous slide.
```tsx
const canPrev = editor.commands.canGoPrev();
```

#### `getSlideInfo(): SlideInfo`
Get current slide information.
```tsx
const info = editor.commands.getSlideInfo();
// {
//   index: 2,
//   total: 5,
//   isFirst: false,
//   isLast: false,
//   canGoNext: true,
//   canGoPrev: true
// }
```

---

### Layouts

#### `setLayout(layout: string)`
Set column layout for current row.
```tsx
editor.commands.setLayout('2-1');     // 66.66% / 33.33%
editor.commands.setLayout('1-1-1');   // Three equal columns
editor.commands.setLayout('5-3-2');   // Custom ratios
```

---

### History

#### `undo()`
Undo last change.
```tsx
editor.commands.undo();
```

#### `redo()`
Redo last undone change.
```tsx
editor.commands.redo();
```

#### `canUndo(): boolean`
Check if undo is available.
```tsx
const canUndo = editor.commands.canUndo();
```

#### `canRedo(): boolean`
Check if redo is available.
```tsx
const canRedo = editor.commands.canRedo();
```

#### `getUndoDepth(): number`
Get number of undo steps.
```tsx
const undoSteps = editor.commands.getUndoDepth();
```

#### `getRedoDepth(): number`
Get number of redo steps.
```tsx
const redoSteps = editor.commands.getRedoDepth();
```

#### `getHistoryState(): HistoryState`
Get complete history state.
```tsx
const state = editor.commands.getHistoryState();
// {
//   canUndo: true,
//   canRedo: false,
//   undoDepth: 5,
//   redoDepth: 0
// }
```

#### `clearHistory()`
Clear undo/redo history.
```tsx
editor.commands.clearHistory();
```

---

### Selection

#### `setSelection(from: number, to?: number)`
Set text selection.
```tsx
editor.commands.setSelection(0, 10);  // Select chars 0-10
editor.commands.setSelection(5);       // Place cursor at 5
```

#### `selectSlide(slideIndex: number)`
Select entire slide.
```tsx
editor.commands.selectSlide(0);  // Select first slide
```

#### `selectAll()`
Select entire document.
```tsx
editor.commands.selectAll();
```

#### `collapseSelection(toStart?: boolean)`
Collapse selection to cursor.
```tsx
editor.commands.collapseSelection(true);   // To start
editor.commands.collapseSelection(false);  // To end
```

#### `expandSelection()`
Expand selection to parent node.
```tsx
editor.commands.expandSelection();
```

#### `getSelectedText(): string`
Get selected text content.
```tsx
const text = editor.commands.getSelectedText();
```

#### `isSelectionEmpty(): boolean`
Check if selection is empty (cursor only).
```tsx
const isEmpty = editor.commands.isSelectionEmpty();
```

#### `isAtStart(): boolean`
Check if cursor is at document start.
```tsx
const atStart = editor.commands.isAtStart();
```

#### `isAtEnd(): boolean`
Check if cursor is at document end.
```tsx
const atEnd = editor.commands.isAtEnd();
```

---

### Focus

#### `focus()`
Focus the editor.
```tsx
editor.commands.focus();
```

#### `blur()`
Blur (unfocus) the editor.
```tsx
editor.commands.blur();
```

---

### Content

#### `deleteSelection()`
Delete currently selected content.
```tsx
editor.commands.deleteSelection();
```

#### `clearContent()`
Clear all content (caution!).
```tsx
if (confirm('Clear all content?')) {
  editor.commands.clearContent();
}
```

---

### Chaining

#### `chain()`
Create a chainable command sequence.
```tsx
// Execute multiple commands in sequence
editor.commands
  .chain()
  .selectAll()
  .toggleBold()
  .setTextColor('#ff0000')
  .run();  // Execute all commands

// Stops on first failure
const success = editor.commands
  .chain()
  .setHeading(1)
  .toggleBold()
  .run();
```

All commands return `ChainedCommands` for further chaining, except `run()` which executes and returns `boolean`.

---

## 🎯 Usage Patterns

### Basic Usage

```tsx
function Toolbar({ editorRef }) {
  const handleBold = () => {
    editorRef.current?.commands.toggleBold();
  };
  
  return <button onClick={handleBold}>Bold</button>;
}
```

### With Return Values

```tsx
function SmartButton({ editorRef }) {
  const handleBold = () => {
    const success = editorRef.current?.commands.toggleBold();
    if (success) {
      toast.success('Text is now bold');
    } else {
      toast.error('Could not apply bold');
    }
  };
  
  return <button onClick={handleBold}>Bold</button>;
}
```

### Conditional Commands

```tsx
function UndoButton({ editorRef }) {
  const [canUndo, setCanUndo] = useState(false);
  
  useEffect(() => {
    const updateState = () => {
      setCanUndo(editorRef.current?.commands.canUndo() ?? false);
    };
    // Update on changes
  }, []);
  
  return (
    <button 
      onClick={() => editorRef.current?.commands.undo()}
      disabled={!canUndo}
    >
      Undo
    </button>
  );
}
```

### Command Chaining

```tsx
function FormatButton({ editorRef }) {
  const applyFormatting = () => {
    editorRef.current?.commands
      .chain()
      .selectAll()
      .setHeading(1)
      .toggleBold()
      .setTextColor('#333333')
      .run();
  };
  
  return <button onClick={applyFormatting}>Format Title</button>;
}
```

### Complex Workflows

```tsx
function CreateTitleSlide({ editorRef }) {
  const createSlide = () => {
    const commands = editorRef.current?.commands;
    if (!commands) return;
    
    // Add new slide
    commands.addSlide('end');
    
    // Navigate to it
    const total = editorRef.current.getTotalSlides();
    commands.goToSlide(total - 1);
    
    // Set up content
    commands
      .chain()
      .setHeading(1)
      .run();
  };
  
  return <button onClick={createSlide}>Create Title Slide</button>;
}
```

## 🔒 Null Safety

All commands handle null/undefined editor views gracefully:

```typescript
const exec = (fn: () => boolean): boolean => {
  try {
    const v = view();
    if (!v) {
      console.warn('[AutoArtifacts] Command failed: editor not initialized');
      return false;
    }
    return fn();
  } catch (e) {
    console.warn('[AutoArtifacts] Command failed:', e);
    return false;
  }
};
```

Commands will:
- Return `false` if editor is not initialized
- Log a warning to console
- Never throw exceptions
- Safe to call even if editor is destroyed

## ⚡ Performance

Commands are executed synchronously and optimized for performance:

1. **Lazy Evaluation**: Commands don't execute until called
2. **Single Transaction**: Each command creates one ProseMirror transaction
3. **Chaining Optimization**: Chained commands execute in sequence, stopping on first failure
4. **No Re-renders**: Commands don't trigger React re-renders directly

## 🧪 Testing

Test commands using the demo application:

```bash
cd demo
npm run dev
```

The demo includes:
- Toolbar with all formatting commands
- Slide management buttons
- Navigation controls
- History controls
- Test cases for edge cases

## 🔧 Extending

### Adding Custom Commands

You can extend the commands by wrapping the editor ref:

```typescript
interface CustomCommands extends Commands {
  customBold: () => boolean;
  formatTitle: () => boolean;
}

function useCustomCommands(editorRef: RefObject<SlideEditorRef>): CustomCommands {
  return {
    ...editorRef.current?.commands,
    
    customBold: () => {
      // Custom bold logic
      return editorRef.current?.commands
        .chain()
        .toggleBold()
        .setTextColor('#000000')
        .run() ?? false;
    },
    
    formatTitle: () => {
      return editorRef.current?.commands
        .chain()
        .setHeading(1)
        .toggleBold()
        .setTextColor('#333')
        .run() ?? false;
    }
  };
}
```

## 📚 Related Documentation

- [Components Documentation](../components/README.md)
- [Types Documentation](../types/README.md) - Full type definitions
- [Utils Documentation](../utils/README.md) - Underlying utilities
- [Main README](../../README.md)

---

For more examples, see the [demo application](../../demo/README.md).

