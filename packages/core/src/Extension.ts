/**
 * Extension class for AutoArtifacts Slide Editor
 * 
 * Base class for all extensions in the editor. Extensions add functionality
 * like keyboard shortcuts, commands, plugins, and more without being tied
 * to specific nodes or marks.
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { SlideEditor } from './SlideEditor.js'
import { Extendable, type ExtendableConfig, type ExtensionConfig } from './Extendable.js'

// Re-export ExtensionConfig for public API
export type { ExtensionConfig } from './Extendable.js'

/**
 * The Extension class is the base class for all extensions.
 * 
 * Extensions are the most flexible way to add functionality to the editor.
 * They can add commands, keyboard shortcuts, plugins, and more, without
 * being tied to specific nodes or marks in the schema.
 * 
 * @example
 * ```typescript
 * const MyExtension = Extension.create({
 *   name: 'myExtension',
 *   
 *   addOptions() {
 *     return {
 *       enabled: true,
 *     }
 *   },
 *   
 *   addCommands() {
 *     return {
 *       myCommand: () => ({ commands }) => {
 *         // Command implementation
 *         return true
 *       },
 *     }
 *   },
 *   
 *   addKeyboardShortcuts() {
 *     return {
 *       'Mod-k': () => this.editor.commands.myCommand(),
 *     }
 *   },
 * })
 * ```
 * 
 * @see https://tiptap.dev/api/extensions
 */
export class Extension<Options = any, Storage = any> extends Extendable<
  Options,
  Storage,
  ExtensionConfig<Options, Storage>
> {
  /**
   * Extension type identifier
   * Always 'extension' to distinguish from 'mark' and 'node'
   */
  type = 'extension' as const

  /**
   * Create a new Extension instance
   * 
   * @param config - Extension configuration object or a function that returns a configuration object
   * @returns A new Extension instance
   * 
   * @example
   * ```typescript
   * // Simple configuration
   * const MyExt = Extension.create({
   *   name: 'myExtension',
   * })
   * 
   * // Function configuration (for dynamic setup)
   * const MyExt = Extension.create(() => ({
   *   name: 'myExtension',
   *   addOptions() {
   *     return { enabled: true }
   *   },
   * }))
   * ```
   */
  static create<O = any, S = any>(
    config: Partial<ExtensionConfig<O, S>> | (() => Partial<ExtensionConfig<O, S>>) = {},
  ): Extension<O, S> {
    // If the config is a function, execute it to get the configuration object
    const resolvedConfig = typeof config === 'function' ? config() : config
    return new Extension<O, S>(resolvedConfig)
  }

  /**
   * Configure the extension with new options
   * 
   * Returns a new extension instance with the merged options.
   * Does not mutate the original extension.
   * 
   * @param options - Partial options to merge with existing options
   * @returns A new configured Extension instance
   * 
   * @example
   * ```typescript
   * const MyExt = Extension.create({
   *   name: 'myExtension',
   *   addOptions() {
   *     return { enabled: true, count: 0 }
   *   },
   * })
   * 
   * const configured = MyExt.configure({ count: 5 })
   * // configured.options = { enabled: true, count: 5 }
   * ```
   */
  configure(options?: Partial<Options>): Extension<Options, Storage> {
    return super.configure(options) as Extension<Options, Storage>
  }

  /**
   * Extend the extension with additional configuration
   * 
   * Creates a new extension that inherits from this one and adds
   * or overrides configuration. The parent extension remains unchanged.
   * 
   * @param extendedConfig - Configuration to extend with, or a function returning config
   * @returns A new extended Extension instance
   * 
   * @example
   * ```typescript
   * const BaseExt = Extension.create({
   *   name: 'base',
   *   addOptions() {
   *     return { enabled: true }
   *   },
   * })
   * 
   * const ExtendedExt = BaseExt.extend({
   *   name: 'extended',
   *   addOptions() {
   *     return {
   *       ...this.parent?.(),
   *       extraOption: 'value',
   *     }
   *   },
   * })
   * ```
   */
  extend<
    ExtendedOptions = Options,
    ExtendedStorage = Storage,
    ExtendedConfig = ExtensionConfig<ExtendedOptions, ExtendedStorage>,
  >(
    extendedConfig?:
      | (() => Partial<ExtendedConfig>)
      | (Partial<ExtendedConfig> &
          ThisType<{
            name: string
            options: ExtendedOptions
            storage: ExtendedStorage
            editor: SlideEditor
            type: null
          }>),
  ): Extension<ExtendedOptions, ExtendedStorage> {
    // If the extended config is a function, execute it to get the configuration object
    const resolvedConfig = typeof extendedConfig === 'function' ? extendedConfig() : extendedConfig
    return super.extend(resolvedConfig) as Extension<ExtendedOptions, ExtendedStorage>
  }
}
