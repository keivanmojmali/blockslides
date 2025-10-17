/**
 * Flatten extensions recursively
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { AnyConfig, Extensions } from '../types/extensions.js'
import { getExtensionField } from './getExtensionField.js'

/**
 * Create a flattened array of extensions by traversing the `addExtensions` field.
 * This recursively includes any extensions that an extension adds.
 * 
 * @param extensions - An array of Tiptap extensions
 * @returns A flattened array of Tiptap extensions
 */
export function flattenExtensions(extensions: Extensions): Extensions {
  return (
    extensions
      .map(extension => {
        const context = {
          name: extension.name,
          options: extension.options,
          storage: extension.storage,
        }

        const addExtensions = getExtensionField<AnyConfig['addExtensions']>(
          extension,
          'addExtensions',
          context
        )

        if (addExtensions) {
          return [extension, ...flattenExtensions(addExtensions())]
        }

        return extension
      })
      // `Infinity` will break TypeScript so we set a number that is probably high enough
      .flat(10)
  )
}
