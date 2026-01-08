import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useCurrentEditor } from '../Context.js'
import {
  BubbleMenuPlugin,
  type BubbleMenuPluginProps,
} from '@blockslides/extension-bubble-menu'
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
import { isNodeSelection, isTextSelection, type Editor } from '@blockslides/core'

export type BubbleMenuPresetProps = Omit<BubbleMenuPresetOptions, 'element'> &
  React.HTMLAttributes<HTMLElement> & {
    editor?: Editor | null
  }

export const BubbleMenuPreset = React.forwardRef<HTMLElement, BubbleMenuPresetProps>(
  (
    {
      pluginKey = 'bubbleMenuPreset',
      editor,
      updateDelay,
      resizeDelay,
      appendTo,
      shouldShow,
      getReferencedVirtualElement,
      options,
      items,
      className,
      injectStyles,
      textColors,
      highlightColors,
      fonts,
      fontSizes,
      alignments,
      ...rest
    },
    ref,
  ) => {
    const { editor: currentEditor } = useCurrentEditor()
    const menuEl = useRef<HTMLElement | null>(null)

    useEffect(() => {
      const attachToEditor = (editor || currentEditor) as Editor | null
      if (!attachToEditor || (attachToEditor as any).isDestroyed) {
        return
      }

      const { element, cleanup } = buildMenuElement(attachToEditor, {
        items: items ?? DEFAULT_ITEMS,
        className: className ?? '',
        injectStyles: injectStyles !== false,
        textColors: textColors ?? DEFAULT_COLOR_PALETTE,
        highlightColors: highlightColors ?? DEFAULT_HIGHLIGHT_PALETTE,
        fonts: fonts ?? DEFAULT_FONTS,
        fontSizes: fontSizes ?? DEFAULT_FONT_SIZES,
        alignments: alignments ?? DEFAULT_ALIGNMENTS,
      })

      menuEl.current = element

      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLElement | null>).current = element
      }

      const defaultShouldShow: Exclude<BubbleMenuPluginProps['shouldShow'], null> = ({
        state,
        editor,
      }) => {
        const sel = state.selection
        const imageSelection =
          (sel instanceof NodeSelection &&
            ['image', 'imageBlock'].includes((sel as any).node?.type?.name)) ||
          editor.isActive('image') ||
          editor.isActive('imageBlock')

        if (imageSelection) return true
        if (isTextSelection(sel) && !sel.empty && !imageSelection) return true
        return false
      }

      const plugin = BubbleMenuPlugin({
        editor: attachToEditor,
        element,
        updateDelay,
        resizeDelay,
        appendTo,
        pluginKey,
        shouldShow: shouldShow ?? defaultShouldShow,
        getReferencedVirtualElement,
        options,
      })

      attachToEditor.registerPlugin(plugin)

      return () => {
        attachToEditor.unregisterPlugin(pluginKey)
        cleanup?.()
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      }
    }, [
      editor,
      currentEditor,
      pluginKey,
      updateDelay,
      resizeDelay,
      appendTo,
      shouldShow,
      getReferencedVirtualElement,
      options,
      items,
      className,
      injectStyles,
      textColors,
      highlightColors,
      fonts,
      fontSizes,
      alignments,
      ref,
    ])

    return menuEl.current ? createPortal(<div {...rest} />, menuEl.current) : null
  },
)

BubbleMenuPreset.displayName = 'BubbleMenuPreset'
