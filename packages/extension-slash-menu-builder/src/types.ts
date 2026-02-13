import type { Editor, Range } from '@blockslides/core'

/**
 * Helper commands that make it easy to insert/replace content
 * Phase 1: These will console.log
 * Phase 2: These will actually execute the commands
 */
export interface SlashCommands {
  replaceWithHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void
  replaceWithBulletList: () => void
  replaceWithNumberedList: () => void
  replaceWithParagraph: () => void
  replaceWithImage: (src?: string) => void
  replaceWithTable: (rows?: number, cols?: number) => void
  insertBlock: (type: string, attrs?: Record<string, any>) => void
  deleteSlashRange: () => void
}

/**
 * Context provided to command functions when an item is selected
 */
export interface SlashCommandContext {
  /** The editor instance */
  editor: Editor
  /** The range of the slash trigger (from "/" to current position) */
  range: Range
  /** Helper commands for common operations */
  commands: SlashCommands
  /** The query string (text after the "/") */
  query: string
}

/**
 * A single menu item configuration
 */
export interface SlashMenuItem {
  /** Unique identifier for this item */
  key: string
  /** Display label shown in the menu */
  label: string
  /** Optional description shown below the label */
  description?: string
  /** Icon - can be a string (like "H1") or an icon component */
  icon?: string | any
  /** Additional keywords for search filtering */
  keywords?: string[]
  /** Function to execute when this item is selected */
  command?: (context: SlashCommandContext) => void
  /** If true, this item is a group/category containing nested items */
  group?: boolean
  /** Nested menu items (only used if group=true) */
  items?: SlashMenuItem[]
}

/**
 * Configuration for the SlashMenuBuilder extension
 */
export interface SlashMenuBuilderOptions {
  /** Array of menu items to display */
  items: SlashMenuItem[]
  /** Maximum height of the menu in pixels */
  maxHeight?: number
  /** Keys to search through when filtering (defaults to ['label', 'description', 'keywords']) */
  filterKeys?: Array<'label' | 'description' | 'keywords'>
  /** Placeholder text for empty state */
  placeholder?: string
  /** Custom CSS class for the menu container */
  className?: string
}

/**
 * Internal state for tracking menu navigation and rendering
 */
export interface MenuState {
  /** Currently filtered/visible items */
  filteredItems: SlashMenuItem[]
  /** Index of the currently selected item */
  selectedIndex: number
  /** Whether the menu is currently open */
  isOpen: boolean
  /** The current search query */
  query: string
  /** Current expanded groups (for nested menus) */
  expandedGroups: Set<string>
}
