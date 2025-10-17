/**
 * Split extensions by type
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { Extension } from '../Extension.js'
import type { Mark } from '../Mark.js'
import type { Node } from '../Node.js'
import type { Extensions } from '../types/extensions.js'

/**
 * Split extensions into base extensions, node extensions, and mark extensions.
 * 
 * @param extensions - Array of all extensions
 * @returns Object with baseExtensions, nodeExtensions, and markExtensions arrays
 */
export function splitExtensions(extensions: Extensions) {
  const baseExtensions = extensions.filter(
    extension => extension.type === 'extension'
  ) as Extension[]
  
  const nodeExtensions = extensions.filter(
    extension => extension.type === 'node'
  ) as Node[]
  
  const markExtensions = extensions.filter(
    extension => extension.type === 'mark'
  ) as Mark[]

  return {
    baseExtensions,
    nodeExtensions,
    markExtensions,
  }
}
