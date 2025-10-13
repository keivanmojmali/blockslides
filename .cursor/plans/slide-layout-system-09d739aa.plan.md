<!-- 09d739aa-da66-4bd4-8167-cd79866e0c88 52f913a3-9110-4af3-a408-5b7b3b11934e -->
# Slide Layout System with Layout Picker Plugin

## Overview

Add a slide layout system that allows users to change the overall structure of a slide using the same layout format as row layouts ('1', '1-1', '2-1', '1-1-1', etc.). Also provide an optional layout picker plugin that displays a visual template selector on empty/new slides, similar to the addSlideButton pattern.

## Key Concepts

**Unified Layout Format** = Same ratio format for both slides and rows

- `'1'` = single column (default)
- `'1-1'` = two equal columns  
- `'2-1'` = two columns (left wider)
- `'1-2'` = two columns (right wider)
- `'1-1-1'` = three equal columns
- Any ratio combination possible

**Layout Picker Plugin** = Visual template selector for empty slides

- Framework agnostic (ProseMirror widget, no React dependency)
- Shows on new/empty slides (layout: '1', no content)
- User clicks template → applies layout
- Fully customizable (layouts, text, styling, icons)

## Part 1: Core Layout System

### 1. Add Layout Attribute to Slide Schema

Update `src/schema/nodes/slides.ts`:

- Add `layout` attribute with default value `'1'`
- Update `toDOM` to include `data-layout` attribute on slide element
- This allows slides to persist their layout in JSON structure

### 2. Create Content Redistribution Logic

Create `src/utils/contentRedistribution.ts`:

- Function `extractContentBlocks(slide)` - gets all blocks from all columns
- Function `redistributeContent(blocks, columnCount)` - sequential distribution
- Function `createEmptyColumn()` - creates column with empty paragraph
- Sequential algorithm: divide blocks evenly across new columns
- Ensure each column has at least one empty paragraph

### 3. Add `setSlideLayout` Command

Update `src/commands/index.ts`:

- Add `setSlideLayout(layout: string): boolean` command
- Find current slide based on cursor position
- Parse layout using existing `parseLayout()` from layoutParser.ts
- Extract content from all columns in slide's first row
- Rebuild row with correct number of columns
- Redistribute content using sequential distribution
- Set layout attribute on both slide and row
- Apply flex ratios using `applyLayoutToRow()`

### 4. Update TypeScript Types

Update `src/types/index.ts`:

- Update `SlideNode` interface: add optional `layout?: string`
- Update `Commands` interface: add `setSlideLayout(layout: string): boolean`
- Update `ChainedCommands`: add `setSlideLayout(layout: string): ChainedCommands`

## Part 2: Layout Picker Plugin

### 5. Define Default Layouts

Create `src/plugins/layoutPickerDefaults.ts`:

- Export `DEFAULT_LAYOUTS` array with common layouts:
  - `{ id: '1', label: 'Single Column', icon: '<svg>...</svg>' }`
  - `{ id: '1-1', label: 'Two Columns', icon: '<svg>...</svg>' }`
  - `{ id: '2-1', label: 'Sidebar Right', icon: '<svg>...</svg>' }`
  - `{ id: '1-2', label: 'Sidebar Left', icon: '<svg>...</svg>' }`
  - `{ id: '1-1-1', label: 'Three Columns', icon: '<svg>...</svg>' }`
- Each layout has: id, label, icon (SVG string or image URL)

### 6. Create Layout Picker Plugin

Create `src/plugins/layoutPickerPlugin.ts`:

- Export `createLayoutPickerPlugin(options)` function
- Options interface:
  ```typescript
  {
    layouts?: LayoutTemplate[],      // Default: DEFAULT_LAYOUTS
    title?: string,                  // Default: 'Untitled card'
    subtitle?: string,               // Default: 'Or start with a template'
    className?: string,
    style?: CSSProperties,
    templateClassName?: string,
    templateStyle?: CSSProperties,
    iconMaxWidth?: string,           // Default: '100px'
    onLayoutSelect?: (layoutId, slideElement) => void
  }
  ```

- Plugin logic:
  - On document change, find all empty slides (layout='1', single column with only empty paragraph)
  - Create widget decoration at start of empty slide
  - Widget renders: title, subtitle, template cards
  - Each template card clickable
  - On click: call `setSlideLayout(layoutId)` or custom handler
  - Widget auto-hides after selection

### 7. Plugin DOM Structure

The widget creates HTML structure:

```html
<div class="layout-picker ${className}">
  <h2 class="layout-picker-title">{title}</h2>
  <p class="layout-picker-subtitle">{subtitle}</p>
  <div class="layout-picker-templates">
    <div class="layout-template ${templateClassName}">
      <div class="layout-template-icon">{icon}</div>
      <span class="layout-template-label">{label}</span>
    </div>
    <!-- more templates... -->
  </div>
</div>
```

### 8. Add Plugin Styles

Update `src/styles.css`:

- Add `.layout-picker` base styles
- Add `.layout-picker-title`, `.layout-picker-subtitle` styles
- Add `.layout-picker-templates` grid/flex layout
- Add `.layout-template` card styles (hover, active states)
- Add `.layout-template-icon` with max-width constraint
- Theme-aware styles (light/dark themes)

### 9. Export Plugin and Types

Update `src/index.ts`:

- Export `createLayoutPickerPlugin`
- Export `DEFAULT_LAYOUTS`
- Export `LayoutTemplate` type
- Export `LayoutPickerOptions` type

## Implementation Details

### Empty Slide Detection

A slide is considered "empty" when:

1. Slide has `layout` attribute = `'1'` (or undefined/empty)
2. Slide has exactly 1 row
3. Row has exactly 1 column
4. Column has exactly 1 paragraph
5. Paragraph has no content (or only whitespace)

### Layout Application Flow

1. User clicks template card with layout id (e.g., '1-1')
2. Plugin calls `setSlideLayout('1-1')` on that slide
3. Command restructures slide to have 2 columns
4. Widget decorator is removed (slide no longer empty)
5. User can start editing

### Customization Examples

**Use default layouts:**

```typescript
const plugin = createLayoutPickerPlugin();
```

**Add custom layout to defaults:**

```typescript
const plugin = createLayoutPickerPlugin({
  layouts: [
    ...DEFAULT_LAYOUTS,
    { id: '5-3-2', label: 'Custom', icon: '<svg>...</svg>' }
  ]
});
```

**Replace with only custom layouts:**

```typescript
const plugin = createLayoutPickerPlugin({
  layouts: [
    { id: '1-1', label: 'Two Cols', icon: '🔲🔲' },
    { id: '1-1-1', label: 'Three', icon: '🔲🔲🔲' }
  ]
});
```

**Full customization:**

```typescript
const plugin = createLayoutPickerPlugin({
  layouts: [...DEFAULT_LAYOUTS, customLayout],
  title: 'New Slide',
  subtitle: 'Pick a layout',
  className: 'my-picker',
  templateClassName: 'my-template',
  style: { padding: '40px' },
  iconMaxWidth: '120px',
  onLayoutSelect: (id, element) => {
    console.log('Selected:', id);
    // Custom behavior
  }
});
```

### Framework Agnostic Benefits

- Plugin uses pure DOM/JavaScript (no React)
- Works with React, Vue, Svelte, vanilla JS
- Icons as SVG strings (innerHTML) or image URLs
- Event handlers use standard DOM events
- Portable to any ProseMirror implementation

## Files to Modify/Create

### Part 1: Core Layout System

1. **src/schema/nodes/slides.ts** - Add `layout` attribute
2. **src/utils/contentRedistribution.ts** - NEW: Content redistribution logic
3. **src/commands/index.ts** - Add `setSlideLayout` command
4. **src/types/index.ts** - Update SlideNode, Commands, ChainedCommands

### Part 2: Layout Picker Plugin

5. **src/plugins/layoutPickerDefaults.ts** - NEW: Default layout templates
6. **src/plugins/layoutPickerPlugin.ts** - NEW: Plugin implementation
7. **src/styles.css** - Add layout picker styles
8. **src/index.ts** - Export plugin and types

## Usage Example

```typescript
import { 
  SlideEditor, 
  createLayoutPickerPlugin, 
  DEFAULT_LAYOUTS 
} from 'autoartifacts';

// Create plugin with custom config
const layoutPicker = createLayoutPickerPlugin({
  layouts: [...DEFAULT_LAYOUTS],
  title: 'Start your slide',
  subtitle: 'Choose a layout',
  iconMaxWidth: '100px'
});

// Use in editor
<SlideEditor
  content={content}
  onChange={setContent}
  plugins={[layoutPicker]}
/>

// Or programmatically change layout
editorRef.current.commands.setSlideLayout('1-1');
```

## Testing Scenarios

1. Create new slide → should show layout picker
2. Click template → layout applies, picker disappears
3. Add content to slide → picker stays hidden
4. Custom layouts work correctly
5. Undo/redo works with layout changes
6. Multiple empty slides each show their own picker
7. Custom styling and callbacks work
8. Works in light and dark themes

### To-dos

- [ ] Define SlideLayoutType and layout configuration structure in types
- [ ] Create slideLayouts.ts with layout configurations (single, two-column, three-column, sidebar-left, sidebar-right)
- [ ] Create contentRedistribution.ts with sequential distribution logic
- [ ] Implement setSlideLayout command in commands/index.ts with slide detection and content redistribution
- [ ] Update Commands and ChainedCommands interfaces with setSlideLayout method
- [ ] Test the implementation with various content scenarios and layout changes