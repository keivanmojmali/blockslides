import { Extension } from '@blockslides/core'
import type { Editor } from '@blockslides/core'
import {
  BubbleMenuPlugin,
  type BubbleMenuPluginProps,
  type BubbleMenuOptions,
} from '@blockslides/extension-bubble-menu'

type BubbleMenuPresetItem =
  | 'undo'
  | 'redo'
  | 'fontFamily'
  | 'fontSize'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'textColor'
  | 'highlightColor'
  | 'link'
  | 'align'

type TextAlignValue = 'left' | 'center' | 'right' | 'justify'

export interface BubbleMenuPresetOptions
  extends Omit<BubbleMenuOptions, 'element'> {
  /**
   * Optional custom element to use for the menu. If omitted, a default
   * element with built-in buttons is rendered.
   */
  element?: HTMLElement | null

  /**
   * Order of built-in controls to render.
   */
  items?: BubbleMenuPresetItem[]

  /**
   * Additional class names to attach to the menu element to allow easy
   * style overrides.
   */
  className?: string

  /**
   * Inject default CSS. Set to false to opt out if you provide your own styles.
   */
  injectStyles?: boolean

  /**
   * Palette for text color swatches.
   */
  textColors?: string[]

  /**
   * Palette for highlight swatches.
   */
  highlightColors?: string[]

  /**
   * Fonts exposed in the font picker.
   */
  fonts?: string[]

  /**
   * Font sizes (any CSS length, e.g. "16px", "1rem").
   */
  fontSizes?: string[]

  /**
   * Alignments to expose in the align control.
   */
  alignments?: TextAlignValue[]
}

type Cleanup = () => void

const STYLE_ID = 'blockslides-bubble-menu-preset-styles'

const DEFAULT_ITEMS: BubbleMenuPresetItem[] = [
  'undo',
  'redo',
  'fontFamily',
  'fontSize',
  'bold',
  'italic',
  'underline',
  'textColor',
  'highlightColor',
  'link',
  'align',
]

const DEFAULT_FONTS = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Monaco',
]

const DEFAULT_FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px']

const DEFAULT_ALIGNMENTS: TextAlignValue[] = ['left', 'center', 'right', 'justify']

// A rich palette approximating the attached reference.
const DEFAULT_COLOR_PALETTE: string[] = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#cccccc',
  '#d9d9d9',
  '#efefef',
  '#f3f3f3',
  '#ffffff',
  '#e60000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#4a86e8',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
  '#f4cccc',
  '#fce5cd',
  '#fff2cc',
  '#d9ead3',
  '#d0e0e3',
  '#cfe2f3',
  '#d9d2e9',
  '#ead1dc',
  '#f9cb9c',
  '#ffe599',
  '#b6d7a8',
  '#a2c4c9',
  '#9fc5e8',
  '#b4a7d6',
  '#d5a6bd',
  '#e06666',
  '#f6b26b',
  '#ffd966',
  '#93c47d',
  '#76a5af',
  '#6fa8dc',
  '#8e7cc3',
  '#c27ba0',
  '#cc0000',
  '#e69138',
  '#f1c232',
  '#6aa84f',
  '#45818e',
  '#3d85c6',
  '#674ea7',
  '#a64d79',
  '#990000',
  '#b45f06',
  '#bf9000',
  '#38761d',
  '#134f5c',
  '#0b5394',
  '#351c75',
  '#741b47',
  '#660000',
  '#783f04',
  '#7f6000',
  '#274e13',
  '#0c343d',
  '#073763',
  '#20124d',
  '#4c1130',
]

const DEFAULT_HIGHLIGHT_PALETTE = DEFAULT_COLOR_PALETTE

const DEFAULT_LABELS: Record<BubbleMenuPresetItem, string> = {
  undo: 'Undo',
  redo: 'Redo',
  fontFamily: 'Font',
  fontSize: 'Size',
  bold: 'B',
  italic: 'I',
  underline: 'U',
  textColor: 'A',
  highlightColor: 'Hi',
  link: 'Link',
  align: 'Align',
}

const ICONS = {
  textColor: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20h14"/><path d="M7 20l5-14 5 14"/><path d="M10.7 14h2.6"/></svg>`,
  highlightColor: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 18 2-2h6"/><path d="m2 22 3-3h6l3-3-6-6-3 3v6z"/><path d="M14 7l3-3 3 3-3 3z"/></svg>`,
}

interface MenuBuildResult {
  element: HTMLElement
  cleanup: Cleanup
}

export const BubbleMenuPreset = Extension.create<BubbleMenuPresetOptions>({
  name: 'bubbleMenuPreset',

  addOptions() {
    return {
      element: null,
      items: DEFAULT_ITEMS,
      className: '',
      injectStyles: true,
      textColors: DEFAULT_COLOR_PALETTE,
      highlightColors: DEFAULT_HIGHLIGHT_PALETTE,
      fonts: DEFAULT_FONTS,
      fontSizes: DEFAULT_FONT_SIZES,
      alignments: DEFAULT_ALIGNMENTS,
      pluginKey: 'bubbleMenuPreset',
      updateDelay: 250,
      resizeDelay: 60,
      appendTo: undefined,
      shouldShow: null,
      options: {
        placement: 'top',
        strategy: 'absolute',
        offset: 8,
        flip: {},
        shift: {},
      },
    }
  },

  addProseMirrorPlugins() {
    const options = this.options
    const editor = this.editor

    const usingCustomElement = !!options.element
    const { element, cleanup } =
      options.element && typeof document !== 'undefined'
        ? { element: options.element, cleanup: () => {} }
        : buildMenuElement(editor, {
            items: options.items ?? DEFAULT_ITEMS,
            className: options.className ?? '',
            injectStyles: options.injectStyles !== false,
            textColors: options.textColors ?? DEFAULT_COLOR_PALETTE,
            highlightColors: options.highlightColors ?? DEFAULT_HIGHLIGHT_PALETTE,
            fonts: options.fonts ?? DEFAULT_FONTS,
            fontSizes: options.fontSizes ?? DEFAULT_FONT_SIZES,
            alignments: options.alignments ?? DEFAULT_ALIGNMENTS,
          })

    this.storage.element = element
    this.storage.cleanup = cleanup
    this.storage.usingCustomElement = usingCustomElement

    const pluginOptions: BubbleMenuPluginProps = {
      pluginKey: options.pluginKey ?? 'bubbleMenuPreset',
      editor,
      element: element,
      updateDelay: options.updateDelay,
      resizeDelay: options.resizeDelay,
      appendTo: options.appendTo,
      options: options.options,
      getReferencedVirtualElement: options.getReferencedVirtualElement,
      shouldShow: options.shouldShow ?? undefined,
    }

    return [BubbleMenuPlugin(pluginOptions)]
  },

  onDestroy() {
    const el = this.storage.element as HTMLElement | undefined
    const cleanup = this.storage.cleanup as Cleanup | undefined
    const usingCustomElement = this.storage.usingCustomElement as boolean | undefined
    if (cleanup) {
      cleanup()
    }
    if (el && !usingCustomElement) {
      el.remove()
    }
  },
})

function buildMenuElement(
  editor: Editor,
  opts: {
    items: BubbleMenuPresetItem[]
    className: string
    injectStyles: boolean
    textColors: string[]
    highlightColors: string[]
    fonts: string[]
    fontSizes: string[]
    alignments: TextAlignValue[]
  },
): MenuBuildResult {
  if (opts.injectStyles) {
    injectStyles()
  }

  const element = document.createElement('div')
  element.className = `bs-bubble-menu-preset ${opts.className ?? ''}`.trim()
  element.setAttribute('data-bubble-menu-preset', 'true')
  element.tabIndex = 0

  const toolbar = document.createElement('div')
  toolbar.className = 'bs-bmp-toolbar'

  const popovers: HTMLElement[] = []
  const cleanupFns: Cleanup[] = []

  const getCommand = (name: string): any => (editor.commands as any)?.[name]
  const runChainCommand = (name: string, ...args: any[]) => {
    const chain = (editor.chain as any)?.()
    if (!chain || typeof chain[name] !== 'function') return false
    const runner = typeof chain.focus === 'function' ? chain.focus() : chain
    if (typeof runner[name] !== 'function') return false
    return runner[name](...args).run?.() ?? false
  }

  const closePopovers = () => {
    popovers.forEach((p) => p.classList.add('bs-bmp-hidden'))
  }

  const runWithFocus = (fn?: () => boolean) => {
    if (!fn) return false
    return !!fn()
  }

  const addButton = (
    item: BubbleMenuPresetItem,
    label: string,
    onClick: () => void,
    opts: { disabled?: boolean; title?: string } = {},
  ) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = `bs-bmp-btn bs-bmp-btn-${item}`
    btn.textContent = label
    if (opts.title) {
      btn.title = opts.title
      btn.setAttribute('aria-label', opts.title)
    }
    if (opts.disabled) {
      btn.disabled = true
      btn.classList.add('bs-bmp-disabled')
    } else {
      btn.addEventListener('click', () => {
        closePopovers()
        onClick()
      })
    }
    toolbar.appendChild(btn)
  }

  const addUndoRedo = () => {
    const hasUndo = typeof getCommand('undo') === 'function'
    const hasRedo = typeof getCommand('redo') === 'function'
    addButton('undo', DEFAULT_LABELS.undo, () => runWithFocus(() => runChainCommand('undo')), {
      disabled: !hasUndo,
      title: 'Undo',
    })
    addButton('redo', DEFAULT_LABELS.redo, () => runWithFocus(() => runChainCommand('redo')), {
      disabled: !hasRedo,
      title: 'Redo',
    })
  }

  const addFontFamily = () => {
    const hasCommand = typeof getCommand('setFontFamily') === 'function'
    const wrapper = document.createElement('div')
    wrapper.className = 'bs-bmp-select'
    const select = document.createElement('select')
    select.className = 'bs-bmp-select-input'
    select.title = 'Font family'
    opts.fonts.forEach((font) => {
      const option = document.createElement('option')
      option.value = font
      option.textContent = font
      option.style.fontFamily = font
      select.appendChild(option)
    })
    select.disabled = !hasCommand
    select.addEventListener('change', () => {
      runWithFocus(() => runChainCommand('setFontFamily', select.value))
      editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
    })
    wrapper.appendChild(select)
    toolbar.appendChild(wrapper)
  }

  const addFontSize = () => {
    const hasCommand = typeof getCommand('setFontSize') === 'function'
    const wrapper = document.createElement('div')
    wrapper.className = 'bs-bmp-select'
    const select = document.createElement('select')
    select.className = 'bs-bmp-select-input'
    select.title = 'Font size'
    opts.fontSizes.forEach((size) => {
      const option = document.createElement('option')
      option.value = size
      option.textContent = size
      select.appendChild(option)
    })
    select.disabled = !hasCommand
    select.addEventListener('change', () => {
      runWithFocus(() => runChainCommand('setFontSize', select.value))
      editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
    })
    wrapper.appendChild(select)
    toolbar.appendChild(wrapper)
  }

  const addToggleMark = (item: BubbleMenuPresetItem, commandName: string, title: string) => {
    const fn = getCommand(commandName) as (() => boolean) | undefined
    const disabled = typeof fn !== 'function'
    addButton(
      item,
      DEFAULT_LABELS[item],
      () => {
        runWithFocus(() => runChainCommand(commandName))
      },
      { disabled, title },
    )
  }

  const addTextColor = () => {
    const hasSet = typeof getCommand('setColor') === 'function'
    const hasUnset = typeof getCommand('unsetColor') === 'function'
    const { popover, toggle, destroy } = createColorPopover({
      label: DEFAULT_LABELS.textColor,
      title: 'Text color',
      colors: opts.textColors,
      onSelect: (color) => {
        if (!hasSet) return
        runWithFocus(() => runChainCommand('setColor', color))
        editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
      },
      onClear: () => {
        if (!hasUnset) return
        runWithFocus(() => runChainCommand('unsetColor'))
        editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
      },
      onToggle: () => editor.commands.setMeta?.('bubbleMenu', 'updatePosition'),
    })
    popovers.push(popover)
    cleanupFns.push(destroy)
    toolbar.appendChild(toggle)
    toolbar.appendChild(popover)
  }

  const addHighlightColor = () => {
    const hasToggle = typeof getCommand('toggleHighlight') === 'function'
    const hasUnset = typeof getCommand('unsetHighlight') === 'function'
    const { popover, toggle, destroy } = createColorPopover({
      label: DEFAULT_LABELS.highlightColor,
      title: 'Highlight color',
      colors: opts.highlightColors,
      onSelect: (color) => {
        if (!hasToggle) return
        runWithFocus(() => runChainCommand('toggleHighlight', { color }))
        editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
      },
      onClear: () => {
        if (!hasUnset) return
        runWithFocus(() => runChainCommand('unsetHighlight'))
        editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
      },
      onToggle: () => editor.commands.setMeta?.('bubbleMenu', 'updatePosition'),
    })
    popovers.push(popover)
    cleanupFns.push(destroy)
    toolbar.appendChild(toggle)
    toolbar.appendChild(popover)
  }

  const addLink = () => {
    const hasToggle = typeof getCommand('toggleLink') === 'function'
    const hasUnset = typeof getCommand('unsetLink') === 'function'
    addButton(
      'link',
      DEFAULT_LABELS.link,
      () => {
        const currentHref = editor.getAttributes('link')?.href ?? ''
        const href = window.prompt('Link URL', currentHref)
        if (href === null) return
        if (!href) {
          if (hasUnset) {
            runWithFocus(() => runChainCommand('unsetLink'))
          }
          return
        }
        if (hasToggle) {
          runWithFocus(() => runChainCommand('toggleLink', { href }))
        }
      },
      { disabled: !hasToggle && !hasUnset, title: 'Insert link' },
    )
  }

  const addAlign = () => {
    const hasSet = typeof getCommand('setTextAlign') === 'function'
    const hasToggle = typeof getCommand('toggleTextAlign') === 'function'
    const wrapper = document.createElement('div')
    wrapper.className = 'bs-bmp-select'
    const select = document.createElement('select')
    select.className = 'bs-bmp-select-input'
    select.title = 'Align'
    opts.alignments.forEach((alignment) => {
      const option = document.createElement('option')
      option.value = alignment
      option.textContent = alignment.charAt(0).toUpperCase() + alignment.slice(1)
      select.appendChild(option)
    })
    select.disabled = !hasSet && !hasToggle
    select.addEventListener('change', () => {
      if (hasToggle) {
        runWithFocus(() => runChainCommand('toggleTextAlign', select.value))
      } else if (hasSet) {
        runWithFocus(() => runChainCommand('setTextAlign', select.value))
      }
      editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
    })
    wrapper.appendChild(select)
    toolbar.appendChild(wrapper)
  }

  // Build in the order requested.
  opts.items.forEach((item) => {
    switch (item) {
      case 'undo':
        addUndoRedo()
        break
      case 'redo':
        // handled in undo block to keep buttons together; skip.
        break
      case 'fontFamily':
        addFontFamily()
        break
      case 'fontSize':
        addFontSize()
        break
      case 'bold':
        addToggleMark('bold', 'toggleBold', 'Bold')
        break
      case 'italic':
        addToggleMark('italic', 'toggleItalic', 'Italic')
        break
      case 'underline':
        addToggleMark('underline', 'toggleUnderline', 'Underline')
        break
      case 'textColor':
        addTextColor()
        break
      case 'highlightColor':
        addHighlightColor()
        break
      case 'link':
        addLink()
        break
      case 'align':
        addAlign()
        break
      default:
        break
    }
  })

  element.appendChild(toolbar)

  return {
    element,
    cleanup: () => {
      popovers.forEach((p) => p.remove())
      cleanupFns.forEach((fn) => fn())
      element.replaceChildren()
    },
  }
}

function createColorPopover(args: {
  label: string
  title: string
  colors: string[]
  onSelect: (color: string) => void
  onClear: () => void
  onToggle?: () => void
}): { toggle: HTMLElement; popover: HTMLElement; destroy: () => void } {
  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'bs-bmp-btn bs-bmp-btn-color'
  toggle.title = args.title
  toggle.setAttribute('aria-expanded', 'false')
  toggle.setAttribute('aria-label', args.title)
  if (args.label === DEFAULT_LABELS.textColor && ICONS.textColor) {
    toggle.innerHTML = ICONS.textColor
  } else if (args.label === DEFAULT_LABELS.highlightColor && ICONS.highlightColor) {
    toggle.innerHTML = ICONS.highlightColor
  } else {
    toggle.textContent = args.label
  }

  const popover = document.createElement('div')
  popover.className = 'bs-bmp-popover bs-bmp-hidden'
  popover.setAttribute('role', 'menu')

  const header = document.createElement('div')
  header.className = 'bs-bmp-popover-header'
  const noneBtn = document.createElement('button')
  noneBtn.type = 'button'
  noneBtn.className = 'bs-bmp-btn bs-bmp-btn-ghost'
  noneBtn.textContent = 'None'
  noneBtn.addEventListener('click', () => {
    args.onClear()
    hide()
  })
  header.appendChild(noneBtn)
  popover.appendChild(header)

  const grid = document.createElement('div')
  grid.className = 'bs-bmp-color-grid'
  const columns = 10
  grid.style.setProperty('--bs-bmp-grid-columns', String(columns))

  args.colors.forEach((color) => {
    const swatch = document.createElement('button')
    swatch.type = 'button'
    swatch.className = 'bs-bmp-color-swatch'
    swatch.style.backgroundColor = color
    swatch.setAttribute('aria-label', color)
    swatch.addEventListener('click', (event) => {
      event.stopPropagation()
      args.onSelect(color)
      hide()
    })
    grid.appendChild(swatch)
  })

  popover.appendChild(grid)

  const customRow = document.createElement('div')
  customRow.className = 'bs-bmp-popover-footer'
  const customLabel = document.createElement('span')
  customLabel.textContent = 'Custom'
  const customInput = document.createElement('input')
  customInput.type = 'color'
  customInput.className = 'bs-bmp-color-input'
  customInput.addEventListener('input', () => {
    args.onSelect(customInput.value)
  })
  customRow.appendChild(customLabel)
  customRow.appendChild(customInput)
  popover.appendChild(customRow)

  const hide = () => {
    popover.classList.add('bs-bmp-hidden')
    toggle.setAttribute('aria-expanded', 'false')
    args.onToggle?.()
  }

  const show = () => {
    popover.classList.remove('bs-bmp-hidden')
    toggle.setAttribute('aria-expanded', 'true')
    args.onToggle?.()
  }

  const toggleHandler = (event: MouseEvent) => {
    event.stopPropagation()
    if (popover.classList.contains('bs-bmp-hidden')) {
      show()
    } else {
      hide()
    }
  }
  toggle.addEventListener('click', toggleHandler)

  const outsideHandler = (event: MouseEvent) => {
    if (popover.contains(event.target as Node) || toggle.contains(event.target as Node)) {
      return
    }
    hide()
  }

  document.addEventListener(
    'click',
    outsideHandler,
    { capture: true },
  )

  const destroy = () => {
    document.removeEventListener('click', outsideHandler, { capture: true } as any)
    toggle.removeEventListener('click', toggleHandler)
  }

  return { toggle, popover, destroy }
}

function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
.bs-bubble-menu-preset {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  color: #111827;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  z-index: 9999;
}
.bs-bmp-toolbar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.bs-bmp-btn {
  border: none;
  background: transparent;
  color: inherit;
  padding: 6px 8px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
}
.bs-bmp-btn:hover {
  background: #f3f4f6;
}
.bs-bmp-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.bs-bmp-select {
  display: inline-flex;
  align-items: center;
}
.bs-bmp-select-input {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: inherit;
  padding: 6px 12px 6px 10px;
  border-radius: 12px;
  font-size: 13px;
  outline: none;
}
.bs-bmp-select-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79,70,229,0.15);
}
.bs-bmp-popover {
  position: absolute;
  margin-top: 6px;
  padding: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.18);
  z-index: 999;
}
.bs-bmp-hidden {
  display: none;
}
.bs-bmp-popover-header,
.bs-bmp-popover-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.bs-bmp-btn-ghost {
  background: transparent;
  border: none;
  color: inherit;
  padding: 4px 6px;
  border-radius: 8px;
  cursor: pointer;
}
.bs-bmp-btn-ghost:hover {
  background: #f3f4f6;
}
.bs-bmp-color-grid {
  display: grid;
  grid-template-columns: repeat(var(--bs-bmp-grid-columns, 10), 22px);
  gap: 4px;
  margin-bottom: 8px;
}
.bs-bmp-color-swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  padding: 0;
}
.bs-bmp-color-swatch:hover {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}
.bs-bmp-color-input {
  width: 32px;
  height: 28px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}
`

  document.head.appendChild(style)
}





