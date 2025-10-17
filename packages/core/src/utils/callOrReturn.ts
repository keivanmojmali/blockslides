/**
 * Call or return utility
 * 
 * Checks if a value is a function and calls it with context, or returns the value directly.
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { MaybeReturnType } from '../types/extensions.js'

/**
 * Check if value is a function
 */
function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

/**
 * Call a function with context or return a static value
 * 
 * @param value - The value to call or return
 * @param context - Optional context to bind to function
 * @param props - Additional arguments to pass to function
 * @returns The result of calling the function or the value itself
 */
export function callOrReturn<T>(
  value: T, 
  context: any = undefined, 
  ...props: any[]
): MaybeReturnType<T> {
  if (isFunction(value)) {
    if (context) {
      return value.bind(context)(...props)
    }

    return value(...props)
  }

  return value as MaybeReturnType<T>
}
