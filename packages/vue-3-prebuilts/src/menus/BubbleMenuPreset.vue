<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@blockslides/extension-bubble-menu'
import { NodeSelection } from '@blockslides/pm/state'
import {
  type BubbleMenuPresetOptions,
  buildMenuElement,
  DEFAULT_ITEMS,
  DEFAULT_COLOR_PALETTE,
  DEFAULT_HIGHLIGHT_PALETTE,
  DEFAULT_FONTS,
  DEFAULT_FONT_SIZES,
  DEFAULT_ALIGNMENTS,
} from '@blockslides/extension-bubble-menu-preset'
import { isTextSelection, type Editor } from '@blockslides/core'

export interface BubbleMenuPresetProps extends Omit<BubbleMenuPresetOptions, 'element' | 'pluginKey'> {
  editor: Editor
  updateDelay?: number
  resizeDelay?: number
  appendTo?: HTMLElement | (() => HTMLElement)
  shouldShow?: BubbleMenuPluginProps['shouldShow']
  getReferencedVirtualElement?: () => any
  options?: any
}

const props = withDefaults(defineProps<BubbleMenuPresetProps>(), {
  injectStyles: true,
})

const pluginKey = 'bubbleMenuPreset'
const menuEl = ref<HTMLElement | null>(null)
let cleanup: (() => void) | undefined

const setupBubbleMenu = () => {
  const attachToEditor = props.editor

  if (!attachToEditor || (attachToEditor as any).isDestroyed) {
    return
  }

  // Cleanup previous instance if any
  if (cleanup) {
    cleanup()
    cleanup = undefined
  }

  const { element, cleanup: elementCleanup } = buildMenuElement(attachToEditor, {
    items: props.items ?? DEFAULT_ITEMS,
    className: props.className ?? '',
    injectStyles: props.injectStyles !== false,
    textColors: props.textColors ?? DEFAULT_COLOR_PALETTE,
    highlightColors: props.highlightColors ?? DEFAULT_HIGHLIGHT_PALETTE,
    fonts: props.fonts ?? DEFAULT_FONTS,
    fontSizes: props.fontSizes ?? DEFAULT_FONT_SIZES,
    alignments: props.alignments ?? DEFAULT_ALIGNMENTS,
    onTextAction: props.onTextAction,
    onImageReplace: props.onImageReplace,
  })

  menuEl.value = element
  cleanup = elementCleanup

  const defaultShouldShow: Exclude<BubbleMenuPluginProps['shouldShow'], null> = ({ state, editor }) => {
    const sel = state.selection
    const imageSelection =
      (sel instanceof NodeSelection && ['image', 'imageBlock'].includes((sel as any).node?.type?.name)) ||
      editor.isActive('image') ||
      editor.isActive('imageBlock')

    if (imageSelection) return true
    if (isTextSelection(sel) && !sel.empty && !imageSelection) return true
    return false
  }

  const plugin = BubbleMenuPlugin({
    editor: attachToEditor,
    element,
    updateDelay: props.updateDelay,
    resizeDelay: props.resizeDelay,
    appendTo: props.appendTo,
    pluginKey,
    shouldShow: props.shouldShow ?? defaultShouldShow,
    getReferencedVirtualElement: props.getReferencedVirtualElement,
    options: props.options,
  })

  attachToEditor.registerPlugin(plugin)
}

onMounted(() => {
  setupBubbleMenu()
})

// Watch for prop changes and rebuild
watch(
  () => [
    props.editor,
    props.updateDelay,
    props.resizeDelay,
    props.appendTo,
    props.shouldShow,
    props.getReferencedVirtualElement,
    props.options,
    props.items,
    props.className,
    props.injectStyles,
    props.textColors,
    props.highlightColors,
    props.fonts,
    props.fontSizes,
    props.alignments,
    props.onTextAction,
    props.onImageReplace,
  ],
  () => {
    setupBubbleMenu()
  }
)

onBeforeUnmount(() => {
  if (props.editor) {
    props.editor.unregisterPlugin(pluginKey)
  }
  if (cleanup) {
    cleanup()
  }
  if (menuEl.value?.parentNode) {
    menuEl.value.parentNode.removeChild(menuEl.value)
  }
})
</script>

<template>
  <!-- Vue doesn't need portal here as buildMenuElement handles DOM placement -->
  <div v-if="menuEl" style="display: none"></div>
</template>
