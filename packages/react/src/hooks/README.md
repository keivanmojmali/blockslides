# Hooks

Custom React hooks for working with the AutoArtifacts editor.

## 📁 Files

```
hooks/
├── useSlideEditor.ts    # Main editor hook
└── useHistoryState.ts   # History state hook
```

## 🎯 Hooks Overview

### useSlideEditor

A comprehensive React hook for managing SlideEditor instances with reactive state.

**File**: `useSlideEditor.ts`  

#### Purpose

Provides a modern, hooks-based API for working with the editor, automatically tracking editor state and providing reactive updates.

#### Usage

```tsx
import { useSlideEditor } from 'autoartifacts';

function MyEditor() {
  const { 
    ref, 
    editor, 
    isEmpty, 
    isFocused, 
    currentSlide, 
    totalSlides 
  } = useSlideEditor({
    content: myContent,
    editable: true,
    onUpdate: (content) => {
      console.log('Content updated:', content);
    },
    onCreate: (editor) => {
      console.log('Editor created:', editor);
    }
  });
  
  return (
    <div>
      <div>
        Slide {currentSlide + 1} of {totalSlides}
        {isEmpty && ' (empty)'}
        {isFocused && ' (focused)'}
      </div>
      <SlideEditor ref={ref} content={content} />
    </div>
  );
}
```

#### Options

```typescript
interface UseSlideEditorOptions {
  content: DocNode;                        // Editor content
  editable?: boolean;                      // Is editor editable?
  onUpdate?: (content: DocNode) => void;   // Update callback
  onCreate?: (editor: SlideEditorRef) => void;  // Create callback
  onDestroy?: () => void;                  // Destroy callback
}
```

#### Return Value

```typescript
interface UseSlideEditorReturn {
  ref: React.RefObject<SlideEditorRef>;  // Ref to pass to <SlideEditor>
  editor: SlideEditorRef | null;         // Editor instance (null until mounted)
  isEmpty: boolean;                      // Is document empty?
  isFocused: boolean;                    // Is editor focused?
  currentSlide: number;                  // Current slide index
  totalSlides: number;                   // Total number of slides
}
```

#### Implementation Details

**State Management**:
```typescript
const [editor, setEditor] = useState<SlideEditorRef | null>(null);
const [isEmpty, setIsEmpty] = useState(true);
const [isFocused, setIsFocused] = useState(false);
const [currentSlide, setCurrentSlide] = useState(0);
const [totalSlides, setTotalSlides] = useState(0);
```

**Initialization**:
- Uses `setTimeout` to delay initialization until editor is fully mounted
- Calls `onCreate` callback after initialization
- Updates all state from editor ref

**Updates**:
- Re-runs state update when `content` changes
- Callbacks stored in refs to avoid dependency issues

**Cleanup**:
- Calls `onDestroy` callback on unmount
- Cleans up timers

#### Example: Toolbar Component

```tsx
function EditorWithToolbar() {
  const [content, setContent] = useState(initialContent);
  
  const { 
    ref, 
    editor, 
    currentSlide, 
    totalSlides,
    isEmpty 
  } = useSlideEditor({
    content,
    onUpdate: setContent
  });
  
  const handleBold = () => {
    editor?.commands.toggleBold();
  };
  
  const handleAddSlide = () => {
    editor?.commands.addSlide('end');
  };
  
  const canUndo = editor?.canUndo() ?? false;
  const canRedo = editor?.canRedo() ?? false;
  
  return (
    <div>
      <Toolbar>
        <button onClick={handleBold}>Bold</button>
        <button onClick={handleAddSlide}>Add Slide</button>
        <button onClick={() => editor?.commands.undo()} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={() => editor?.commands.redo()} disabled={!canRedo}>
          Redo
        </button>
      </Toolbar>
      
      <div>
        Slide {currentSlide + 1} / {totalSlides}
        {isEmpty && ' - Empty document'}
      </div>
      
      <SlideEditor ref={ref} content={content} />
    </div>
  );
}
```

#### Example: Reactive UI

```tsx
function EditorStatus() {
  const { editor, isEmpty, isFocused, currentSlide, totalSlides } = useSlideEditor({
    content: myContent
  });
  
  // Reactive state automatically updates
  return (
    <div>
      <Badge color={isFocused ? 'green' : 'gray'}>
        {isFocused ? 'Focused' : 'Unfocused'}
      </Badge>
      
      {!isEmpty && (
        <div>
          {currentSlide + 1} / {totalSlides} slides
        </div>
      )}
      
      {isEmpty && <div>Start by adding some content...</div>}
    </div>
  );
}
```

#### When to Use

✅ **Use `useSlideEditor` when:**
- You need reactive state (isEmpty, isFocused, etc.)
- Building toolbar or status components
- Want automatic state updates on content changes
- Prefer hooks over refs

❌ **Use direct ref instead when:**
- You only need imperative commands
- Don't need reactive state updates
- Want minimal overhead

---

### useHistoryState

A hook for tracking undo/redo state reactively.

**File**: `useHistoryState.ts`  

#### Purpose

Provides reactive access to the editor's history state (undo/redo availability).

#### Usage

```tsx
import { useHistoryState } from 'autoartifacts';

function UndoRedoButtons() {
  const editorRef = useRef<SlideEditorRef>(null);
  const historyState = useHistoryState(editorRef);
  
  return (
    <div>
      <button
        onClick={() => editorRef.current?.commands.undo()}
        disabled={!historyState.canUndo}
      >
        Undo ({historyState.undoDepth})
      </button>
      
      <button
        onClick={() => editorRef.current?.commands.redo()}
        disabled={!historyState.canRedo}
      >
        Redo ({historyState.redoDepth})
      </button>
    </div>
  );
}
```

#### Parameters

```typescript
function useHistoryState(
  editorRef: React.RefObject<SlideEditorRef>
): HistoryState
```

#### Return Value

```typescript
interface HistoryState {
  canUndo: boolean;    // Can undo be performed?
  canRedo: boolean;    // Can redo be performed?
  undoDepth: number;   // Number of undo steps available
  redoDepth: number;   // Number of redo steps available
}
```

#### Implementation

The hook polls the editor's history state and updates when it changes:

```typescript
const [state, setState] = useState<HistoryState>({
  canUndo: false,
  canRedo: false,
  undoDepth: 0,
  redoDepth: 0
});

useEffect(() => {
  const updateState = () => {
    if (editorRef.current) {
      setState(editorRef.current.getHistoryState());
    }
  };
  
  // Update on transaction events
  // Set up interval or event listener
}, [editorRef]);
```

#### Example: Full History UI

```tsx
function HistoryPanel() {
  const editorRef = useRef<SlideEditorRef>(null);
  const { canUndo, canRedo, undoDepth, redoDepth } = useHistoryState(editorRef);
  
  return (
    <div className="history-panel">
      <div className="history-info">
        <div>Undo steps: {undoDepth}</div>
        <div>Redo steps: {redoDepth}</div>
      </div>
      
      <div className="history-actions">
        <button onClick={() => editorRef.current?.commands.undo()} disabled={!canUndo}>
          ⬅️ Undo
        </button>
        <button onClick={() => editorRef.current?.commands.redo()} disabled={!canRedo}>
          Redo ➡️
        </button>
        <button 
          onClick={() => editorRef.current?.commands.clearHistory()}
          disabled={!canUndo && !canRedo}
        >
          Clear History
        </button>
      </div>
    </div>
  );
}
```

#### When to Use

✅ **Use `useHistoryState` when:**
- Building undo/redo UI
- Need to show history depth
- Want reactive updates on history changes
- Building history visualization

❌ **Use direct ref instead when:**
- Just calling undo/redo without UI feedback
- Don't need to show availability state

---

## 🎯 Best Practices

### 1. Choose the Right Hook

```tsx
// ✅ Good: Use useSlideEditor for comprehensive state
function Editor() {
  const { ref, editor, isEmpty, currentSlide } = useSlideEditor({ content });
  return <SlideEditor ref={ref} content={content} />;
}

// ✅ Also Good: Use ref directly for imperative API only
function Editor() {
  const ref = useRef<SlideEditorRef>(null);
  const handleBold = () => ref.current?.commands.toggleBold();
  return <SlideEditor ref={ref} content={content} />;
}
```

### 2. Handle Null States

```tsx
function Toolbar() {
  const { editor } = useSlideEditor({ content });
  
  // ✅ Good: Handle null editor
  const handleClick = () => {
    if (editor) {
      editor.commands.toggleBold();
    }
  };
  
  // ✅ Also Good: Use optional chaining
  const handleClick2 = () => {
    editor?.commands.toggleBold();
  };
  
  return <button onClick={handleClick}>Bold</button>;
}
```

### 3. Avoid Unnecessary Re-renders

```tsx
// ✅ Good: Only subscribe to needed state
function SlideCounter() {
  const { currentSlide, totalSlides } = useSlideEditor({ content });
  return <div>{currentSlide} / {totalSlides}</div>;
}

// ❌ Bad: Using entire editor when you only need counts
function SlideCounter() {
  const { editor } = useSlideEditor({ content });
  return <div>{editor?.getCurrentSlide()} / {editor?.getTotalSlides()}</div>;
}
```

### 4. Combine Hooks

```tsx
function EditorWithHistory() {
  const { ref, editor, currentSlide, totalSlides } = useSlideEditor({ content });
  const { canUndo, canRedo, undoDepth } = useHistoryState(ref);
  
  return (
    <div>
      <div>Slide {currentSlide + 1} / {totalSlides}</div>
      <div>Undo steps: {undoDepth}</div>
      <button onClick={() => editor?.commands.undo()} disabled={!canUndo}>
        Undo
      </button>
      <SlideEditor ref={ref} content={content} />
    </div>
  );
}
```

## 🧪 Testing

Test hooks using the demo application:

```bash
cd demo
npm run dev
```

The demo includes examples of:
- `useSlideEditor` with toolbar
- `useHistoryState` for undo/redo UI
- Combined hook usage
- Edge cases and error handling

## 🔧 Creating Custom Hooks

You can create your own hooks based on these patterns:

### Example: useSlideNavigation

```tsx
function useSlideNavigation(editorRef: React.RefObject<SlideEditorRef>) {
  const [slideInfo, setSlideInfo] = useState<SlideInfo>({
    index: 0,
    total: 0,
    isFirst: true,
    isLast: true,
    canGoNext: false,
    canGoPrev: false
  });
  
  useEffect(() => {
    const updateSlideInfo = () => {
      if (editorRef.current) {
        setSlideInfo(editorRef.current.commands.getSlideInfo());
      }
    };
    
    // Update on slide changes
    updateSlideInfo();
  }, [editorRef]);
  
  return slideInfo;
}
```

### Example: useEditorValidation

```tsx
function useEditorValidation(content: DocNode) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  useEffect(() => {
    const result = validateContent(content);
    setValidationResult(result);
  }, [content]);
  
  return validationResult;
}
```

## 📚 Related Documentation

- [Components Documentation](../components/README.md)
- [Commands Documentation](../commands/README.md)
- [Types Documentation](../types/README.md)
- [Main README](../../README.md)

---

For more examples, see the [demo application](../../demo/README.md).

