import type { RawCommands } from '../types.js'

declare module '@autoartifacts/core' {
  interface Commands<ReturnType> {
    blur: {
      /**
       * Removes focus from the editor.
       * @example editor.commands.blur()
       */
      blur: () => ReturnType
    }
  }
}

export const blur: RawCommands['blur'] =
  () =>
  ({ editor, view }) => {
    requestAnimationFrame(() => {
      if (!editor.isDestroyed) {
        ;(view.dom as HTMLElement).blur()

        window?.getSelection()?.removeAllRanges()
      }
    })

    return true
  }
