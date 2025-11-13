// @ts-ignore
// TODO: add types to @types/prosemirror-commands
import { selectTextblockStart as originalSelectTextblockStart } from '@blockslides/pm/commands'

import type { RawCommands } from '../types.js'

declare module '@blockslides/core' {
  interface Commands<ReturnType> {
    selectTextblockStart: {
      /**
       * Moves the cursor to the start of current text block.
       * @example editor.commands.selectTextblockStart()
       */
      selectTextblockStart: () => ReturnType
    }
  }
}

export const selectTextblockStart: RawCommands['selectTextblockStart'] =
  () =>
  ({ state, dispatch }) => {
    return originalSelectTextblockStart(state, dispatch)
  }
