/**
 * Mark class for AutoArtifacts Slide Editor
 * 
 * Base class for all mark extensions (text formatting like bold, italic, links, etc).
 * Marks are annotations that can be applied to inline content without changing the document structure.
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { MarkType } from 'prosemirror-model'

import type { SlideEditor } from './SlideEditor.js'
import { Extendable, type MarkConfig } from './Extendable.js'

// Re-export MarkConfig for public API
export type { MarkConfig } from './Extendable.js'

/**
 * The Mark class is used to create custom mark extensions.
 * 
 * Marks are inline annotations like bold, italic, underline, links, etc.
 * Unlike nodes, marks don't affect the document structure - they just decorate text.
 * 
 * @example
 * ```typescript
 * const Bold = Mark.create({
 *   name: 'bold',
 *   
 *   parseHTML() {
 *     return [
 *       { tag: 'strong' },
 *       { tag: 'b' },
 *       { style: 'font-weight', getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
 *     ]
 *   },
 *   
 *   renderHTML({ HTMLAttributes }) {
 *     return ['strong', HTMLAttributes, 0]
 *   },
 *   
 *   addCommands() {
 *     return {
 *       setBold: () => ({ commands }) => commands.setMark(this.name),
 *       toggleBold: () => ({ commands }) => commands.toggleMark(this.name),
 *       unsetBold: () => ({ commands }) => commands.unsetMark(this.name),
 *     }
 *   },
 * })
 * ```
 * 
 * @see https://tiptap.dev/api/marks
 */
export class Mark<Options = any, Storage = any> extends Extendable<Options, Storage, MarkConfig<Options, Storage>> {
  /**
   * Mark type identifier
   * Always 'mark' to distinguish from 'extension' and 'node'
   */
  type = 'mark' as const

  /**
   * Create a new Mark instance
   * 
   * @param config - Mark configuration object or a function that returns a configuration object
   * @returns A new Mark instance
   * 
   * @example
   * ```typescript
   * // Simple configuration
   * const Bold = Mark.create({
   *   name: 'bold',
   *   parseHTML() { return [{ tag: 'strong' }] },
   *   renderHTML() { return ['strong', 0] },
   * })
   * 
   * // Function configuration (for dynamic setup)
   * const Bold = Mark.create(() => ({
   *   name: 'bold',
   *   addOptions() {
   *     return { HTMLAttributes: {} }
   *   },
   * }))
   * ```
   */
  static create<O = any, S = any>(
    config: Partial<MarkConfig<O, S>> | (() => Partial<MarkConfig<O, S>>) = {},
  ): Mark<O, S> {
    // If the config is a function, execute it to get the configuration object
    const resolvedConfig = typeof config === 'function' ? config() : config
    return new Mark<O, S>(resolvedConfig)
  }

  /**
   * Handle exiting from a mark
   * 
   * Allows users to exit from marks when at the end of the mark by adding a space.
   * This is useful for marks that are "sticky" (like links) where you want to
   * continue typing outside the mark.
   * 
   * @param editor - The editor instance
   * @param mark - The mark to exit from
   * @returns True if the exit was handled, false otherwise
   * 
   * @example
   * ```typescript
   * // In a keyboard shortcut handler
   * if (Mark.handleExit({ editor, mark: this })) {
   *   return true // Exit was handled
   * }
   * ```
   */
  static handleExit({ editor, mark }: { editor: SlideEditor; mark: Mark }): boolean {
    // Access editor state and view (these will be available once SlideEditor is updated)
    const state = (editor as any).state
    const view = (editor as any).view
    
    if (!state || !view) {
      return false
    }

    const { tr } = state
    const currentPos = state.selection.$from
    const isAtEnd = currentPos.pos === currentPos.end()

    if (isAtEnd) {
      const currentMarks = currentPos.marks()
      const isInMark = !!currentMarks.find((m: any) => m?.type.name === mark.name)

      if (!isInMark) {
        return false
      }

      const removeMark = currentMarks.find((m: any) => m?.type.name === mark.name)

      if (removeMark) {
        tr.removeStoredMark(removeMark)
      }
      tr.insertText(' ', currentPos.pos)

      view.dispatch(tr)

      return true
    }

    return false
  }

  /**
   * Configure the mark with new options
   * 
   * Returns a new mark instance with the merged options.
   * Does not mutate the original mark.
   * 
   * @param options - Partial options to merge with existing options
   * @returns A new configured Mark instance
   * 
   * @example
   * ```typescript
   * const Bold = Mark.create({
   *   name: 'bold',
   *   addOptions() {
   *     return { HTMLAttributes: { class: 'bold' } }
   *   },
   * })
   * 
   * const configured = Bold.configure({ 
   *   HTMLAttributes: { class: 'font-bold' } 
   * })
   * ```
   */
  configure(options?: Partial<Options>): Mark<Options, Storage> {
    return super.configure(options) as Mark<Options, Storage>
  }

  /**
   * Extend the mark with additional configuration
   * 
   * Creates a new mark that inherits from this one and adds
   * or overrides configuration. The parent mark remains unchanged.
   * 
   * @param extendedConfig - Configuration to extend with, or a function returning config
   * @returns A new extended Mark instance
   * 
   * @example
   * ```typescript
   * const BaseBold = Mark.create({
   *   name: 'bold',
   *   parseHTML() { return [{ tag: 'strong' }] },
   * })
   * 
   * const CustomBold = BaseBold.extend({
   *   addAttributes() {
   *     return {
   *       class: {
   *         default: 'font-bold',
   *         parseHTML: element => element.getAttribute('class'),
   *         renderHTML: attributes => ({ class: attributes.class }),
   *       },
   *     }
   *   },
   * })
   * ```
   */
  extend<
    ExtendedOptions = Options,
    ExtendedStorage = Storage,
    ExtendedConfig = MarkConfig<ExtendedOptions, ExtendedStorage>,
  >(
    extendedConfig?:
      | (() => Partial<ExtendedConfig>)
      | (Partial<ExtendedConfig> &
          ThisType<{
            name: string
            options: ExtendedOptions
            storage: ExtendedStorage
            editor: SlideEditor
            type: MarkType
          }>),
  ): Mark<ExtendedOptions, ExtendedStorage> {
    // If the extended config is a function, execute it to get the configuration object
    const resolvedConfig = typeof extendedConfig === 'function' ? extendedConfig() : extendedConfig
    return super.extend(resolvedConfig) as Mark<ExtendedOptions, ExtendedStorage>
  }
}
