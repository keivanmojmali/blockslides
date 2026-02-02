# Rich Text Formatting

Blockslides provides **text formatting capabilities** through a collection of **mark extensions**. These allow you to style text with bold, italic, colors, fonts, and much more. Giving you full control over the appearance of your slide content.

::: tip What are marks?
Marks are inline formatting that can be applied to text, like **bold** or *italic*. They're different from blocks (like paragraphs or headings) which are structural elements. Learn more in [What are the schemas?](/foundations/what-are-the-schemas)
:::

## Installation

All text formatting extensions are included in the ExtensionKit by default:

```ts
import { ExtensionKit } from '@blockslides/extension-kit'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({})
  ]
})
```

If you're building a custom extension setup, you can import individual formatting extensions:

```ts
import { Bold } from '@blockslides/extension-bold'
import { Italic } from '@blockslides/extension-italic'
import { Color } from '@blockslides/extension-color'
import { FontFamily } from '@blockslides/extension-font-family'

const editor = useSlideEditor({
  extensions: [
    // ... other extensions
    Bold,
    Italic,
    Color,
    FontFamily
  ]
})
```

### Disabling specific formatting

You can disable any formatting extension by setting it to `false`:

```ts
ExtensionKit.configure({
  bold: false,
  italic: false,
  underline: false
})
```

## Basic Text Formatting

The fundamental text formatting options that work like traditional word processors.

### Bold

Make text bold to add emphasis.

```ts
// Toggle bold
editor.commands.toggleBold()

// Set bold
editor.commands.setBold()

// Remove bold
editor.commands.unsetBold()
```

**Keyboard shortcut:** `Mod-B` (Cmd-B on Mac, Ctrl-B on Windows/Linux)

**Markdown input:** Type `**bold text**` and it will automatically format as you type.

### Italic

Italicize text for emphasis or styling.

```ts
// Toggle italic
editor.commands.toggleItalic()

// Set italic
editor.commands.setItalic()

// Remove italic
editor.commands.unsetItalic()
```

**Keyboard shortcut:** `Mod-I`

**Markdown input:** Type `*italic text*` or `_italic text_`

### Underline

Underline text for emphasis.

```ts
// Toggle underline
editor.commands.toggleUnderline()

// Set underline
editor.commands.setUnderline()

// Remove underline
editor.commands.unsetUnderline()
```

**Keyboard shortcut:** `Mod-U`

### Strike

Add strikethrough formatting to text.

```ts
// Toggle strike
editor.commands.toggleStrike()

// Set strike
editor.commands.setStrike()

// Remove strike
editor.commands.unsetStrike()
```

**Keyboard shortcut:** `Mod-Shift-S`

**Markdown input:** Type `~~strikethrough text~~`

### Code

Format text as inline code.

```ts
// Toggle code
editor.commands.toggleCode()

// Set code
editor.commands.setCode()

// Remove code
editor.commands.unsetCode()
```

**Keyboard shortcut:** `Mod-E`

**Markdown input:** Type `` `code` ``

## Text Styling

Advanced styling options for colors, fonts, and sizing.

### Color

Change the text color to any CSS color value.

```ts
// Set text color
editor.commands.setColor('#ff0000')
editor.commands.setColor('rgb(255, 0, 0)')
editor.commands.setColor('red')

// Remove text color
editor.commands.unsetColor()
```

**Example with selection:**

```ts
// Apply red color to selected text
if (editor.state.selection.empty === false) {
  editor.commands.setColor('#ff0000')
}
```

### Background Color

Add a background color to text (different from the Highlight mark).

```ts
// Set background color
editor.commands.setBackgroundColor('#ffff00')
editor.commands.setBackgroundColor('yellow')

// Remove background color
editor.commands.unsetBackgroundColor()
```

### Font Family

Change the font family for selected text.

```ts
// Set font family
editor.commands.setFontFamily('Arial')
editor.commands.setFontFamily('Georgia, serif')
editor.commands.setFontFamily('"Comic Sans MS", cursive')

// Remove font family
editor.commands.unsetFontFamily()
```

**Common font families:**

```ts
// Sans-serif fonts
editor.commands.setFontFamily('Arial, sans-serif')
editor.commands.setFontFamily('Helvetica, sans-serif')
editor.commands.setFontFamily('Verdana, sans-serif')

// Serif fonts
editor.commands.setFontFamily('Georgia, serif')
editor.commands.setFontFamily('Times New Roman, serif')

// Monospace fonts
editor.commands.setFontFamily('Courier New, monospace')
editor.commands.setFontFamily('Monaco, monospace')
```

### Font Size

Adjust the font size using any CSS size unit.

```ts
// Set font size
editor.commands.setFontSize('24px')
editor.commands.setFontSize('1.5rem')
editor.commands.setFontSize('120%')

// Remove font size
editor.commands.unsetFontSize()
```

**Common sizes:**

```ts
// Pixel values
editor.commands.setFontSize('12px')  // Small
editor.commands.setFontSize('16px')  // Normal
editor.commands.setFontSize('24px')  // Large
editor.commands.setFontSize('36px')  // Extra large

// Relative values
editor.commands.setFontSize('0.875rem')  // Small
editor.commands.setFontSize('1rem')      // Normal
editor.commands.setFontSize('1.5rem')    // Large
```

### Line Height

Control the spacing between lines of text.

```ts
// Set line height
editor.commands.setLineHeight('1.5')
editor.commands.setLineHeight('2')
editor.commands.setLineHeight('32px')

// Remove line height
editor.commands.unsetLineHeight()
```

**Recommended values:**

```ts
editor.commands.setLineHeight('1')      // Tight
editor.commands.setLineHeight('1.5')    // Normal
editor.commands.setLineHeight('1.75')   // Relaxed
editor.commands.setLineHeight('2')      // Loose
```

## Highlight

The Highlight mark adds a background color to text, similar to using a highlighter pen.

```ts
// Toggle highlight (default color)
editor.commands.toggleHighlight()

// Set highlight with color
editor.commands.setHighlight({ color: '#ffff00' })
editor.commands.setHighlight({ color: 'yellow' })

// Remove highlight
editor.commands.unsetHighlight()
```

**Keyboard shortcut:** `Mod-Shift-H`

**Markdown input:** Type `==highlighted text==`

### Multiple highlight colors

Enable multicolor highlighting by configuring the extension:

```ts
ExtensionKit.configure({
  highlight: {
    multicolor: true
  }
})
```

With multicolor enabled, you can use different colors:

```ts
editor.commands.setHighlight({ color: '#ffff00' })  // Yellow
editor.commands.setHighlight({ color: '#ff9999' })  // Pink
editor.commands.setHighlight({ color: '#99ff99' })  // Green
```

## Advanced Formatting

### Subscript

Format text as subscript, useful for chemical formulas and mathematical notation.

```ts
// Toggle subscript
editor.commands.toggleSubscript()

// Set subscript
editor.commands.setSubscript()

// Remove subscript
editor.commands.unsetSubscript()
```

**Keyboard shortcut:** `Mod-,`

**Example use cases:**
- Chemical formulas: H₂O, CO₂
- Mathematical notation: x₁, y₂

### Superscript

Format text as superscript, useful for exponents and footnotes.

```ts
// Toggle superscript
editor.commands.toggleSuperscript()

// Set superscript
editor.commands.setSuperscript()

// Remove superscript
editor.commands.unsetSuperscript()
```

**Keyboard shortcut:** `Mod-.`

**Example use cases:**
- Exponents: x², 10³
- Footnotes: Reference¹
- Ordinals: 1ˢᵗ, 2ⁿᵈ

## Text Alignment

Control the horizontal alignment of text within blocks.

```ts
// Set alignment
editor.commands.setTextAlign('left')
editor.commands.setTextAlign('center')
editor.commands.setTextAlign('right')
editor.commands.setTextAlign('justify')

// Remove alignment (revert to default)
editor.commands.unsetTextAlign()
```

**Keyboard shortcuts:**
- `Mod-Shift-L` — Align left
- `Mod-Shift-E` — Align center
- `Mod-Shift-R` — Align right
- `Mod-Shift-J` — Justify

### Applying alignment to specific block types

Configure which block types support text alignment:

```ts
ExtensionKit.configure({
  textAlign: {
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left'
  }
})
```

## Links

Create hyperlinks in your text content.

```ts
// Set a link
editor.commands.setLink({ href: 'https://example.com' })

// Set a link with target
editor.commands.setLink({ 
  href: 'https://example.com',
  target: '_blank'
})

// Toggle link (set if not present, unset if present)
editor.commands.toggleLink({ href: 'https://example.com' })

// Remove link
editor.commands.unsetLink()
```

**Keyboard shortcut:** `Mod-K` (opens link dialog in most UIs)

**Markdown input:** Type `[link text](https://example.com)`

### Auto-detection

Links are automatically detected and converted when you paste URLs:

```ts
ExtensionKit.configure({
  link: {
    linkOnPaste: true  // Default: true
  }
})
```

### Link configuration

Customize link behavior:

```ts
ExtensionKit.configure({
  link: {
    // Open links when clicked
    openOnClick: true,
    
    // Auto-convert pasted URLs
    linkOnPaste: true,
    
    // Add rel="noopener noreferrer" to links
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      class: 'custom-link'
    },
    
    // Validate URLs before creating links
    validate: (url) => {
      // Only allow https links
      return /^https?:\/\//.test(url)
    }
  }
})
```

### Checking link state

Detect if the current selection has a link:

```ts
const isActive = editor.isActive('link')

// Get link attributes
const attrs = editor.getAttributes('link')
console.log(attrs.href)  // 'https://example.com'
```

## Typography

The Typography extension automatically converts text patterns into typographically correct characters.

```ts
ExtensionKit.configure({
  typography: {
    // Enable/disable specific rules
    emDash: true,        // -- → —
    ellipsis: true,      // ... → …
    openDoubleQuote: true,   // " → "
    closeDoubleQuote: true,  // " → "
    openSingleQuote: true,   // ' → '
    closeSingleQuote: true,  // ' → '
    leftArrow: true,     // <- → ←
    rightArrow: true,    // -> → →
    copyright: true,     // (c) → ©
    trademark: true,     // (tm) → ™
    registeredTrademark: true,  // (r) → ®
    oneHalf: true,       // 1/2 → ½
    plusMinus: true,     // +/- → ±
    notEqual: true,      // != → ≠
    laquo: true,         // << → «
    raquo: true,         // >> → »
    multiplication: true,  // 2x3 → 2×3
    superscriptTwo: true,  // ^2 → ²
    superscriptThree: true // ^3 → ³
  }
})
```

**What it converts:**

| You type | Converts to | Name |
|----------|-------------|------|
| `--` | — | Em dash |
| `...` | … | Ellipsis |
| `"text"` | "text" | Smart quotes |
| `'text'` | 'text' | Smart quotes |
| `(c)` | © | Copyright |
| `(tm)` | ™ | Trademark |
| `(r)` | ® | Registered |
| `1/2` | ½ | One half |
| `+/-` | ± | Plus/minus |
| `!=` | ≠ | Not equal |
| `->` | → | Right arrow |
| `<-` | ← | Left arrow |

## Programmatic Usage

### Applying multiple formats

Chain multiple formatting commands together:

```ts
editor
  .chain()
  .focus()
  .toggleBold()
  .setColor('#ff0000')
  .setFontSize('24px')
  .run()
```

### Checking active formats

Detect which formats are currently active:

```ts
// Check if format is active
const isBold = editor.isActive('bold')
const isItalic = editor.isActive('italic')
const hasColor = editor.isActive('textStyle', { color: '#ff0000' })

// Get current attributes
const attrs = editor.getAttributes('textStyle')
console.log(attrs.color)      // Current color
console.log(attrs.fontSize)   // Current font size
console.log(attrs.fontFamily) // Current font family
```

### Removing all formatting

Clear all marks from selected text:

```ts
// Remove all formatting
editor.commands.unsetAllMarks()

// Or remove specific marks
editor
  .chain()
  .unsetBold()
  .unsetItalic()
  .unsetColor()
  .unsetFontSize()
  .run()
```

### Applying formats to specific ranges

Format specific positions in the document:

```ts
// Format from position 10 to 20
editor
  .chain()
  .setTextSelection({ from: 10, to: 20 })
  .toggleBold()
  .run()

// Insert formatted text
editor
  .chain()
  .insertContent('<strong>Bold text</strong>')
  .run()
```

## Markdown Support

Most formatting extensions support markdown syntax:

| Format | Markdown | Output |
|--------|----------|--------|
| Bold | `**text**` or `__text__` | **text** |
| Italic | `*text*` or `_text_` | *text* |
| Strike | `~~text~~` | ~~text~~ |
| Code | `` `text` `` | `text` |
| Highlight | `==text==` | ==text== |

::: tip Input rules
These markdown patterns work automatically as you type in the editor. They're part of the individual extensions' input rules, not the Markdown extension. See [Markdown Support](/features/working-with-content/markdown-support) for full import/export capabilities.
:::

## Tips & Best Practices

### Use TextStyle as the base

Color, font family, font size, line height, and background color all work through the `textStyle` mark. This means they can be combined seamlessly:

```ts
// All of these work together
editor
  .chain()
  .setColor('#ff0000')
  .setFontSize('24px')
  .setFontFamily('Arial')
  .run()
```

### Marks can nest and combine

Multiple marks can be applied to the same text:

```ts
// Text can be bold, italic, colored, and highlighted all at once
editor
  .chain()
  .toggleBold()
  .toggleItalic()
  .setColor('#ff0000')
  .setHighlight({ color: '#ffff00' })
  .run()
```


::: tip Custom extensions
Add your own marks or formatting behaviors with custom extensions. See [Creating Custom Extensions](/features/customization/creating-extensions) for how to register new marks and commands.
:::
