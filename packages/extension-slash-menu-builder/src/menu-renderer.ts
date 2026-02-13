import type { SlashMenuItem } from './types.js'

/**
 * Renders the slash menu UI
 * Creates a Notion-style command menu with keyboard navigation
 */
export class SlashMenuRenderer {
  private element: HTMLElement
  private selectedIndex: number = 0
  private selectableItems: SlashMenuItem[] = []

  constructor(
    private items: SlashMenuItem[],
    private onSelect: (item: SlashMenuItem) => void,
    private options: {
      maxHeight?: number
      className?: string
      placeholder?: string
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
   * Renders the menu items into the DOM
   */
  render() {
    this.element.innerHTML = ''

    if (this.selectableItems.length === 0) {
      this.renderEmptyState()
      return
    }

    const listContainer = document.createElement('div')
    listContainer.className = 'slash-menu-items'

    this.renderItems(this.items, listContainer)
    this.element.appendChild(listContainer)
  }

  private renderEmptyState() {
    const empty = document.createElement('div')
    empty.className = 'slash-menu-empty'
    empty.textContent = this.options.placeholder || 'No commands found'
    this.element.appendChild(empty)
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

    // Click handler
    itemElement.addEventListener('click', () => {
      this.onSelect(item)
    })

    // Hover handler
    itemElement.addEventListener('mouseenter', () => {
      this.selectedIndex = globalIndex
      this.render()
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
   * Moves selection up
   */
  selectPrevious() {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1)
    this.render()
    this.scrollToSelected()
  }

  /**
   * Moves selection down
   */
  selectNext() {
    this.selectedIndex = Math.min(this.selectableItems.length - 1, this.selectedIndex + 1)
    this.render()
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
