import { Extension } from '@blockslides/core'
import type { Editor } from '@blockslides/core'
import Suggestion, { exitSuggestion } from '@blockslides/extension-suggestion'
import type { SuggestionProps } from '@blockslides/extension-suggestion'
import { PluginKey } from '@blockslides/pm/state'

import { filterItems } from './filter.js'
import { SlashMenuRenderer } from './menu-renderer.js'
import type { SlashMenuBuilderOptions, SlashMenuItem, SlashCommandContext } from './types.js'

export interface SlashMenuBuilderStorage {
  renderer: SlashMenuRenderer | null
}

/**
 * SlashMenuBuilder Extension
 * 
 * A framework for building custom slash command menus.
 * Built on top of the Suggestion utility.
 * 
 * @example
 * ```ts
 * SlashMenuBuilder({
 *   items: [
 *     {
 *       key: 'heading1',
 *       label: 'Heading 1',
 *       description: 'Used for a top-level heading',
 *       icon: 'H1',
 *       command: ({ commands }) => commands.replaceWithHeading(1)
 *     }
 *   ]
 * })
 * ```
 */
export const SlashMenuBuilder = Extension.create<SlashMenuBuilderOptions, SlashMenuBuilderStorage>({
  name: 'slashMenuBuilder',

  addOptions() {
    return {
      items: [],
      maxHeight: 400,
      filterKeys: ['label', 'description', 'keywords'],
      placeholder: 'No commands found',
      className: '',
    }
  },

  addStorage() {
    return {
      renderer: null,
    }
  },

  addProseMirrorPlugins() {
    const editor = this.editor as Editor
    const pluginKey = new PluginKey('slashMenuBuilder')

    // Helper function to update popup position
    const updatePopupPosition = (props: SuggestionProps<SlashMenuItem>, popup: HTMLElement) => {
      if (!props.clientRect) return

      const rect = props.clientRect()
      if (!rect) return

      const menuHeight = popup.offsetHeight
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top

      // Position below if there's space, otherwise above
      if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
        popup.style.top = `${rect.bottom + window.scrollY + 8}px`
        popup.style.bottom = 'auto'
      } else {
        popup.style.bottom = `${window.innerHeight - rect.top - window.scrollY + 8}px`
        popup.style.top = 'auto'
      }

      popup.style.left = `${rect.left + window.scrollX}px`
    }

    return [
      Suggestion<SlashMenuItem>({
        editor,
        char: '/',
        pluginKey,

        // Allow suggestions to show (let Suggestion handle the defaults)
        // Don't filter by uiEvent since it's not reliably set

        items: ({ query }) => {
          // Filter items based on the query
          const filtered = filterItems(this.options.items, query, this.options.filterKeys)
          return filtered
        },

        render: () => {
          let renderer: SlashMenuRenderer | null = null
          let popup: HTMLElement | null = null

          return {
            onStart: (props: SuggestionProps<SlashMenuItem>) => {
              console.log('✅ Slash menu started!', { query: props.query })

              // Create the command handler
              const handleSelect = (item: SlashMenuItem) => {
                console.log('📌 Item selected:', item.key)

                // Execute the command if provided
                if (item.command) {
                  try {
                    const context: SlashCommandContext = {
                      editor: props.editor,
                      range: props.range,
                      query: props.query,
                    }

                    item.command(context)
                  } catch (error) {
                    console.error('❌ Slash command failed:', item.key, error)
                  }
                }

                // Always close the menu, even if command failed
                exitSuggestion(props.editor.view, pluginKey)
              }

              // Create renderer
              renderer = new SlashMenuRenderer(props.items, handleSelect, {
                maxHeight: this.options.maxHeight,
                className: this.options.className,
                placeholder: this.options.placeholder,
              })

              renderer.render()

              // Store in extension storage
              this.storage.renderer = renderer

              // Create popup container
              popup = document.createElement('div')
              popup.style.position = 'absolute'
              popup.style.zIndex = '1000'
              popup.appendChild(renderer.getElement())
              document.body.appendChild(popup)

              // Position the menu
              updatePopupPosition(props, popup)
            },

            onUpdate: (props: SuggestionProps<SlashMenuItem>) => {
              console.log('🔄 Slash menu updated!', { query: props.query, items: props.items.length })

              if (renderer) {
                renderer.updateItems(props.items)
              }

              // Update position
              if (popup) {
                updatePopupPosition(props, popup)
              }
            },

            onKeyDown: ({ event }) => {
              if (!renderer) return false

              // Arrow Up
              if (event.key === 'ArrowUp') {
                renderer.selectPrevious()
                return true
              }

              // Arrow Down
              if (event.key === 'ArrowDown') {
                renderer.selectNext()
                return true
              }

              // Enter
              if (event.key === 'Enter') {
                renderer.selectCurrent()
                return true
              }

              // Tab (same as Enter)
              if (event.key === 'Tab') {
                event.preventDefault()
                renderer.selectCurrent()
                return true
              }

              return false
            },

            onExit: () => {
              console.log('❌ Slash menu exited!')

              if (renderer) {
                renderer.destroy()
                renderer = null
              }

              if (popup) {
                popup.remove()
                popup = null
              }

              this.storage.renderer = null
            },
          }
        },
      }),
    ]
  },
})
