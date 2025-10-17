import { getNodeAtPosition } from '@autoartifacts/core'
import type { EditorState } from '@autoartifacts/pm/state'

import { findListItemPos } from './findListItemPos.js'

export const getNextListDepth = (typeOrName: string, state: EditorState) => {
  const listItemPos = findListItemPos(typeOrName, state)

  if (!listItemPos) {
    return false
  }

  const [, depth] = getNodeAtPosition(state, typeOrName, listItemPos.$pos.pos + 4)

  return depth
}
