/**
 * Merge HTML attributes
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

/**
 * Merge multiple HTML attribute objects.
 * Special handling for 'class' and 'style' attributes.
 * 
 * @param args - Any number of attribute objects to merge
 * @returns A merged attribute object
 */
export function mergeAttributes(
  ...args: Array<Record<string, any> | undefined>
): Record<string, any> {
  const result: Record<string, any> = {}

  args.forEach(attributes => {
    if (!attributes) {
      return
    }

    Object.entries(attributes).forEach(([key, value]) => {
      // Merge class names
      if (key === 'class') {
        const existingClasses = result.class ? String(result.class).split(' ') : []
        const newClasses = value ? String(value).split(' ') : []
        result.class = [...existingClasses, ...newClasses]
          .filter((cls, index, arr) => cls && arr.indexOf(cls) === index)
          .join(' ')
        return
      }

      // Merge styles
      if (key === 'style') {
        result.style = [result.style, value].filter(Boolean).join('; ')
        return
      }

      // For other attributes, later values override
      result[key] = value
    })
  })

  return result
}
