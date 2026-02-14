import type { SlashMenuItem } from './types.js'

/**
 * Renders the slash menu UI
 * Creates a Notion-style command menu with keyboard navigation
 */
export class SlashMenuRenderer {
  private element: HTMLElement
  private selectedIndex: number = 0
  private selectableItems: SlashMenuItem[] = []
  private searchValue: string = ''
  private searchInput: HTMLInputElement | null = null

  constructor(
    private items: SlashMenuItem[],
    private onSelect: (item: SlashMenuItem) => void,
    private options: {
      maxHeight?: number
      className?: string
      placeholder?: string
      searchPlaceholder?: string
    } = {},
  ) {
    this.element = this.createElement()
    this.selectableItems = this.getSelectableItems(items)
  }

  private createElement(): HTMLElement {
    const menu = document.createElement('div')
    menu.className = `slash-menu ${this.options.className || ''}`.trim()
    
    if (this.options.maxHeight) {
      menu.style.maxHeight = `${this.options.maxHeight}px`
    }

    return menu
  }

  private getSelectableItems(items: SlashMenuItem[]): SlashMenuItem[] {
    const selectable: SlashMenuItem[] = []
    
    for (const item of items) {
      if (!item.group) {
        selectable.push(item)
      }
      if (item.group && item.items) {
        selectable.push(...this.getSelectableItems(item.items))
      }
    }
    
    return selectable
  }

  /**
   * Renders the search bar
   */
  private renderSearchBar(): HTMLElement {
    const searchContainer = document.createElement('div')
    searchContainer.className = 'slash-menu-search'

    this.searchInput = document.createElement('input')
    this.searchInput.type = 'text'
    this.searchInput.className = 'slash-menu-search-input'
    this.searchInput.placeholder = this.options.searchPlaceholder || 'Search commands...'
    this.searchInput.value = this.searchValue

    this.searchInput.addEventListener('input', (e) => {
      this.searchValue = (e.target as HTMLInputElement).value.toLowerCase()
      this.filterAndRenderItems()
    })

    // Prevent the input from closing the menu or interfering with editor
    this.searchInput.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })

    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        this.selectNext()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        this.selectPrevious()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        this.selectCurrent()
      }
    })

    searchContainer.appendChild(this.searchInput)
    return searchContainer
  }

  /**
   * Filters items based on search value
   */
  private getFilteredItems(): SlashMenuItem[] {
    if (!this.searchValue) {
      return this.items
    }

    const filterRecursive = (items: SlashMenuItem[]): SlashMenuItem[] => {
      return items.filter(item => {
        if (item.group && item.items) {
          const filteredChildren = filterRecursive(item.items)
          return filteredChildren.length > 0
        }
        
        const searchLower = this.searchValue.toLowerCase()
        return (
          item.label.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.keywords?.some(k => k.toLowerCase().includes(searchLower))
        )
      }).map(item => {
        if (item.group && item.items) {
          return { ...item, items: filterRecursive(item.items) }
        }
        return item
      })
    }

    return filterRecursive(this.items)
  }

  /**
   * Filters and re-renders items based on search
   */
  private filterAndRenderItems() {
    const filteredItems = this.getFilteredItems()
    this.selectableItems = this.getSelectableItems(filteredItems)
    this.selectedIndex = 0

    // Clear and re-render items container
    const itemsContainer = this.element.querySelector('.slash-menu-items')
    if (itemsContainer) {
      itemsContainer.innerHTML = ''
      
      if (this.selectableItems.length === 0) {
        const empty = document.createElement('div')
        empty.className = 'slash-menu-empty'
        empty.textContent = this.options.placeholder || 'No commands found'
        itemsContainer.appendChild(empty)
      } else {
        this.renderItems(filteredItems, itemsContainer as HTMLElement)
      }
    }
  }

  /**
   * Renders the menu items into the DOM
   */
  render() {
    this.element.innerHTML = ''

    // Add search bar
    const searchBar = this.renderSearchBar()
    this.element.appendChild(searchBar)

    // Add items container
    const listContainer = document.createElement('div')
    listContainer.className = 'slash-menu-items'

    if (this.selectableItems.length === 0) {
      const empty = document.createElement('div')
      empty.className = 'slash-menu-empty'
      empty.textContent = this.options.placeholder || 'No commands found'
      listContainer.appendChild(empty)
    } else {
      this.renderItems(this.items, listContainer)
    }

    this.element.appendChild(listContainer)

    // Focus search input after render
    setTimeout(() => {
      this.searchInput?.focus()
    }, 0)
  }

  private renderItems(items: SlashMenuItem[], container: HTMLElement, isNested = false) {
    for (const item of items) {
      if (item.group && item.items) {
        this.renderGroup(item, container)
      } else {
        this.renderItem(item, container, isNested)
      }
    }
  }

  private renderGroup(group: SlashMenuItem, container: HTMLElement) {
    const groupElement = document.createElement('div')
    groupElement.className = 'slash-menu-group'

    // Group header
    const header = document.createElement('div')
    header.className = 'slash-menu-group-header'
    header.textContent = group.label
    groupElement.appendChild(header)

    // Group items
    const itemsContainer = document.createElement('div')
    itemsContainer.className = 'slash-menu-group-items'
    if (group.items) {
      this.renderItems(group.items, itemsContainer, true)
    }
    groupElement.appendChild(itemsContainer)

    container.appendChild(groupElement)
  }

  private renderItem(item: SlashMenuItem, container: HTMLElement, isNested: boolean) {
    const itemElement = document.createElement('div')
    const globalIndex = this.selectableItems.indexOf(item)
    const isSelected = globalIndex === this.selectedIndex

    itemElement.className = `slash-menu-item ${isSelected ? 'selected' : ''} ${isNested ? 'nested' : ''}`.trim()
    itemElement.dataset.key = item.key

    // Icon
    if (item.icon) {
      const icon = document.createElement('div')
      icon.className = 'slash-menu-item-icon'
      
      // If icon is a string, treat it as text
      if (typeof item.icon === 'string') {
        icon.textContent = item.icon
      }
      
      itemElement.appendChild(icon)
    }

    // Content (label + description)
    const content = document.createElement('div')
    content.className = 'slash-menu-item-content'

    const label = document.createElement('div')
    label.className = 'slash-menu-item-label'
    label.textContent = item.label
    content.appendChild(label)

    if (item.description) {
      const description = document.createElement('div')
      description.className = 'slash-menu-item-description'
      description.textContent = item.description
      content.appendChild(description)
    }

    itemElement.appendChild(content)

    // Use mousedown instead of click for immediate feedback and to prevent
    // the editor from handling the event (moving cursor, selecting text, etc.)
    itemElement.addEventListener('mousedown', (e) => {
      e.preventDefault() // Prevent default mousedown behavior (text selection, cursor movement)
      e.stopPropagation() // Stop event from bubbling to ProseMirror
      this.onSelect(item)
    })

    // Hover handler - update selection without re-rendering
    itemElement.addEventListener('mouseenter', () => {
      this.selectedIndex = globalIndex
      this.updateSelection()
    })

    container.appendChild(itemElement)
  }

  /**
   * Updates the menu with new filtered items
   */
  updateItems(items: SlashMenuItem[]) {
    this.items = items
    this.selectableItems = this.getSelectableItems(items)
    this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, this.selectableItems.length - 1))
    this.render()
  }

  /**
   * Updates the selected class on items without re-rendering
   */
  private updateSelection() {
    const allItems = this.element.querySelectorAll('.slash-menu-item')
    allItems.forEach((el) => {
      const itemKey = (el as HTMLElement).dataset.key
      const itemIndex = this.selectableItems.findIndex(item => item.key === itemKey)
      if (itemIndex === this.selectedIndex) {
        el.classList.add('selected')
      } else {
        el.classList.remove('selected')
      }
    })
  }

  /**
   * Moves selection up
   */
  selectPrevious() {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1)
    this.updateSelection()
    this.scrollToSelected()
  }

  /**
   * Moves selection down
   */
  selectNext() {
    this.selectedIndex = Math.min(this.selectableItems.length - 1, this.selectedIndex + 1)
    this.updateSelection()
    this.scrollToSelected()
  }

  /**
   * Executes the currently selected item
   */
  selectCurrent() {
    const selectedItem = this.selectableItems[this.selectedIndex]
    if (selectedItem) {
      this.onSelect(selectedItem)
    }
  }

  /**
   * Scrolls the selected item into view
   */
  private scrollToSelected() {
    const selectedElement = this.element.querySelector('.slash-menu-item.selected')
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }

  /**
   * Gets the DOM element
   */
  getElement(): HTMLElement {
    return this.element
  }

  /**
   * Cleans up the renderer
   */
  destroy() {
    this.element.remove()
  }
}
