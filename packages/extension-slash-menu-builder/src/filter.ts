import type { SlashMenuItem } from './types.js'

/**
 * Filters menu items based on a search query
 * Searches through label, description, and keywords
 */
export function filterItems(
  items: SlashMenuItem[],
  query: string,
  filterKeys: Array<'label' | 'description' | 'keywords'> = ['label', 'description', 'keywords'],
): SlashMenuItem[] {
  // If no query, return all items
  if (!query || query.trim() === '') {
    return items
  }

  const normalizedQuery = query.toLowerCase().trim()

  // Recursively filter items and their nested items
  return items
    .map(item => {
      // For group items, filter their children
      if (item.group && item.items) {
        const filteredChildren = filterItems(item.items, query, filterKeys)
        // Keep the group if any children match
        if (filteredChildren.length > 0) {
          return { ...item, items: filteredChildren }
        }
        return null
      }

      // Check if this item matches the query
      const matches = filterKeys.some(key => {
        if (key === 'label' && item.label) {
          return item.label.toLowerCase().includes(normalizedQuery)
        }
        if (key === 'description' && item.description) {
          return item.description.toLowerCase().includes(normalizedQuery)
        }
        if (key === 'keywords' && item.keywords) {
          return item.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery))
        }
        return false
      })

      return matches ? item : null
    })
    .filter((item): item is SlashMenuItem => item !== null)
}

/**
 * Flattens nested menu items into a single array (for keyboard navigation)
 * Expands groups but keeps track of hierarchy
 */
export function flattenItems(items: SlashMenuItem[]): SlashMenuItem[] {
  const flattened: SlashMenuItem[] = []

  for (const item of items) {
    flattened.push(item)
    if (item.group && item.items) {
      flattened.push(...flattenItems(item.items))
    }
  }

  return flattened
}

/**
 * Gets all selectable items (non-group items) from the menu
 */
export function getSelectableItems(items: SlashMenuItem[]): SlashMenuItem[] {
  return flattenItems(items).filter(item => !item.group)
}
