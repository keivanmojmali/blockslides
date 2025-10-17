/**
 * mergeDeep.ts for AutoArtifacts Slide Editor
 *
 * Adapted from @tiptap/core
 * Original Copyright (c) 2025, Tiptap GmbH
 * Licensed under MIT License
 * https://github.com/ueberdosis/tiptap
 */

/**
 * Checks if a value is a plain object
 */
function isPlainObject(value: any): value is Record<string, any> {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)

  return prototype === null || prototype === Object.prototype
}

/**
 * Deep merges two objects
 * @param target The target object
 * @param source The source object
 * @returns The merged object
 */
export function mergeDeep(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const output = { ...target }

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach(key => {
      if (isPlainObject(source[key]) && isPlainObject(target[key])) {
        output[key] = mergeDeep(target[key], source[key])
      } else {
        output[key] = source[key]
      }
    })
  }

  return output
}
