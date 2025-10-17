/**
 * Helper to get extension field with parent traversal
 * 
 * This helper recursively checks the extension's parent chain to find a field value.
 * If the field is a function, it binds the appropriate context.
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { AnyExtension, MaybeThisParameterType, RemoveThis } from '../types/extensions.js'

/**
 * Get a field from an extension, checking parent chain if needed
 * 
 * @param extension - The extension to get the field from
 * @param field - The field name to retrieve
 * @param context - Optional context to bind to function fields
 * @returns The field value, possibly bound to context
 */
export function getExtensionField<T>(
  extension: AnyExtension,
  field: string,
  context?: Omit<MaybeThisParameterType<T>, 'parent'>
): RemoveThis<T> {
  // If field is undefined on this extension, check parent
  if (extension.config[field] === undefined && extension.parent) {
    return getExtensionField(extension.parent, field, context)
  }

  // If field is a function, bind context including parent reference
  if (typeof extension.config[field] === 'function') {
    const boundContext = {
      ...context,
      parent: extension.parent 
        ? getExtensionField(extension.parent, field, context) 
        : null,
    }

    return extension.config[field].bind(boundContext)
  }

  // Return static value
  return extension.config[field]
}
