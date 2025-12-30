# BubbleMenuPreset

Opinionated bubble menu with built-in actions (undo/redo, font family/size, bold, italic, underline, text color, highlight color, link, align) on top of `@blockslides/extension-bubble-menu`. Provides a ready-to-use menu element, palettes, and sensible defaults.

## Install

```bash
npm install @blockslides/extension-bubble-menu-preset
# pnpm add @blockslides/extension-bubble-menu-preset
# yarn add @blockslides/extension-bubble-menu-preset
```

Peer deps you’ll typically also want loaded:
- `@blockslides/extensions/undo-redo`
- `@blockslides/extension-text-style` (color, fontFamily, fontSize)
- `@blockslides/extension-highlight` (with `multicolor: true` for per-color)
- `@blockslides/extension-link`
- `@blockslides/extension-text-align`

## Usage

```ts
import BubbleMenuPreset from '@blockslides/extension-bubble-menu-preset'
import { UndoRedo } from '@blockslides/extensions/undo-redo'
import { Highlight } from '@blockslides/extension-highlight'
import { Color, FontFamily, FontSize } from '@blockslides/extension-text-style'
import { Link } from '@blockslides/extension-link'
import { TextAlign } from '@blockslides/extension-text-align'

new Editor({
  extensions: [
    UndoRedo,
    Color,
    FontFamily,
    FontSize,
    Highlight.configure({ multicolor: true }),
    Link,
    TextAlign.configure({ types: ['paragraph', 'heading'] }),
    BubbleMenuPreset.configure({
      // items is optional; defaults to the full preset shown below.
      // items: [
      //   'undo','redo',
      //   'fontFamily','fontSize',
      //   'bold','italic','underline',
      //   'textColor','highlightColor',
      //   'link','align',
      // ],
      // optional overrides:
      // textColors, highlightColors, fonts, fontSizes, alignments,
      // className, injectStyles, options (placement/offset/flip...), shouldShow, appendTo
    }),
  ],
})
```

## What you get
- Built-in controls with sensible defaults and hover states; white background, ~20% radius.
- Swatch grids for text and highlight colors + “None” + custom color input; auto-repositions via `setMeta('bubbleMenu','updatePosition')`.
- Disables buttons if commands are absent. If you pass your own `element`, the preset won’t inject its own.

## Options (overrides)
- `items`: order of built-ins. Defaults: `['undo','redo','fontFamily','fontSize','bold','italic','underline','textColor','highlightColor','link','align']`.
- `textColors`, `highlightColors`: palettes (arrays of strings).
- `fonts`, `fontSizes`, `alignments`: dropdown choices.
- `className`: extra class on the root element.
- `injectStyles`: set `false` to provide your own styles.
- `options`: forwarded to Floating UI via `@blockslides/extension-bubble-menu` (`placement`, `strategy`, `offset`, `flip`, `shift`, etc.).
- `shouldShow`, `appendTo`, `pluginKey`, `updateDelay`, `resizeDelay`, `getReferencedVirtualElement`: same semantics as the base bubble menu.

## Notes
- Highlight color requires `Highlight.configure({ multicolor: true })` to respect per-color values.
- Link prompt is simple; replace with your own UI by supplying a custom `element` or swapping the handler.
- If the menu size changes (e.g., palette open/close), the preset emits `setMeta('bubbleMenu','updatePosition')` to keep positioning correct.

