/**
 * Sort extensions by priority
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { AnyConfig, Extensions } from '../types/extensions.js'
import { getExtensionField } from './getExtensionField.js'

/**
 * Sort extensions by priority.
 * Higher priority extensions come first.
 * 
 * @param extensions - An array of Tiptap extensions
 * @returns A sorted array of Tiptap extensions by priority
 */
export function sortExtensions(extensions: Extensions): Extensions {
  const defaultPriority = 100

  return extensions.sort((a, b) => {
    const priorityA = getExtensionField<AnyConfig['priority']>(a, 'priority') || defaultPriority
    const priorityB = getExtensionField<AnyConfig['priority']>(b, 'priority') || defaultPriority

    if (priorityA > priorityB) {
      return -1
    }

    if (priorityA < priorityB) {
      return 1
    }

    return 0
  })
}
