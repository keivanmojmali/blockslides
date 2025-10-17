/**
 * Check if an object is empty
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

/**
 * Check if an object is empty (no own properties).
 * 
 * @param obj - The object to check
 * @returns True if the object is empty or undefined
 */
export function isEmptyObject(obj?: object): boolean {
  if (!obj) {
    return true
  }
  
  return Object.keys(obj).length === 0 && obj.constructor === Object
}
