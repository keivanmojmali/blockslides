# Theming & Styling

Blockslides provides **editor-level theming** to control the visual appearance of the editor UI, default slide styling, and interactive states. The theme system uses CSS custom properties to style both the editor canvas and slide containers.

## Styling Layers

Blockslides has three distinct styling layers:

- **Editor themes** - Controls editor UI colors, default slide styling, selection colors, and interactive states (covered on this page)
- **Slide styling** - Individual slide backgrounds, sizes, and layouts → See [Creating & Organizing](/features/slide-management/creating-organizing#slide-attributes)
- **Block styling** - Margins, padding, backgrounds, alignment for content blocks → See [Layouts & Columns](/features/slide-management/layouts-columns#column-attributes)

## Editor Themes

Editor themes define the visual appearance of the editor interface and provide default styling for slides. Blockslides includes two built-in themes (`light` and `dark`) and supports custom themes.

### Using Built-in Themes

Apply a theme when creating the editor:

```ts
import { useSlideEditor } from '@blockslides/react'

const editor = useSlideEditor({
  theme: 'light',  // or 'dark'
  extensions: [ExtensionKit]
})
```

**Light theme** provides a clean, bright interface with white slide backgrounds and subtle shadows.

**Dark theme** provides a dark interface with dark gray slide backgrounds and stronger shadows for better contrast.

### What Themes Control

Themes control these visual aspects:

**Editor canvas:**
- Background color (typically transparent to show through to page)
- Default text color
- Border colors

**Slide defaults:**
- Slide background color
- Slide border and border radius
- Slide drop shadow
- Spacing between slides
- Default slide padding
- Optional minimum slide height

**Interactive states:**
- Text selection color and background
- Hover state colors
- Active/pressed state colors
- Focus outline colors

### Creating Custom Themes

Define a complete custom theme with all required properties:

```ts
import { useSlideEditor } from '@blockslides/react'

const customTheme = {
  name: 'custom',
  
  editor: {
    background: 'transparent',
    foreground: '#1a1a1a',
    border: '#e5e5e5'
  },
  
  slide: {
    background: '#ffffff',
    border: '#e5e5e5',
    borderRadius: '12px',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '32px',
    padding: '48px',
    minHeight: '250px'  // Optional
  },
  
  selection: '#3b82f6',
  selectionBg: 'rgba(59, 130, 246, 0.1)',
  hover: '#f0f0f0',
  active: '#e8e8e8',
  focus: '#3b82f6'
}

const editor = useSlideEditor({
  theme: customTheme,
  extensions: [ExtensionKit]
})
```

### Extending Built-in Themes

Override specific properties of built-in themes without redefining everything:

```ts
const editor = useSlideEditor({
  theme: {
    extends: 'dark',
    slide: {
      background: '#0a0a0a',      // Darker slide background
      shadow: '0 8px 24px rgba(0, 0, 0, 0.6)'  // Stronger shadow
    },
    selection: '#8b5cf6'  // Purple selection color
  },
  extensions: [ExtensionKit]
})
```

You can extend either `light` or `dark` and override any combination of properties. Nested properties like `slide.background` are merged, so you only need to specify what changes.

### Registering Themes

Register custom themes globally to reference them by name:

```ts
import { registerTheme } from '@blockslides/core'

const brandTheme = {
  name: 'brand',
  editor: {
    background: 'transparent',
    foreground: '#1a1a1a',
    border: '#d1d5db'
  },
  slide: {
    background: '#f9fafb',
    border: '#e5e7eb',
    borderRadius: '16px',
    shadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    marginBottom: '40px',
    padding: '56px'
  },
  selection: '#10b981',
  selectionBg: 'rgba(16, 185, 129, 0.1)',
  hover: '#ecfdf5',
  active: '#d1fae5',
  focus: '#10b981'
}

registerTheme(brandTheme)

// Now use it by name
const editor = useSlideEditor({
  theme: 'brand',
  extensions: [ExtensionKit]
})
```

### Dynamic Theme Switching

Change the theme after the editor is created:

```ts
// Switch to dark theme
editor.setTheme('dark')

// Switch to light theme
editor.setTheme('light')

// Apply custom theme
editor.setTheme(customTheme)

// Extend theme dynamically
editor.setTheme({
  extends: 'light',
  slide: {
    background: '#fef3c7'
  }
})
```

### Theme Utilities

Get information about registered themes:

```ts
import { getTheme, getThemeNames } from '@blockslides/core'

// Get all registered theme names
const themeNames = getThemeNames()
// Returns: ['light', 'dark', 'brand', ...]

// Get a specific theme
const lightTheme = getTheme('light')
// Returns the complete theme object or undefined
```

### Theme Properties Reference

**Editor Properties:**

| Property | Description | Example |
|----------|-------------|---------|
| `editor.background` | Editor canvas background | `'transparent'`, `'#f5f5f5'` |
| `editor.foreground` | Default text color | `'#1a1a1a'`, `'#ffffff'` |
| `editor.border` | Editor container border | `'#e5e5e5'`, `'#3e3e3e'` |

**Slide Properties:**

| Property | Description | Example |
|----------|-------------|---------|
| `slide.background` | Default slide background | `'#ffffff'`, `'#1e1e1e'` |
| `slide.border` | Slide card border | `'#e5e5e5'`, `'#3e3e3e'` |
| `slide.borderRadius` | Rounded corners | `'12px'`, `'8px'` |
| `slide.shadow` | Drop shadow | `'0 4px 12px rgba(0, 0, 0, 0.08)'` |
| `slide.marginBottom` | Space between slides | `'32px'`, `'40px'` |
| `slide.padding` | Inner slide padding | `'48px'`, `'64px'` |
| `slide.minHeight` | Minimum slide height (optional) | `'250px'`, `'300px'` |

**Interactive Properties:**

| Property | Description | Example |
|----------|-------------|---------|
| `selection` | Selection highlight color | `'#3b82f6'`, `'#8b5cf6'` |
| `selectionBg` | Selection background | `'rgba(59, 130, 246, 0.1)'` |
| `hover` | Hover state color | `'#f0f0f0'`, `'#2d2d2d'` |
| `active` | Active/pressed state | `'#e8e8e8'`, `'#3d3d3d'` |
| `focus` | Focus outline color | `'#3b82f6'`, `'#10b981'` |

## Slide Configuration

### Sizes & Rendering Modes

Slides support multiple size presets (16x9, 4x3, A4, letter, LinkedIn banner) and rendering modes (fixed vs dynamic). These are configured on individual slides through slide attributes.

→ **See [Creating & Organizing](/features/slide-management/creating-organizing#slide-attributes)** for complete details on slide sizes, rendering modes, and scale factors.

### Slide Backgrounds

Individual slides can have custom backgrounds (solid colors, images, or images with overlays) that override the theme defaults. Background styling is configured through slide attributes.

→ **See [Creating & Organizing](/features/slide-management/creating-organizing#backgroundmode)** for complete details on slide background options.

### Hover Outlines

Enable visual outlines when hovering over content blocks within slides. This is useful for development and editing workflows to show block boundaries:

```ts
import { ExtensionKit } from '@blockslides/extension-kit'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      slide: {
        hoverOutline: true  // Enable with defaults
      }
    })
  ]
})
```

**Custom hover outline styling:**

```ts
ExtensionKit.configure({
  slide: {
    hoverOutline: {
      color: 'rgba(59, 130, 246, 0.65)',
      width: '1.5px',
      offset: '4px'
    }
  }
})
```

**Hover outline properties:**

| Property | Description | Default |
|----------|-------------|---------|
| `color` | Outline color | `'rgba(59, 130, 246, 0.65)'` |
| `width` | Outline width | `'1.5px'` |
| `offset` | Distance from element | `'4px'` |

**Cascade mode:**

Enable cascade to show outlines on nested blocks when hovering a container:

```ts
ExtensionKit.configure({
  slide: {
    hoverOutline: true,
    hoverOutlineCascade: true
  }
})
```

When cascade is enabled, hovering a container (like a column or list) will also outline all descendant blocks within it.

## Block Styling

The BlockAttributes extension provides styling capabilities for content blocks like paragraphs, headings, images, columns, and lists. It includes:

- **Spacing** - Padding, margin, gap with token system
- **Alignment** - Horizontal alignment and fill behavior
- **Backgrounds** - Colors and images for blocks
- **Borders** - Border radius and custom borders
- **Sizing** - Width and height controls

→ **See [Layouts & Columns](/features/slide-management/layouts-columns#column-attributes)** for complete details on block styling commands and options.

## Quick Reference

**Where to configure what:**

- **Editor UI styling?** → Use editor themes (this page)
- **Individual slide backgrounds?** → Use slide attributes ([Creating & Organizing](/features/slide-management/creating-organizing#slide-attributes))
- **Content block styling?** → Use BlockAttributes commands ([Layouts & Columns](/features/slide-management/layouts-columns#column-attributes))
- **Inline text formatting?** → See [Rich Text Formatting](/features/working-with-content/rich-text-formatting)

**Common patterns:**

```ts
// Theme the editor
const editor = useSlideEditor({
  theme: 'dark',
  extensions: [ExtensionKit]
})

// Style an individual slide
editor.commands.updateAttributes('slide', {
  backgroundMode: 'color',
  backgroundColor: '#1e293b'
})

// Style a content block
editor.commands.setBlockPadding('lg')
editor.commands.setBlockBackgroundColor('#3b82f6')
editor.commands.setBlockAlign('center')
```
