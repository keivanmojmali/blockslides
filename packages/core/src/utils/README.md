# Utils

Utility functions that provide reusable functionality for the editor. These utilities are used internally by the components and commands, and some are exported for external use.

## 📁 Files

```
utils/
├── exporters.ts          # Content export utilities (JSON, HTML, MD, text)
├── historyUtils.ts       # Undo/redo history utilities
├── layoutParser.ts       # Column layout parsing and application
├── selectionUtils.ts     # Text selection manipulation
├── slideNavigation.ts    # Slide navigation and visibility
└── stateAccess.ts        # Editor state access methods
```

## 🎯 Utilities Overview

### exporters.ts

Export content to different formats.

#### `exportToJSON(content, pretty?)`
Export to JSON string.
```typescript
function exportToJSON(
  content: DocNode,
  pretty?: boolean
): string

// Usage
const json = exportToJSON(content, true);  // Pretty-printed
```

#### `exportToHTML(content, options?)`
Export to HTML string.
```typescript
interface HTMLExportOptions {
  includeStyles?: boolean;
  slideNumbers?: boolean;
}

function exportToHTML(
  content: DocNode,
  options?: HTMLExportOptions
): string

// Usage
const html = exportToHTML(content, {
  includeStyles: true,
  slideNumbers: true
});
```

#### `exportToMarkdown(content)`
Export to Markdown string.
```typescript
function exportToMarkdown(content: DocNode): string

// Usage
const markdown = exportToMarkdown(content);
```

#### `exportToText(content)`
Export to plain text (no formatting).
```typescript
function exportToText(content: DocNode): string

// Usage
const text = exportToText(content);
```

#### `downloadFile(content, filename, mimeType)`
Trigger browser download of content.
```typescript
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void

// Usage
downloadFile(html, 'presentation.html', 'text/html');
```

---

### historyUtils.ts

Utilities for accessing and managing undo/redo history.

#### `canUndo(view)`
Check if undo is available.
```typescript
function canUndo(view: EditorView): boolean

// Usage
const canUndoNow = canUndo(editorView);
```

#### `canRedo(view)`
Check if redo is available.
```typescript
function canRedo(view: EditorView): boolean

// Usage
const canRedoNow = canRedo(editorView);
```

#### `getUndoDepth(view)`
Get number of undo steps.
```typescript
function getUndoDepth(view: EditorView): number

// Usage
const steps = getUndoDepth(editorView);
console.log(`${steps} undo steps available`);
```

#### `getRedoDepth(view)`
Get number of redo steps.
```typescript
function getRedoDepth(view: EditorView): number
```

#### `getHistoryState(view)`
Get complete history state.
```typescript
function getHistoryState(view: EditorView): HistoryState

interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  undoDepth: number;
  redoDepth: number;
}

// Usage
const state = getHistoryState(editorView);
console.log(`Can undo: ${state.canUndo}, depth: ${state.undoDepth}`);
```

#### `clearHistory(view)`
Clear all undo/redo history.
```typescript
function clearHistory(view: EditorView): boolean

// Usage
clearHistory(editorView);
```

---

### layoutParser.ts

Parse and apply column layout ratios.

#### `parseLayout(layout)`
Parse layout string into column widths.
```typescript
function parseLayout(layout: string): number[]

// Examples
parseLayout('1')       // [100]
parseLayout('1-1')     // [50, 50]
parseLayout('2-1')     // [66.66, 33.33]
parseLayout('1-1-1')   // [33.33, 33.33, 33.33]
parseLayout('5-3-2')   // [50, 30, 20]
```

#### `applyLayout(rowElement, layout)`
Apply layout to a row element.
```typescript
function applyLayout(
  rowElement: HTMLElement,
  layout: string
): void

// Usage
const row = document.querySelector('[data-node-type="row"]');
applyLayout(row, '2-1');
```

#### `applyAllLayouts(container)`
Apply all layouts in container.
```typescript
function applyAllLayouts(container: HTMLElement): void

// Usage - typically called after content updates
applyAllLayouts(editorElement);
```

**Layout Validation:**
- Validates ratio counts match column counts
- Falls back to equal widths if mismatch
- Logs warnings for invalid layouts

---

### selectionUtils.ts

Utilities for manipulating text selection.

#### `getSelectionInfo(view)`
Get detailed selection information.
```typescript
function getSelectionInfo(view: EditorView): SelectionInfo

interface SelectionInfo {
  from: number;
  to: number;
  empty: boolean;
  text: string;
  isAtStart: boolean;
  isAtEnd: boolean;
  marks: string[];
  nodeType?: string;
}

// Usage
const info = getSelectionInfo(editorView);
if (info.empty) {
  console.log('No selection');
} else {
  console.log(`Selected: "${info.text}"`);
}
```

#### `setTextSelection(view, from, to?)`
Set text selection programmatically.
```typescript
function setTextSelection(
  view: EditorView,
  from: number,
  to?: number
): boolean

// Usage
setTextSelection(editorView, 0, 10);  // Select chars 0-10
setTextSelection(editorView, 5);      // Place cursor at 5
```

#### `selectAll(view)`
Select entire document.
```typescript
function selectAll(view: EditorView): boolean

// Usage
selectAll(editorView);
```

#### `selectSlide(view, slideIndex)`
Select entire slide.
```typescript
function selectSlide(
  view: EditorView,
  slideIndex: number
): boolean

// Usage
selectSlide(editorView, 0);  // Select first slide
```

#### `collapseSelection(view, toStart?)`
Collapse selection to cursor.
```typescript
function collapseSelection(
  view: EditorView,
  toStart?: boolean
): boolean

// Usage
collapseSelection(editorView, true);   // To start
collapseSelection(editorView, false);  // To end
```

#### `expandSelection(view)`
Expand selection to parent node.
```typescript
function expandSelection(view: EditorView): boolean

// Usage
expandSelection(editorView);
```

#### `getSelectedText(view)`
Get selected text content.
```typescript
function getSelectedText(view: EditorView): string

// Usage
const text = getSelectedText(editorView);
console.log(`Selected: ${text}`);
```

#### `isSelectionEmpty(view)`
Check if selection is empty.
```typescript
function isSelectionEmpty(view: EditorView): boolean

// Usage
if (isSelectionEmpty(editorView)) {
  console.log('Cursor only, no selection');
}
```

#### `isAtDocStart(view)` / `isAtDocEnd(view)`
Check cursor position.
```typescript
function isAtDocStart(view: EditorView): boolean
function isAtDocEnd(view: EditorView): boolean

// Usage
if (isAtDocStart(editorView)) {
  console.log('At start of document');
}
```

---

### slideNavigation.ts

Utilities for navigating and managing slides.

#### `showSlide(container, index)`
Show specific slide, hide others.
```typescript
function showSlide(
  container: HTMLElement,
  slideIndex: number
): void

// Usage
showSlide(editorElement, 2);  // Show slide 2
```

#### `showAllSlides(container)`
Show all slides.
```typescript
function showAllSlides(container: HTMLElement): void

// Usage
showAllSlides(editorElement);
```

#### `nextSlide(container, onSlideChange?, options?)`
Navigate to next slide.
```typescript
interface NavigationOptions {
  circular?: boolean;
  transition?: 'none' | 'fade' | 'slide' | 'zoom';
  duration?: number;
}

function nextSlide(
  container: HTMLElement,
  onSlideChange?: (index: number) => void,
  options?: NavigationOptions
): void

// Usage
nextSlide(editorElement, (index) => {
  console.log(`Now on slide ${index}`);
});
```

#### `prevSlide(container, onSlideChange?, options?)`
Navigate to previous slide.
```typescript
function prevSlide(
  container: HTMLElement,
  onSlideChange?: (index: number) => void,
  options?: NavigationOptions
): void
```

#### `goToSlide(container, index, onSlideChange?, options?)`
Navigate to specific slide.
```typescript
function goToSlide(
  container: HTMLElement,
  slideIndex: number,
  onSlideChange?: (index: number) => void,
  options?: NavigationOptions
): void

// Usage
goToSlide(editorElement, 3);  // Go to slide 3
```

#### `getCurrentSlideIndex(container)`
Get current visible slide index.
```typescript
function getCurrentSlideIndex(container: HTMLElement): number

// Usage
const current = getCurrentSlideIndex(editorElement);
console.log(`Current slide: ${current}`);
```

#### `getSlideCount(container)`
Get total number of slides.
```typescript
function getSlideCount(container: HTMLElement): number

// Usage
const total = getSlideCount(editorElement);
```

#### `canGoNext(container, circular?)`
Check if can navigate to next slide.
```typescript
function canGoNext(
  container: HTMLElement,
  circular?: boolean
): boolean

// Usage
if (canGoNext(editorElement)) {
  nextSlide(editorElement);
}
```

#### `canGoPrev(container, circular?)`
Check if can navigate to previous slide.
```typescript
function canGoPrev(
  container: HTMLElement,
  circular?: boolean
): boolean
```

#### `getSlideInfo(container)`
Get complete slide information.
```typescript
interface SlideInfo {
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
}

function getSlideInfo(container: HTMLElement): SlideInfo

// Usage
const info = getSlideInfo(editorElement);
console.log(`Slide ${info.index + 1} of ${info.total}`);
```

---

### stateAccess.ts

Utilities for accessing editor state information.

#### `getCurrentSlideIndex(view)`
Get current slide index from editor view.
```typescript
function getCurrentSlideIndex(view: EditorView): number
```

#### `getTotalSlides(view)`
Get total number of slides.
```typescript
function getTotalSlides(view: EditorView): number
```

#### `getSlideContent(view, index)`
Get content of specific slide.
```typescript
function getSlideContent(
  view: EditorView,
  slideIndex: number
): SlideNode | null

// Usage
const slide = getSlideContent(editorView, 0);
if (slide) {
  console.log('First slide:', slide);
}
```

#### `getDocumentJSON(view)`
Get entire document as JSON.
```typescript
function getDocumentJSON(view: EditorView): DocNode

// Usage
const json = getDocumentJSON(editorView);
```

#### `getDocumentHTML(view)`
Get document as HTML string.
```typescript
function getDocumentHTML(view: EditorView): string

// Usage
const html = getDocumentHTML(editorView);
```

#### `getDocumentText(view)`
Get document as plain text.
```typescript
function getDocumentText(view: EditorView): string

// Usage
const text = getDocumentText(editorView);
console.log(`Character count: ${text.length}`);
```

#### `isDocumentEmpty(view)`
Check if document is empty.
```typescript
function isDocumentEmpty(view: EditorView): boolean

// Usage
if (isDocumentEmpty(editorView)) {
  console.log('Empty document');
}
```

#### `isEditorFocused(view)`
Check if editor has focus.
```typescript
function isEditorFocused(view: EditorView): boolean

// Usage
if (isEditorFocused(editorView)) {
  console.log('Editor is focused');
}
```

---

## 🎯 Common Usage Patterns

### Building a Slide Counter

```tsx
function SlideCounter({ editorRef }) {
  const [info, setInfo] = useState({ current: 0, total: 0 });
  
  useEffect(() => {
    if (editorRef.current?.view) {
      const view = editorRef.current.view;
      setInfo({
        current: getCurrentSlideIndex(view),
        total: getTotalSlides(view)
      });
    }
  }, [editorRef]);
  
  return <div>Slide {info.current + 1} / {info.total}</div>;
}
```

### Building Undo/Redo UI

```tsx
function HistoryControls({ editorRef }) {
  const [state, setState] = useState({ canUndo: false, canRedo: false });
  
  useEffect(() => {
    if (editorRef.current?.view) {
      setState(getHistoryState(editorRef.current.view));
    }
  }, []);
  
  return (
    <>
      <button
        onClick={() => editorRef.current?.commands.undo()}
        disabled={!state.canUndo}
      >
        Undo
      </button>
      <button
        onClick={() => editorRef.current?.commands.redo()}
        disabled={!state.canRedo}
      >
        Redo
      </button>
    </>
  );
}
```

### Exporting Content

```tsx
function ExportButtons({ editorRef }) {
  const handleExport = (format: ExportFormat) => {
    const view = editorRef.current?.view;
    if (!view) return;
    
    const content = getDocumentJSON(view);
    
    switch (format) {
      case 'json':
        const json = exportToJSON(content, true);
        downloadFile(json, 'presentation.json', 'application/json');
        break;
      case 'html':
        const html = exportToHTML(content, { includeStyles: true });
        downloadFile(html, 'presentation.html', 'text/html');
        break;
      case 'markdown':
        const md = exportToMarkdown(content);
        downloadFile(md, 'presentation.md', 'text/markdown');
        break;
    }
  };
  
  return (
    <>
      <button onClick={() => handleExport('json')}>Export JSON</button>
      <button onClick={() => handleExport('html')}>Export HTML</button>
      <button onClick={() => handleExport('markdown')}>Export Markdown</button>
    </>
  );
}
```

## 🔒 Safety & Error Handling

All utilities are null-safe and handle errors gracefully:

```typescript
// Will not throw if view is null
const text = editorRef.current?.view 
  ? getDocumentText(editorRef.current.view)
  : '';

// Returns false instead of throwing
const success = setTextSelection(view, 0, 10);
if (!success) {
  console.log('Selection failed');
}
```

## 📚 Related Documentation

- [Commands Documentation](../commands/README.md) - Uses these utilities
- [Components Documentation](../components/README.md) - Uses these utilities
- [Types Documentation](../types/README.md) - Type definitions
- [Main README](../../README.md)

---

For more examples, see the [demo application](../../demo/README.md).

