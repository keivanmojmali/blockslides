# AutoArtifacts

A powerful, feature-rich slide editor component built with ProseMirror and React for creating rich, interactive presentations. AutoArtifacts provides a complete solution for building presentation editors with extensive APIs for programmatic control, validation, keyboard shortcuts, and more.

[![npm version](https://img.shields.io/npm/v/autoartifacts.svg)](https://www.npmjs.com/package/autoartifacts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Core Concepts](#-core-concepts)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Architecture](#-architecture)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎨 Theming & Styling
- **Built-in Themes**: Default, Dark, Minimal, and Gradient themes
- **Custom Themes**: Full CSS customization support
- **Editor Modes**: Edit, Present, and Preview modes
- **Responsive Design**: Mobile-friendly layouts

### 📐 Layout System
- **Flexible Columns**: Ratio-based layout system (e.g., `'2-1'`, `'1-1-1'`)
- **Nested Layouts**: Support for nested rows and columns
- **Display Modes**: Cover, contain, and default content modes
- **Alignment Controls**: Vertical and horizontal alignment options
- **Padding Options**: None, small, medium, and large padding

### 📝 Rich Content
- **Text Formatting**: Bold, italic, underline, strikethrough, code
- **Advanced Typography**: Font families, sizes, colors, shadows, line height
- **Links**: Full link support with titles and targets
- **Media**: Images with display modes, embedded videos (YouTube, Vimeo)
- **Lists**: Bullet lists and ordered lists with nesting

### 🎯 Powerful APIs
- **Commands API**: 70+ commands for programmatic control
- **Events System**: Comprehensive lifecycle and content change events
- **State Access**: Real-time access to editor state
- **History API**: Full undo/redo with configurable depth
- **Validation**: Built-in content validation with auto-fix
- **Keyboard Shortcuts**: Customizable keyboard shortcuts
- **Selection API**: Advanced text selection and manipulation
- **Export System**: Export to JSON, HTML, Markdown, or plain text

### 🔧 Developer Experience
- **TypeScript**: Full TypeScript support with comprehensive types
- **React Hooks**: Modern hooks-based API
- **Controlled/Uncontrolled**: Support for both modes
- **Read-only Mode**: View-only presentations
- **Error Handling**: Robust error handling and validation
- **Developer Tools**: Built-in keyboard shortcuts help (Shift+?)

## 📦 Installation

```bash
npm install autoartifacts
# or
yarn add autoartifacts
# or
pnpm add autoartifacts
```

### Peer Dependencies

AutoArtifacts requires React 18+ and ProseMirror packages (included as dependencies).

## 🚀 Quick Start

### Basic Usage

```tsx
import { SlideEditor } from 'autoartifacts';
import 'autoartifacts/dist/styles.css';

function App() {
  const [content, setContent] = useState({
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
                attrs: {
                  verticalAlign: 'center',
                  horizontalAlign: 'center',
                  padding: 'large'
                },
                content: [
                  {
                    type: 'heading',
                    attrs: { level: 1 },
                    content: [{ type: 'text', text: 'Hello World' }]
                  },
                  {
                    type: 'paragraph',
                    content: [
                      { type: 'text', text: 'Welcome to AutoArtifacts!' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  return (
    <SlideEditor
      content={content}
      onChange={setContent}
      slideTheme="dark"
      editorMode="edit"
    />
  );
}
```

### Using the Ref API

```tsx
import { useRef } from 'react';
import { SlideEditor, SlideEditorRef } from 'autoartifacts';

function App() {
  const editorRef = useRef<SlideEditorRef>(null);

  const handleBold = () => {
    editorRef.current?.commands.toggleBold();
  };

  const handleAddSlide = () => {
    editorRef.current?.commands.addSlide('end');
  };

  const handleExport = () => {
    const html = editorRef.current?.exportAs('html', { 
      includeStyles: true,
      slideNumbers: true 
    });
    console.log(html);
  };

  return (
    <div>
      <div>
        <button onClick={handleBold}>Bold</button>
        <button onClick={handleAddSlide}>Add Slide</button>
        <button onClick={handleExport}>Export HTML</button>
      </div>
      <SlideEditor ref={editorRef} content={content} />
    </div>
  );
}
```

### Using the Hook

```tsx
import { useSlideEditor } from 'autoartifacts';

function App() {
  const { ref, editor, currentSlide, totalSlides, isEmpty } = useSlideEditor({
    content: myContent,
    editable: true,
    onUpdate: (content) => {
      console.log('Content updated:', content);
    }
  });

  return (
    <div>
      <div>Slide {currentSlide + 1} of {totalSlides}</div>
      <SlideEditor ref={ref} content={content} />
    </div>
  );
}
```

## 🧩 Core Concepts

### Content Structure

AutoArtifacts uses a hierarchical JSON structure:

```
doc
└── slide (one or more)
    └── row (one or more)
        └── column (one or more)
            └── content (paragraphs, headings, images, etc.)
```

### Control Modes

The editor is always controlled - you provide the initial content and optionally track changes:

**With initial content**:
```tsx
<SlideEditor content={myContent} />
```

**Tracking updates**:
```tsx
const [content, setContent] = useState(myContent);
<SlideEditor content={content} onChange={setContent} />
```

### Editor Modes

- **edit**: Full editing capabilities (default)
- **present**: Presentation mode with keyboard navigation
- **preview**: Read-only preview with all slides visible

### Layout System

The layout system uses ratio strings to define column widths:

- `'1'` - Single column (100%)
- `'1-1'` - Two equal columns (50/50)
- `'2-1'` - Two-thirds / one-third (66.66/33.33)
- `'1-1-1'` - Three equal columns (33.33 each)
- `'5-3-2'` - Custom ratios (50/30/20)

## 📚 API Reference

### Component Props

```tsx
interface SlideEditorProps {
  // Content Management (always controlled)
  content: DocNode;                      // Initial content (required)
  onChange?: (content: DocNode) => void; // Track changes (optional)
  
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
  onContentChange?: (params: OnContentChangeParams) => void;
  
  // Selection Events
  onSelectionUpdate?: (params: OnSelectionUpdateParams) => void;
  onFocus?: (params: OnFocusParams) => void;
  onBlur?: (params: OnBlurParams) => void;
  
  // Transaction Events
  onTransaction?: (params: OnTransactionParams) => void;
  onUndo?: (params: OnUndoParams) => void;
  onRedo?: (params: OnRedoParams) => void;
  
  // Configuration
  historyDepth?: number;          // Default: 100
  newGroupDelay?: number;         // Default: 500ms
  validationMode?: 'strict' | 'lenient' | 'off';  // Default: 'lenient'
  autoFixContent?: boolean;       // Default: false
  onValidationError?: (result: ValidationResult) => void;
  
  // Keyboard Shortcuts
  keyboardShortcuts?: KeyboardShortcutsConfig;
  showShortcutsHelp?: boolean;
}
```

### Ref API Methods

The editor exposes a comprehensive API through refs:

```tsx
interface SlideEditorRef {
  // Raw ProseMirror view access
  view: EditorView;
  
  // Editability
  setEditable(editable: boolean): void;
  isEditable(): boolean;
  
  // State Access
  getCurrentSlide(): number;
  getTotalSlides(): number;
  getSlideContent(slideIndex: number): SlideNode | null;
  getJSON(): DocNode;
  getHTML(): string;
  getText(): string;
  isEmpty(): boolean;
  isFocused(): boolean;
  getSelection(): SelectionInfo | null;
  
  // Commands API (70+ commands)
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

### Commands API

Access via `editorRef.current.commands`:

```tsx
// Text Formatting
toggleBold()
toggleItalic()
toggleUnderline()
toggleStrikethrough()
toggleCode()
setTextColor(color: string)
setHighlight(color: string)
removeTextColor()
removeHighlight()

// Headings
setHeading(level: 1-6)
toggleHeading(level: 1-6)
setParagraph()

// Links
setLink(href: string, title?: string)
updateLink(href: string, title?: string)
removeLink()

// Media
insertImage({ src, alt?, width? })
insertVideo({ src, provider?, aspectRatio? })

// Slides
addSlide(position?: 'before' | 'after' | 'end')
deleteSlide(slideIndex?: number)
duplicateSlide(slideIndex?: number)

// Navigation
nextSlide(options?: NavigationOptions)
prevSlide(options?: NavigationOptions)
goToSlide(slideIndex: number, options?: NavigationOptions)
goToFirstSlide(options?: NavigationOptions)
goToLastSlide(options?: NavigationOptions)
canGoNext(circular?: boolean): boolean
canGoPrev(circular?: boolean): boolean
getSlideInfo(): SlideInfo

// History
undo()
redo()
canUndo(): boolean
canRedo(): boolean
getHistoryState(): HistoryState
clearHistory()

// Selection
setSelection(from: number, to?: number)
selectSlide(slideIndex: number)
selectAll()
collapseSelection(toStart?: boolean)
expandSelection()
getSelectedText(): string
isSelectionEmpty(): boolean

// Focus
focus()
blur()

// Chaining
chain().toggleBold().setHeading(1).run()
```

## 🎓 Advanced Usage

### Custom Keyboard Shortcuts

```tsx
<SlideEditor
  content={content}
  keyboardShortcuts={{
    disabled: ['Mod-b'],  // Disable default bold
    overrides: {
      'Mod-b': 'customBold'  // Override with custom command
    },
    custom: {
      'Mod-Shift-d': {
        key: 'Mod-Shift-d',
        command: 'duplicateSlide',
        description: 'Duplicate current slide',
        category: 'Slides'
      }
    }
  }}
/>
```

### Content Validation

```tsx
<SlideEditor
  content={content}
  validationMode="strict"
  autoFixContent={true}
  onValidationError={(result) => {
    console.error('Validation errors:', result.errors);
    console.warn('Validation warnings:', result.warnings);
  }}
/>
```

### Event Handling

```tsx
<SlideEditor
  content={content}
  onCreate={({ editor }) => {
    console.log('Editor created:', editor);
  }}
  onUpdate={({ editor, transaction }) => {
    console.log('Document updated');
  }}
  onContentChange={({ editor, content }) => {
    console.log('Content changed:', content);
  }}
  onSelectionUpdate={({ editor, selection }) => {
    console.log('Selection changed:', selection);
  }}
/>
```

### Exporting Content

```tsx
const editor = editorRef.current;

// Export to different formats
const json = editor.exportAs('json', { pretty: true });
const html = editor.exportAs('html', { 
  includeStyles: true, 
  slideNumbers: true 
});
const markdown = editor.exportAs('markdown');
const text = editor.exportAs('text');

// Download directly
editor.downloadAs('html', 'presentation.html', {
  includeStyles: true,
  slideNumbers: true
});
```

### Programmatic Content Manipulation

```tsx
const editor = editorRef.current;

// Chain multiple commands
editor.commands
  .chain()
  .selectAll()
  .toggleBold()
  .setTextColor('#ff0000')
  .run();

// Navigate slides programmatically
editor.commands.goToSlide(2);
editor.commands.nextSlide({ transition: 'fade', duration: 500 });

// Manage slides
editor.commands.addSlide('after');
editor.commands.duplicateSlide(0);
editor.commands.deleteSlide(1);

// Access state
const currentSlide = editor.getCurrentSlide();
const totalSlides = editor.getTotalSlides();
const isEmpty = editor.isEmpty();
const canUndo = editor.canUndo();
```

## 🏗️ Architecture

### Project Structure

```
autoartifacts/
├── src/                      # Source code
│   ├── components/           # React components
│   ├── hooks/                # React hooks
│   ├── commands/             # Commands API implementation
│   ├── schema/               # ProseMirror schema definitions
│   │   ├── nodes/            # Node definitions
│   │   └── marks/            # Mark definitions
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── validation/           # Content validation system
│   ├── keyboard/             # Keyboard shortcuts
│   └── styles.css            # Component styles
├── demo/                     # Demo application
├── plans/                    # Feature documentation
└── README.md                 # This file
```

For detailed documentation of each folder, see the README.md files in each directory.

### Core Technologies

- **React 19**: Modern React with hooks
- **ProseMirror**: Powerful text editing framework
- **TypeScript**: Full type safety
- **Vite**: Fast build tool

### Key Design Principles

1. **Type Safety**: Comprehensive TypeScript types for all APIs
2. **Null Safety**: All methods handle null/undefined gracefully
3. **Immutability**: Content is immutable, changes create new states
4. **Composability**: APIs can be chained and composed
5. **Extensibility**: Schema and commands can be extended
6. **Performance**: Optimized rendering and updates

## 🧪 Development

### Setup

```bash
# Install dependencies
npm install

# Run demo application
cd demo
npm install
npm run dev
```

### Building

```bash
# Build the package
npm run build

# Build demo
cd demo
npm run build
```

### Testing

```bash
# Run the demo to test features
cd demo
npm run dev
# Open http://localhost:5173
```

The demo includes comprehensive test cases for:
- All themes and layouts
- Event callbacks
- Slide navigation
- Content validation
- Keyboard shortcuts
- And much more

### Project Structure

See individual README files:
- [Source Code Architecture](./src/README.md)
- [Components](./src/components/README.md)
- [Hooks](./src/hooks/README.md)
- [Commands API](./src/commands/README.md)
- [Schema](./src/schema/README.md)
- [Types](./src/types/README.md)
- [Utils](./src/utils/README.md)
- [Validation](./src/validation/README.md)
- [Keyboard](./src/keyboard/README.md)
- [Demo](./demo/README.md)
- [Feature Plans](./plans/README.md)

## 📄 License

MIT © AutoArtifacts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly using the demo app
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🙏 Acknowledgments

Built with:
- [ProseMirror](https://prosemirror.net/) - The excellent text editing framework
- [React](https://react.dev/) - The UI library
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- [Vite](https://vitejs.dev/) - For fast builds

## 📞 Support

- [GitHub Issues](https://github.com/yourusername/autoartifacts/issues)
- [Documentation](./README.md)
- [Feature Plans](./plans/README.md)

---

**Made with ❤️ for the presentation community**
