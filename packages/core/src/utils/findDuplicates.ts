/**
 * Find duplicates in an array
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

/**
 * Find duplicates in an array.
 * 
 * @param items - The array to search for duplicates
 * @returns An array of duplicate items (deduplicated)
 */
export function findDuplicates<T>(items: T[]): T[] {
  const filtered = items.filter((el, index) => items.indexOf(el) !== index)
  return Array.from(new Set(filtered))
}
