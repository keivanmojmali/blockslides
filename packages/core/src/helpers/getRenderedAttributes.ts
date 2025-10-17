/**
 * Get rendered attributes
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { Mark, Node } from 'prosemirror-model'
import type { ExtensionAttribute } from '../types/extensions.js'
import { mergeAttributes } from '../utils/mergeAttributes.js'

/**
 * Get rendered HTML attributes for a node or mark.
 * Filters attributes by type, then processes renderHTML if defined.
 * 
 * @param nodeOrMark - The ProseMirror node or mark
 * @param extensionAttributes - All extension attributes
 * @returns The rendered HTML attributes object
 */
export function getRenderedAttributes(
  nodeOrMark: Node | Mark,
  extensionAttributes: ExtensionAttribute[]
): Record<string, any> {
  return extensionAttributes
    .filter(attribute => attribute.type === nodeOrMark.type.name)
    .filter(item => item.attribute.rendered)
    .map(item => {
      if (!item.attribute.renderHTML) {
        return {
          [item.name]: nodeOrMark.attrs[item.name],
        }
      }

      return item.attribute.renderHTML(nodeOrMark.attrs) || {}
    })
    .reduce(
      (attributes, attribute) => mergeAttributes(attributes, attribute),
      {}
    )
}
