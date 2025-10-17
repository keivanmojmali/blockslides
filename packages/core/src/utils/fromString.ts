/**
 * Parse attribute value from string
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

/**
 * Parse a string attribute value into the appropriate type.
 * Tries to parse JSON, falls back to the original string.
 * 
 * @param value - The string value to parse
 * @returns The parsed value (object, array, boolean, number, or string)
 */
export function fromString(value: string | null | undefined): any {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value !== 'string') {
    return value
  }

  // Try to parse as JSON
  try {
    return JSON.parse(value)
  } catch (err) {
    // If parsing fails, return the original string
    return value
  }
}
