# Types

Comprehensive TypeScript type definitions for AutoArtifacts, providing full type safety across the entire API.

## 📁 Files

```
types/
├── index.ts       # Main type exports (~670 lines)
└── events.ts      # Event callback parameter types
```

## 🎯 Overview

This directory contains all TypeScript types used in AutoArtifacts:

1. **Content Types** - JSON structure types (DocNode, SlideNode, etc.)
2. **Component Types** - React component props and refs
3. **API Types** - Commands, validators, exporters
4. **Event Types** - Callback parameter types
5. **Configuration Types** - Options and settings
6. **Utility Types** - Helper types

## 📦 Content Node Types

### Document Structure

#### DocNode
Root document node.
```typescript
interface DocNode {
  type: 'doc';
  content: SlideNode[];
}
```

#### SlideNode
Individual slide.
```typescript
interface SlideNode {
  type: 'slide';
  attrs?: {
    className?: string;
  };
  content: RowNode[];
}
```

#### RowNode
Horizontal container.
```typescript
interface RowNode {
  type: 'row';
  attrs?: {
    className?: string;
    layout?: string;  // e.g., '2-1', '1-1-1'
  };
  content: (ColumnNode | BlockNode)[];
}
```

#### ColumnNode
Vertical container.
```typescript
interface ColumnNode {
  type: 'column';
  attrs?: {
    className?: string;
    contentMode?: 'default' | 'cover' | 'contain';
    verticalAlign?: 'top' | 'center' | 'bottom';
    horizontalAlign?: 'left' | 'center' | 'right';
    padding?: 'none' | 'small' | 'medium' | 'large';
  };
  content: (BlockNode | RowNode)[];
}
```

### Block Nodes

#### ParagraphNode
```typescript
interface ParagraphNode {
  type: 'paragraph';
  attrs?: {
    className?: string;
  };
  content?: (TextNode | InlineNode)[];
}
```

#### HeadingNode
```typescript
interface HeadingNode {
  type: 'heading';
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
  };
  content?: (TextNode | InlineNode)[];
}
```

#### ImageNode
```typescript
interface ImageNode {
  type: 'image';
  attrs: {
    src: string;
    alt?: string;
    width?: number | string;
    display?: 'default' | 'cover' | 'contain' | 'fill';
    align?: 'left' | 'center' | 'right';
  };
}
```

#### VideoNode
```typescript
interface VideoNode {
  type: 'video';
  attrs: {
    src: string;
    provider?: 'youtube' | 'vimeo' | 'embed';
    width?: number | string;
    aspectRatio?: '16:9' | '4:3' | '1:1';
    align?: 'left' | 'center' | 'right';
  };
}
```

#### List Nodes
```typescript
interface BulletListNode {
  type: 'bulletList';
  attrs?: { className?: string };
  content: ListItemNode[];
}

interface OrderedListNode {
  type: 'orderedList';
  attrs?: {
    className?: string;
    start?: number;
  };
  content: ListItemNode[];
}

interface ListItemNode {
  type: 'listItem';
  attrs?: { className?: string };
  content: BlockNode[];
}
```

### Inline Nodes

#### TextNode
```typescript
interface TextNode {
  type: 'text';
  text: string;
  marks?: Mark[];
}
```

### Union Types

```typescript
// Any block-level node
type BlockNode =
  | ParagraphNode
  | HeadingNode
  | ImageNode
  | VideoNode
  | BulletListNode
  | OrderedListNode;

// Any inline-level node
type InlineNode = TextNode;

// Any content node
type ContentNode =
  | DocNode
  | SlideNode
  | RowNode
  | ColumnNode
  | BlockNode
  | InlineNode;
```

## 🎨 Mark Types

### Basic Marks

```typescript
interface BoldMark {
  type: 'bold';
}

interface ItalicMark {
  type: 'italic';
}

interface UnderlineMark {
  type: 'underline';
}

interface StrikethroughMark {
  type: 'strikethrough';
}

interface CodeMark {
  type: 'code';
}
```

### Link Mark

```typescript
interface LinkMark {
  type: 'link';
  attrs: {
    href: string;
    title?: string;
    target?: string;
  };
}
```

### Color Marks

```typescript
interface TextColorMark {
  type: 'textColor';
  attrs: {
    color: string;  // CSS color
  };
}

interface HighlightMark {
  type: 'highlight';
  attrs: {
    color: string;  // CSS color
  };
}
```

### Base Mark Type

```typescript
interface Mark {
  type: string;
  attrs?: Record<string, any>;
}
```

## ⚛️ Component Types

### SlideEditorProps

Complete props for the SlideEditor component:

```typescript
interface SlideEditorProps {
  // Content Management (Controlled)
  content?: DocNode;
  onChange?: (content: DocNode) => void;
  
  // Appearance
  editorTheme?: 'light' | 'dark' | 'presentation' | string;
  editorStyles?: string;
  slideTheme?: string;
  
  // Behavior
  editorMode?: 'edit' | 'present' | 'preview';
  readOnly?: boolean;
  currentSlide?: number;
  
  // Callbacks
  onSlideChange?: (slideIndex: number) => void;
  onError?: (error: Error) => void;
  
  // Lifecycle Events
  onCreate?: (params: OnCreateParams) => void;
  onDestroy?: () => void;
  onUpdate?: (params: OnUpdateParams) => void;
  
  // Content Events
  onContentChange?: (params: OnContentChangeParams) => void;
  
  // Selection Events
  onSelectionUpdate?: (params: OnSelectionUpdateParams) => void;
  
  // Focus Events
  onFocus?: (params: OnFocusParams) => void;
  onBlur?: (params: OnBlurParams) => void;
  
  // Transaction Events
  onTransaction?: (params: OnTransactionParams) => void;
  
  // History Events
  onUndo?: (params: OnUndoParams) => void;
  onRedo?: (params: OnRedoParams) => void;
  
  // History Configuration
  historyDepth?: number;
  newGroupDelay?: number;
  
  // Validation Configuration
  validationMode?: 'strict' | 'lenient' | 'off';
  autoFixContent?: boolean;
  onValidationError?: (result: ValidationResult) => void;
  
  // Keyboard Shortcuts Configuration
  keyboardShortcuts?: KeyboardShortcutsConfig;
  showShortcutsHelp?: boolean;
}
```

### SlideEditorRef

Complete ref API:

```typescript
interface SlideEditorRef {
  // Raw ProseMirror view
  view: EditorView;
  
  // Editability control
  setEditable(editable: boolean): void;
  isEditable(): boolean;
  
  // State access
  getCurrentSlide(): number;
  getTotalSlides(): number;
  getSlideContent(slideIndex: number): SlideNode | null;
  getJSON(): DocNode;
  getHTML(): string;
  getText(): string;
  isEmpty(): boolean;
  isFocused(): boolean;
  getSelection(): SelectionInfo | null;
  
  // Commands API
  commands: Commands;
  
  // History state
  canUndo(): boolean;
  canRedo(): boolean;
  getHistoryState(): HistoryState;
  
  // Validation
  validator: ContentValidator;
  
  // Content management
  setContent(content: DocNode): void;
  
  // Export
  exportAs(format: ExportFormat, options?: ExportOptions): string;
  downloadAs(format: ExportFormat, filename: string, options?: ExportOptions): void;
  
  // Utilities
  destroy(): void;
  getElement(): HTMLElement | null;
}
```

## 🔌 API Types

### Commands

```typescript
interface Commands {
  // Text formatting
  toggleBold(): boolean;
  toggleItalic(): boolean;
  toggleUnderline(): boolean;
  toggleStrikethrough(): boolean;
  toggleCode(): boolean;
  setTextColor(color: string): boolean;
  setHighlight(color: string): boolean;
  removeTextColor(): boolean;
  removeHighlight(): boolean;
  
  // Headings
  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6): boolean;
  toggleHeading(level: 1 | 2 | 3 | 4 | 5 | 6): boolean;
  setParagraph(): boolean;
  
  // Links
  setLink(href: string, title?: string): boolean;
  updateLink(href: string, title?: string): boolean;
  removeLink(): boolean;
  
  // Lists
  toggleBulletList(): boolean;
  toggleOrderedList(): boolean;
  
  // Media
  insertImage(attrs: ImageAttrs): boolean;
  insertVideo(attrs: VideoAttrs): boolean;
  
  // Slides
  addSlide(position?: 'before' | 'after' | 'end'): boolean;
  deleteSlide(slideIndex?: number): boolean;
  duplicateSlide(slideIndex?: number): boolean;
  
  // Navigation
  nextSlide(options?: NavigationOptions): void;
  prevSlide(options?: NavigationOptions): void;
  goToSlide(slideIndex: number, options?: NavigationOptions): void;
  goToFirstSlide(options?: NavigationOptions): void;
  goToLastSlide(options?: NavigationOptions): void;
  canGoNext(circular?: boolean): boolean;
  canGoPrev(circular?: boolean): boolean;
  getSlideInfo(): SlideInfo;
  
  // Layouts
  setLayout(layout: string): boolean;
  
  // History
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  getUndoDepth(): number;
  getRedoDepth(): number;
  getHistoryState(): HistoryState;
  clearHistory(): boolean;
  
  // Focus and selection
  focus(): boolean;
  blur(): boolean;
  selectAll(): boolean;
  deleteSelection(): boolean;
  
  // Selection commands
  setSelection(from: number, to?: number): boolean;
  selectSlide(slideIndex: number): boolean;
  collapseSelection(toStart?: boolean): boolean;
  expandSelection(): boolean;
  getSelectedText(): string;
  isSelectionEmpty(): boolean;
  isAtStart(): boolean;
  isAtEnd(): boolean;
  
  // Content manipulation
  clearContent(): boolean;
  
  // Chaining
  chain(): ChainedCommands;
}
```

### ChainedCommands

Same methods as `Commands`, but return `ChainedCommands` for chaining:

```typescript
interface ChainedCommands {
  // All Commands methods return ChainedCommands
  toggleBold(): ChainedCommands;
  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6): ChainedCommands;
  // ... etc
  
  // Execute the chain
  run(): boolean;
}
```

## 📊 State Types

### SelectionInfo

```typescript
interface SelectionInfo {
  from: number;           // Start position
  to: number;             // End position
  empty: boolean;         // Is selection empty (cursor only)?
  text: string;           // Selected text
  isAtStart: boolean;     // At document start?
  isAtEnd: boolean;       // At document end?
  marks: string[];        // Active marks
  nodeType?: string;      // Type of selected node
}
```

### HistoryState

```typescript
interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  undoDepth: number;
  redoDepth: number;
}
```

### SlideInfo

```typescript
interface SlideInfo {
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
}
```

## ✅ Validation Types

### ValidationIssue

```typescript
interface ValidationIssue {
  type: 'error' | 'warning';
  path: string;              // JSON path like "content[0].content[1]"
  message: string;
  code: string;              // Error code like "MISSING_TYPE"
  expected?: any;
  received?: any;
  autoFixable: boolean;
}
```

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  fixed?: any;  // Auto-fixed content (if requested)
}
```

### ValidationOptions

```typescript
interface ValidationOptions {
  mode?: 'strict' | 'lenient';
  autoFix?: boolean;
  throwOnError?: boolean;
}
```

### ContentValidator

```typescript
interface ContentValidator {
  validate(content: any, options?: ValidationOptions): ValidationResult;
  isValid(content: any): boolean;
  getIssues(content: any): ValidationIssue[];
}
```

## ⌨️ Keyboard Types

### KeyboardShortcut

```typescript
interface KeyboardShortcut {
  key: string;          // e.g., 'Mod-b'
  command: string;      // Command name
  description: string;  // Human-readable description
  category?: string;    // For grouping
}
```

### KeyboardShortcutsConfig

```typescript
interface KeyboardShortcutsConfig {
  custom?: Record<string, KeyboardShortcut>;
  disabled?: string[];
  overrides?: Record<string, string>;
}
```

## 📤 Export Types

### ExportFormat

```typescript
type ExportFormat = 'json' | 'html' | 'markdown' | 'text';
```

### ExportOptions

```typescript
interface ExportOptions {
  pretty?: boolean;           // Pretty-print (JSON)
  includeStyles?: boolean;    // Include CSS (HTML)
  slideNumbers?: boolean;     // Add slide numbers (HTML)
}
```

## 🎣 Hook Types

### UseSlideEditorOptions

```typescript
interface UseSlideEditorOptions {
  content: DocNode;
  editable?: boolean;
  onUpdate?: (content: DocNode) => void;
  onCreate?: (editor: SlideEditorRef) => void;
  onDestroy?: () => void;
}
```

### UseSlideEditorReturn

```typescript
interface UseSlideEditorReturn {
  ref: React.RefObject<SlideEditorRef>;
  editor: SlideEditorRef | null;
  isEmpty: boolean;
  isFocused: boolean;
  currentSlide: number;
  totalSlides: number;
}
```

## 📢 Event Types

See [`events.ts`](./events.ts) for complete event parameter types.

All event callbacks receive an object with relevant parameters:

```typescript
// Example
interface OnCreateParams {
  editor: SlideEditorRef;
}

interface OnUpdateParams {
  editor: SlideEditorRef;
  transaction: Transaction;
}

interface OnContentChangeParams {
  editor: SlideEditorRef;
  content: DocNode;
}

interface OnSelectionUpdateParams {
  editor: SlideEditorRef;
  selection: Selection;
}

// ... etc
```

## 🎯 Usage Examples

### Type-safe Content

```typescript
import { DocNode, SlideNode, RowNode } from 'autoartifacts';

const myContent: DocNode = {
  type: 'doc',
  content: [
    {
      type: 'slide',
      content: [
        {
          type: 'row',
          attrs: { layout: '1' },
          content: [
            {
              type: 'column',
              content: [
                {
                  type: 'heading',
                  attrs: { level: 1 },
                  content: [
                    { type: 'text', text: 'Hello' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
```

### Type-safe Props

```tsx
import { SlideEditorProps } from 'autoartifacts';

const props: SlideEditorProps = {
  content: myContent,
  onChange: (content) => {
    // content is typed as DocNode
    console.log(content.type); // OK
  },
  editorMode: 'edit',  // Type-checked: 'edit' | 'present' | 'preview'
  validationMode: 'strict',  // Type-checked: 'strict' | 'lenient' | 'off'
};
```

### Type-safe Ref

```tsx
import { useRef } from 'react';
import { SlideEditorRef } from 'autoartifacts';

function MyEditor() {
  const ref = useRef<SlideEditorRef>(null);
  
  const handleClick = () => {
    // All methods are typed
    ref.current?.commands.toggleBold();  // OK
    ref.current?.commands.invalid();      // Error: Property 'invalid' does not exist
  };
}
```

### Type-safe Commands

```tsx
import { Commands } from 'autoartifacts';

function useCommands(ref: RefObject<SlideEditorRef>): Commands | null {
  return ref.current?.commands ?? null;
}
```

## 🧪 Type Testing

TypeScript will catch errors at compile time:

```typescript
// ✅ Valid
const node: ParagraphNode = {
  type: 'paragraph',
  content: [
    { type: 'text', text: 'Hello' }
  ]
};

// ❌ Error: Type 'invalid' is not assignable to type 'paragraph'
const invalid: ParagraphNode = {
  type: 'invalid',
  content: []
};

// ❌ Error: Property 'level' is missing
const heading: HeadingNode = {
  type: 'heading',
  content: []
};
```

## 📚 Related Documentation

- [Components Documentation](../components/README.md)
- [Commands Documentation](../commands/README.md)
- [Schema Documentation](../schema/README.md)
- [Main README](../../README.md)

---

All types are exported from the main package:

```typescript
import {
  // Content types
  DocNode,
  SlideNode,
  RowNode,
  ColumnNode,
  ParagraphNode,
  HeadingNode,
  // ... etc
  
  // Component types
  SlideEditorProps,
  SlideEditorRef,
  
  // API types
  Commands,
  SelectionInfo,
  HistoryState,
  // ... etc
} from 'autoartifacts';
```

