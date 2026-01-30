# Creating & Organizing

Blockslides provides tools for creating and managing slides programmatically. You can add slides through the AddSlideButton extension for UI-based insertion, or use editor commands for programmatic control.

## Installation

The AddSlideButton extension is included in the ExtensionKit by default:

```ts
import { ExtensionKit } from '@blockslides/extension-kit'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({})
  ]
})
```

To configure the AddSlideButton:

```ts
ExtensionKit.configure({
  addSlideButton: {
    content: '+',
    showPresets: true,
    presets: myPresetTemplates
  }
})
```

### Disabling AddSlideButton

You can disable the AddSlideButton extension by setting it to `false`:

```ts
ExtensionKit.configure({
  addSlideButton: false
})
```

## Adding Slides

### AddSlideButton Extension

The AddSlideButton extension renders interactive buttons between slides, allowing users to add new slides at any position in the deck. This is the recommended approach for UI-based slide creation.

#### Basic configuration

```ts
import { AddSlideButton } from '@blockslides/extension-add-slide-button'

AddSlideButton.configure({
  content: '+',
  buttonStyle: {
    backgroundColor: '#3b82f6',
    color: '#ffffff'
  }
})
```

#### Configuration options

**content** (`string`, default: `'+'`)

The button content. Accepts text, HTML, emojis, or SVG icons:

```ts
AddSlideButton.configure({
  content: '➕'  // Emoji
})

AddSlideButton.configure({
  content: 'Add Slide'  // Text
})

AddSlideButton.configure({
  content: '<svg>...</svg>'  // Custom icon
})
```

**buttonStyle** (`Record<string, string>`, default: `{}`)

Custom CSS styles for the button. Supports both camelCase (React) and kebab-case (CSS) property names:

```ts
AddSlideButton.configure({
  buttonStyle: {
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '12px 24px'
  }
})
```

**onClick** (`function | null`, default: `null`)

Custom click handler for the add button. When provided, replaces the default slide insertion behavior:

```ts
AddSlideButton.configure({
  onClick: ({ slideIndex, position, view, event }) => {
    // Custom logic here
    // slideIndex: the current slide index (0-based)
    // position: document position where the slide would be inserted
    // view: EditorView instance
    // event: the MouseEvent
  }
})
```

### Template Picker

**showPresets** (`boolean`, default: `false`)

::: warning Template Picker Feature
Enable the preset template picker to give users a selection of pre-designed slide templates. When enabled, a template picker button appears alongside the regular add slide button, opening a modal with template options.
:::

**Using Built-in Presets:**

Import and use the built-in template presets from `@blockslides/ai-context`:

```ts
import { templatesV1 } from '@blockslides/ai-context'

AddSlideButton.configure({
  showPresets: true,
  presets: templatesV1.listPresetTemplates()
})
```

The built-in presets include templates like Title & Subheader, Two Columns, Three Columns, Image & Text, Full Image, and more.

**presets** (`PresetTemplateOption[]`)

You can also define your own custom template definitions:

```ts
AddSlideButton.configure({
  showPresets: true,
  presets: [
    {
      key: 'title-slide',
      label: 'Title Slide',
      icon: '<svg>...</svg>',
      build: () => ({
        type: 'slide',
        content: [/* slide content */]
      })
    },
    {
      key: 'two-column',
      label: 'Two Column Layout',
      icon: '<svg>...</svg>',
      build: () => ({
        type: 'slide',
        content: [/* slide content */]
      })
    }
  ]
})
```

## Deleting Slides

Use `deleteNode()` to remove the current slide:

```ts
editor.commands.deleteNode('slide')
```

This removes the slide node that contains the current cursor position.

### Deleting specific slides

To delete a specific slide, first select it, then delete:

```ts
// Find and delete a slide by position
editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'slide') {
    // Check if this is the slide you want to delete
    if (/* your condition */) {
      editor.commands.setNodeSelection(pos)
      editor.commands.deleteNode('slide')
    }
  }
})
```

## Slide Attributes

Every slide has attributes that control its appearance and behavior:

### size

Determines the slide dimensions. 
We ship with a few options (and are adding more)
<br/>
Available presets:

- **16x9** - Widescreen format (1920×1080px equivalent ratio)
- **4x3** - Standard format (1600×1200px equivalent ratio)
- **a4-portrait** - A4 paper in portrait orientation
- **a4-landscape** - A4 paper in landscape orientation
- **letter-portrait** - US Letter in portrait orientation
- **letter-landscape** - US Letter in landscape orientation
- **linkedin-banner** - LinkedIn banner format (1584×396px)

```ts
editor.commands.insertContent({
  type: 'slide',
  attrs: {
    size: '16x9'
  },
  content: [...]
})
```

### backgroundMode

Controls how the background is rendered:

- **none** - No background (uses default)
- **color** - Solid color background
- **image** - Image background
- **imageOverlay** - Image with a colored overlay

```ts
// Color mode
{
  backgroundMode: 'color',
  backgroundColor: '#3b82f6'
}

// Image mode
{
  backgroundMode: 'image',
  backgroundImage: 'https://example.com/bg.jpg'
}

// Image with overlay
{
  backgroundMode: 'imageOverlay',
  backgroundImage: 'https://example.com/bg.jpg',
  backgroundOverlayColor: '#000000',
  backgroundOverlayOpacity: 0.6
}
```

### backgroundColor

The background color when `backgroundMode` is `'color'`:

```ts
{
  backgroundMode: 'color',
  backgroundColor: '#f3f4f6'
}
```

### backgroundImage

The background image URL when `backgroundMode` is `'image'` or `'imageOverlay'`:

```ts
{
  backgroundMode: 'image',
  backgroundImage: 'https://example.com/slide-bg.jpg'
}
```

### backgroundOverlayColor

The overlay color when `backgroundMode` is `'imageOverlay'`:

```ts
{
  backgroundMode: 'imageOverlay',
  backgroundImage: 'https://example.com/bg.jpg',
  backgroundOverlayColor: '#1e293b',
  backgroundOverlayOpacity: 0.7
}
```

### backgroundOverlayOpacity

The overlay opacity (0 to 1) when `backgroundMode` is `'imageOverlay'`:

```ts
{
  backgroundMode: 'imageOverlay',
  backgroundImage: 'https://example.com/bg.jpg',
  backgroundOverlayColor: '#000000',
  backgroundOverlayOpacity: 0.5  // 50% opacity
}
```

### id

Optional identifier for the slide:

```ts
{
  id: 'intro-slide',
  // ...other attributes
}
```

### className

Optional CSS class names for custom styling:

```ts
{
  className: 'highlight-slide branded-slide',
  // ...other attributes
}
```

::: warning Use Attributes Instead of ClassNames
Avoid relying on `className` for slide styling. Instead, use the built-in slide attributes like `backgroundColor`, `backgroundMode`, `backgroundImage`, etc. for better semantic structure and maintainability.

<!-- TODO: Link to slide reference documentation to see all available attributes -->
:::

## Querying Slides

### Counting slides

Count the total number of slides in the document:

```ts
let slideCount = 0
editor.state.doc.descendants((node) => {
  if (node.type.name === 'slide') {
    slideCount++
  }
})

console.log(`Total slides: ${slideCount}`)
```

### Finding all slides

Collect all slides with their positions:

```ts
const slides: Array<{ node: any; pos: number }> = []

editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'slide') {
    slides.push({ node, pos })
  }
})

console.log('All slides:', slides)
```

### Finding a slide by index

Locate a specific slide by its index (0-based):

```ts
const targetIndex = 2  // Find the third slide
let currentIndex = 0
let targetSlide = null
let targetPos = 0

editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'slide') {
    if (currentIndex === targetIndex) {
      targetSlide = node
      targetPos = pos
      return false  // Stop traversal
    }
    currentIndex++
  }
})

if (targetSlide) {
  console.log('Found slide at position:', targetPos)
}
```

### Finding a slide by ID

Locate a slide with a specific ID attribute:

```ts
const targetId = 'intro-slide'
let foundSlide = null
let foundPos = 0

editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'slide' && node.attrs.id === targetId) {
    foundSlide = node
    foundPos = pos
    return false  // Stop traversal
  }
})

if (foundSlide) {
  console.log('Found slide with ID:', targetId)
}
```

### Getting the current slide

Find the slide containing the cursor:

```ts
const cursorPos = editor.state.selection.from
let currentSlide = null
let currentSlidePos = 0

editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'slide') {
    const slideEnd = pos + node.nodeSize
    if (cursorPos >= pos && cursorPos <= slideEnd) {
      currentSlide = node
      currentSlidePos = pos
      return false  // Stop traversal
    }
  }
})

if (currentSlide) {
  console.log('Current slide:', currentSlide.attrs)
}
```

### Accessing slide attributes

Read slide attributes for inspection or modification:

```ts
editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'slide') {
    console.log('Slide attributes:', {
      size: node.attrs.size,
      backgroundMode: node.attrs.backgroundMode,
      backgroundColor: node.attrs.backgroundColor,
      backgroundImage: node.attrs.backgroundImage,
      id: node.attrs.id,
      className: node.attrs.className
    })
  }
})
```

## Working with Slide Positions

Understanding document positions is essential for programmatic slide manipulation.

### Document positions

In ProseMirror (the editor framework Blockslides uses), positions are numeric offsets from the start of the document. Each character, node boundary, and structural element occupies a position.

```ts
// Position 0: Start of document
// Position N: After N characters/nodes
// Position doc.content.size: End of document

editor.state.doc.descendants((node, pos) => {
  console.log(`Node type: ${node.type.name}, starts at position: ${pos}`)
})
```

### Inserting at specific positions

Use positions to insert content at precise locations:

```ts
// Insert at the beginning
editor.commands.insertContentAt(0, slideJSON)

// Insert at the end
const endPos = editor.state.doc.content.size
editor.commands.insertContentAt(endPos, slideJSON)

// Insert after a specific slide
const insertPos = slidePos + slideNode.nodeSize
editor.commands.insertContentAt(insertPos, slideJSON)
```

### Selecting slides by position

Set the selection to a specific slide:

```ts
editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'slide') {
    // Select this slide
    editor.commands.setNodeSelection(pos)
    return false  // Stop after first slide
  }
})
```

**Key considerations:**

- Positions are absolute offsets from document start
- Each node takes up `nodeSize` positions (includes opening/closing boundaries)
- Positions change as content is inserted or deleted
- Use `descendants()` to traverse and find positions
