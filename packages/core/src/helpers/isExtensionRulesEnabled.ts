/**
 * Check if extension rules are enabled
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { AnyExtension, EnableRules } from '../types/extensions.js'

/**
 * Check if an extension's rules are enabled based on the editor configuration.
 * 
 * @param extension - The extension to check
 * @param enabled - The enable rules configuration (boolean or array of extension names)
 * @returns True if the extension's rules are enabled
 */
export function isExtensionRulesEnabled(
  extension: AnyExtension,
  enabled: EnableRules
): boolean {
  if (Array.isArray(enabled)) {
    return enabled.some(enabledExtension => {
      const name = typeof enabledExtension === 'string' 
        ? enabledExtension 
        : enabledExtension.name

      return name === extension.name
    })
  }

  return enabled
}
