import { Extension, isNodeSelection, isTextSelection } from '@blockslides/core'
import type { Editor } from '@blockslides/core'
import {
  BubbleMenuPlugin,
  type BubbleMenuPluginProps,
  type BubbleMenuOptions,
} from '@blockslides/extension-bubble-menu'
import { NodeSelection } from '@blockslides/pm/state'

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

export const DEFAULT_ITEMS: BubbleMenuPresetItem[] = [
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

export const DEFAULT_FONTS = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Monaco',
]

export const DEFAULT_FONT_SIZES = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '32px',
  '40px',
  '48px',
  '56px',
  '64px',
  '72px',
]

export const DEFAULT_ALIGNMENTS: TextAlignValue[] = ['left', 'center', 'right', 'justify']

// A rich palette approximating the attached reference.
export const DEFAULT_COLOR_PALETTE: string[] = [
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

export const DEFAULT_HIGHLIGHT_PALETTE = DEFAULT_COLOR_PALETTE

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
      options: {
        placement: 'top',
        strategy: 'absolute',
        offset: 8,
        flip: {},
        shift: {},
      },
      shouldShow: ({ state, editor }) => {
        const { selection } = state
        const imageSelection =
          (selection instanceof NodeSelection &&
            ['image', 'imageBlock'].includes(selection.node.type.name)) ||
          editor.isActive('image') ||
          editor.isActive('imageBlock')

        if (imageSelection) return true
        if (isTextSelection(selection) && !selection.empty && !imageSelection) return true
        return false
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

export function buildMenuElement(
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

  const textToolbar = document.createElement('div')
  textToolbar.className = 'bs-bmp-toolbar'

  const imageToolbar = document.createElement('div')
  imageToolbar.className = 'bs-bmp-toolbar bs-bmp-toolbar-image'

  let fontFamilySelect: HTMLSelectElement | null = null
  let fontSizeSelect: HTMLSelectElement | null = null
  let imageAlignSelect: HTMLSelectElement | null = null
  let imageDisplaySelect: HTMLSelectElement | null = null

  const normalizeFontFamily = (value?: string | null) => {
    if (!value) return value
    // take the first family name and strip quotes
    return value.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '') || value
  }

  const getComputedFontStyles = () => {
    if (typeof window === 'undefined') return { fontFamily: undefined, fontSize: undefined }
    const sel = window.getSelection()
    const node = sel?.anchorNode
    const el = (node instanceof HTMLElement ? node : node?.parentElement) ?? undefined
    if (!el) return { fontFamily: undefined, fontSize: undefined }
    const styles = window.getComputedStyle(el)
    return {
      fontFamily: normalizeFontFamily(styles.fontFamily || undefined),
      fontSize: styles.fontSize || undefined,
    }
  }

  const isImageSelection = () => {
    const sel = editor.state.selection
    if (sel instanceof NodeSelection) {
      return ['image', 'imageBlock'].includes(sel.node.type.name)
    }
    return editor.isActive('image') || editor.isActive('imageBlock')
  }

  const getImageAttrs = () => {
    const sel = editor.state.selection
    if (sel instanceof NodeSelection && ['image', 'imageBlock'].includes(sel.node.type.name)) {
      return sel.node.attrs || {}
    }
    if (editor.isActive('imageBlock')) return editor.getAttributes('imageBlock') || {}
    return editor.getAttributes('image') || {}
  }

  const ensureOptionExists = (select: HTMLSelectElement, value: string) => {
    const exists = Array.from(select.options).some(opt => opt.value === value)
    if (!exists) {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value
      select.appendChild(option)
    }
  }

  const setSelectValue = (select: HTMLSelectElement | null, value?: string | null) => {
    if (!select) return
    if (!value) {
      select.selectedIndex = -1
      return
    }
    ensureOptionExists(select, value)
    select.value = value
  }

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
    popovers.forEach((p) => {
      p.classList.add('bs-bmp-hidden')
      p.style.display = 'none'
    })
  }

  const runWithFocus = (fn?: () => boolean) => {
    if (!fn) return false
    return !!fn()
  }

  const addButton = (
    container: HTMLElement,
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
    container.appendChild(btn)
  }

  const addUndoRedo = () => {
    const hasUndo = typeof getCommand('undo') === 'function'
    const hasRedo = typeof getCommand('redo') === 'function'
    addButton(textToolbar, 'undo', DEFAULT_LABELS.undo, () => runWithFocus(() => runChainCommand('undo')), {
      disabled: !hasUndo,
      title: 'Undo',
    })
    addButton(textToolbar, 'redo', DEFAULT_LABELS.redo, () => runWithFocus(() => runChainCommand('redo')), {
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
    fontFamilySelect = select
    wrapper.appendChild(select)
    textToolbar.appendChild(wrapper)
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
    fontSizeSelect = select
    wrapper.appendChild(select)
    textToolbar.appendChild(wrapper)
  }

  const addToggleMark = (item: BubbleMenuPresetItem, commandName: string, title: string) => {
    const fn = getCommand(commandName) as (() => boolean) | undefined
    const disabled = typeof fn !== 'function'
    addButton(
      textToolbar,
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
    textToolbar.appendChild(toggle)
    textToolbar.appendChild(popover)
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
    textToolbar.appendChild(toggle)
    textToolbar.appendChild(popover)
  }

  const addLink = () => {
    const hasToggle = typeof getCommand('toggleLink') === 'function'
    const hasUnset = typeof getCommand('unsetLink') === 'function'
    addButton(
      textToolbar,
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
    textToolbar.appendChild(wrapper)
  }

  const addImageControls = () => {
    const addImageButton = (label: string, title: string, handler: () => void) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'bs-bmp-btn bs-bmp-btn-image'
      btn.textContent = label
      btn.title = title
      btn.setAttribute('aria-label', title)
      btn.addEventListener('click', () => {
        closePopovers()
        handler()
      })
      imageToolbar.appendChild(btn)
    }

    const { popover: replacePopover, show: showReplacePopover } = createReplacePopover({
      getCurrentValue: () => (getImageAttrs().src as string) ?? '',
      onSave: (next) => {
        const chain = (editor.chain as any)?.()
        const runner = typeof chain?.focus === 'function' ? chain.focus() : chain
        if (editor.isActive('imageBlock') && typeof runner?.setImageBlockMetadata === 'function') {
          runner.setImageBlockMetadata({ src: next }).run?.()
        } else if (typeof runner?.updateAttributes === 'function') {
          runner.updateAttributes('image', { src: next }).run?.()
        } else if (typeof runner?.replaceImageBlock === 'function') {
          runner.replaceImageBlock({ src: next }).run?.()
        }
        editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
      },
    })
    popovers.push(replacePopover)
    imageToolbar.appendChild(replacePopover)
    addImageButton('Replace', 'Replace image', () => {
      closePopovers()
      showReplacePopover()
    })

    const alignWrapper = document.createElement('div')
    alignWrapper.className = 'bs-bmp-select'
    const alignSelect = document.createElement('select')
    alignSelect.className = 'bs-bmp-select-input'
    alignSelect.title = 'Align image'
    ;['left', 'center', 'right'].forEach((alignment) => {
      const option = document.createElement('option')
      option.value = alignment
      option.textContent = alignment.charAt(0).toUpperCase() + alignment.slice(1)
      alignSelect.appendChild(option)
    })
    alignSelect.addEventListener('change', () => {
      const value = alignSelect.value
      const chain = (editor.chain as any)?.()
      const runner = typeof chain?.focus === 'function' ? chain.focus() : chain
      if (editor.isActive('imageBlock') && typeof runner?.setImageBlockAlignment === 'function') {
        runner.setImageBlockAlignment(value).run?.()
      } else if (typeof runner?.updateAttributes === 'function') {
        runner.updateAttributes('image', { align: value }).run?.()
      }
      editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
    })
    alignWrapper.appendChild(alignSelect)
    imageToolbar.appendChild(alignWrapper)
    imageAlignSelect = alignSelect

    const displayWrapper = document.createElement('div')
    displayWrapper.className = 'bs-bmp-select'
    const displaySelect = document.createElement('select')
    displaySelect.className = 'bs-bmp-select-input'
    displaySelect.title = 'Image fit'
    ;['default', 'cover', 'contain', 'fill'].forEach((mode) => {
      const option = document.createElement('option')
      option.value = mode
      option.textContent = mode.charAt(0).toUpperCase() + mode.slice(1)
      displaySelect.appendChild(option)
    })
    displaySelect.addEventListener('change', () => {
      const value = displaySelect.value
      const chain = (editor.chain as any)?.()
      const runner = typeof chain?.focus === 'function' ? chain.focus() : chain
      if (editor.isActive('imageBlock') && typeof runner?.setImageBlockLayout === 'function') {
        if (value === 'cover' && typeof runner?.setImageBlockFullBleed === 'function') {
          runner.setImageBlockFullBleed(true)
        }
        runner.setImageBlockLayout(value === 'default' ? 'cover' : value).run?.()
      } else if (typeof runner?.updateAttributes === 'function') {
        runner.updateAttributes('image', { display: value }).run?.()
      }
      editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
    })
    displayWrapper.appendChild(displaySelect)
    imageToolbar.appendChild(displayWrapper)
    imageDisplaySelect = displaySelect

    addImageButton('Full width', 'Set image width to 100%', () => {
      const chain = (editor.chain as any)?.()
      const runner = typeof chain?.focus === 'function' ? chain.focus() : chain
      if (editor.isActive('imageBlock') && typeof runner?.setImageBlockDimensions === 'function') {
        runner.setImageBlockDimensions({ width: '100%', height: null }).run?.()
      } else if (typeof runner?.updateAttributes === 'function') {
        runner.updateAttributes('image', { width: '100%', height: null }).run?.()
      }
      editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
    })

    const { popover: altPopover, show: showAltPopover } = createAltPopover({
      getCurrentValue: () => (getImageAttrs().alt as string) ?? '',
      onSave: (next) => {
        const chain = (editor.chain as any)?.()
        const runner = typeof chain?.focus === 'function' ? chain.focus() : chain
        if (editor.isActive('imageBlock') && typeof runner?.setImageBlockMetadata === 'function') {
          runner.setImageBlockMetadata({ alt: next }).run?.()
        } else if (typeof runner?.updateAttributes === 'function') {
          runner.updateAttributes('image', { alt: next }).run?.()
        }
        editor.commands.setMeta?.('bubbleMenu', 'updatePosition')
      },
    })
    popovers.push(altPopover)
    imageToolbar.appendChild(altPopover)
    addImageButton('Alt', 'Set alt text', () => {
      closePopovers()
      showAltPopover()
    })

    addImageButton('Delete', 'Delete image', () => {
      editor.chain().focus().deleteSelection().run()
    })
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

  addImageControls()

  element.appendChild(textToolbar)
  element.appendChild(imageToolbar)

  const syncSelectionState = () => {
    if (isImageSelection()) return
    const attrs = editor.getAttributes('textStyle') || {}
    let family = attrs.fontFamily
    let size = attrs.fontSize

    // If not explicitly set via marks, fall back to computed DOM styles
    if (!family || !size) {
      const computed = getComputedFontStyles()
      family = family || computed.fontFamily
      size = size || computed.fontSize
    }

    setSelectValue(fontFamilySelect, normalizeFontFamily(family))
    setSelectValue(fontSizeSelect, size)
  }

  const syncImageState = () => {
    if (!isImageSelection()) return
    const attrs = getImageAttrs()
    const fitValue = editor.isActive('imageBlock')
      ? (attrs.layout as string | undefined) || 'cover'
      : (attrs.display as string | undefined) || 'default'
    setSelectValue(imageAlignSelect, attrs.align as string | undefined)
    setSelectValue(imageDisplaySelect, fitValue)
  }

  const syncToolbarVisibility = () => {
    const imageVisible = isImageSelection()
    textToolbar.style.display = imageVisible ? 'none' : ''
    imageToolbar.style.display = imageVisible ? '' : 'none'
  }

  const handleSelectionUpdate = () => {
    syncToolbarVisibility()
    syncSelectionState()
    syncImageState()
  }
  const handleTransaction = ({ transaction }: { transaction?: any }) => {
    if (!transaction || transaction.docChanged || transaction.selectionSet) {
      handleSelectionUpdate()
    }
  }

  editor.on('selectionUpdate', handleSelectionUpdate)
  editor.on('transaction', handleTransaction)
  cleanupFns.push(() => {
    editor.off('selectionUpdate', handleSelectionUpdate)
    editor.off('transaction', handleTransaction)
  })

  syncToolbarVisibility()
  syncSelectionState()
  syncImageState()

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

function createAltPopover(args: { getCurrentValue: () => string; onSave: (value: string) => void }) {
  const popover = document.createElement('div')
  popover.className = 'bs-bmp-popover bs-bmp-popover-alt bs-bmp-hidden'

  const input = document.createElement('input')
  input.type = 'text'
  input.className = 'bs-bmp-text-input'
  input.placeholder = 'Describe the image'
  popover.appendChild(input)

  const actions = document.createElement('div')
  actions.className = 'bs-bmp-popover-actions'

  const cancel = document.createElement('button')
  cancel.type = 'button'
  cancel.className = 'bs-bmp-btn bs-bmp-btn-ghost'
  cancel.textContent = 'Cancel'
  cancel.addEventListener('click', () => hide())

  const save = document.createElement('button')
  save.type = 'button'
  save.className = 'bs-bmp-btn'
  save.textContent = 'Save'
  save.addEventListener('click', () => {
    args.onSave(input.value.trim())
    hide()
  })

  actions.appendChild(cancel)
  actions.appendChild(save)
  popover.appendChild(actions)

  const hide = () => popover.classList.add('bs-bmp-hidden')
  const show = () => {
    input.value = args.getCurrentValue()
    popover.classList.remove('bs-bmp-hidden')
    popover.style.display = ''
    input.focus()
    input.select()
  }

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      save.click()
    }
    if (event.key === 'Escape') hide()
  })

  hide()
  return { popover, show, hide }
}

function createReplacePopover(args: { getCurrentValue: () => string; onSave: (value: string) => void }) {
  const popover = document.createElement('div')
  popover.className = 'bs-bmp-popover bs-bmp-popover-replace bs-bmp-hidden'

  const input = document.createElement('input')
  input.type = 'url'
  input.className = 'bs-bmp-text-input'
  input.placeholder = 'https://...'
  popover.appendChild(input)

  const actions = document.createElement('div')
  actions.className = 'bs-bmp-popover-actions'

  const cancel = document.createElement('button')
  cancel.type = 'button'
  cancel.className = 'bs-bmp-btn bs-bmp-btn-ghost'
  cancel.textContent = 'Cancel'
  cancel.addEventListener('click', () => hide())

  const save = document.createElement('button')
  save.type = 'button'
  save.className = 'bs-bmp-btn'
  save.textContent = 'Replace'
  save.addEventListener('click', () => {
    const val = input.value.trim()
    if (!val) return
    args.onSave(val)
    hide()
  })

  actions.appendChild(cancel)
  actions.appendChild(save)
  popover.appendChild(actions)

  const hide = () => {
    popover.classList.add('bs-bmp-hidden')
    popover.style.display = 'none'
  }
  const show = () => {
    input.value = args.getCurrentValue()
    popover.classList.remove('bs-bmp-hidden')
    popover.style.display = ''
    input.focus()
    input.select()
  }

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      save.click()
    }
    if (event.key === 'Escape') hide()
  })

  hide()
  return { popover, show, hide }
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
  display: none !important;
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
.bs-bmp-popover-alt,
.bs-bmp-popover-replace {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 260px;
}
.bs-bmp-text-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 13px;
}
.bs-bmp-popover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}
`

  document.head.appendChild(style)
}





