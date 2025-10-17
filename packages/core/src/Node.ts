/**
 * Node class for AutoArtifacts Slide Editor
 * 
 * Base class for all node extensions (document structure like paragraphs, headings, slides, etc).
 * Nodes form the document tree structure, unlike marks which just annotate content.
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { NodeType } from 'prosemirror-model'

import type { SlideEditor } from './SlideEditor.js'
import { Extendable, type NodeConfig } from './Extendable.js'

// Re-export NodeConfig for public API
export type { NodeConfig } from './Extendable.js'

/**
 * The Node class is used to create custom node extensions.
 * 
 * Nodes define the document structure (paragraphs, headings, lists, slides, columns, etc).
 * Unlike marks, nodes can contain other nodes and form a tree structure.
 * 
 * @example
 * ```typescript
 * const Paragraph = Node.create({
 *   name: 'paragraph',
 *   
 *   group: 'block',
 *   
 *   content: 'inline*',
 *   
 *   parseHTML() {
 *     return [{ tag: 'p' }]
 *   },
 *   
 *   renderHTML({ HTMLAttributes }) {
 *     return ['p', HTMLAttributes, 0]
 *   },
 *   
 *   addCommands() {
 *     return {
 *       setParagraph: () => ({ commands }) => {
 *         return commands.setNode(this.name)
 *       },
 *     }
 *   },
 * })
 * ```
 * 
 * @see https://tiptap.dev/api/nodes
 */
export class Node<Options = any, Storage = any> extends Extendable<Options, Storage, NodeConfig<Options, Storage>> {
  /**
   * Node type identifier
   * Always 'node' to distinguish from 'extension' and 'mark'
   */
  type = 'node' as const

  /**
   * Create a new Node instance
   * 
   * @param config - Node configuration object or a function that returns a configuration object
   * @returns A new Node instance
   * 
   * @example
   * ```typescript
   * // Simple configuration
   * const Paragraph = Node.create({
   *   name: 'paragraph',
   *   group: 'block',
   *   content: 'inline*',
   * })
   * 
   * // Function configuration (for dynamic setup)
   * const Paragraph = Node.create(() => ({
   *   name: 'paragraph',
   *   addOptions() {
   *     return { HTMLAttributes: {} }
   *   },
   * }))
   * ```
   */
  static create<O = any, S = any>(
    config: Partial<NodeConfig<O, S>> | (() => Partial<NodeConfig<O, S>>) = {},
  ): Node<O, S> {
    // If the config is a function, execute it to get the configuration object
    const resolvedConfig = typeof config === 'function' ? config() : config
    return new Node<O, S>(resolvedConfig)
  }

  /**
   * Configure the node with new options
   * 
   * Returns a new node instance with the merged options.
   * Does not mutate the original node.
   * 
   * @param options - Partial options to merge with existing options
   * @returns A new configured Node instance
   * 
   * @example
   * ```typescript
   * const Heading = Node.create({
   *   name: 'heading',
   *   addOptions() {
   *     return { 
   *       levels: [1, 2, 3, 4, 5, 6],
   *       HTMLAttributes: {},
   *     }
   *   },
   * })
   * 
   * const configured = Heading.configure({ 
   *   levels: [1, 2, 3] // Only allow h1, h2, h3
   * })
   * ```
   */
  configure(options?: Partial<Options>): Node<Options, Storage> {
    return super.configure(options) as Node<Options, Storage>
  }

  /**
   * Extend the node with additional configuration
   * 
   * Creates a new node that inherits from this one and adds
   * or overrides configuration. The parent node remains unchanged.
   * 
   * @param extendedConfig - Configuration to extend with, or a function returning config
   * @returns A new extended Node instance
   * 
   * @example
   * ```typescript
   * const BaseParagraph = Node.create({
   *   name: 'paragraph',
   *   group: 'block',
   *   content: 'inline*',
   * })
   * 
   * const CustomParagraph = BaseParagraph.extend({
   *   addAttributes() {
   *     return {
   *       textAlign: {
   *         default: 'left',
   *         parseHTML: element => element.style.textAlign || 'left',
   *         renderHTML: attributes => ({
   *           style: `text-align: ${attributes.textAlign}`,
   *         }),
   *       },
   *     }
   *   },
   * })
   * ```
   */
  extend<
    ExtendedOptions = Options,
    ExtendedStorage = Storage,
    ExtendedConfig = NodeConfig<ExtendedOptions, ExtendedStorage>,
  >(
    extendedConfig?:
      | (() => Partial<ExtendedConfig>)
      | (Partial<ExtendedConfig> &
          ThisType<{
            name: string
            options: ExtendedOptions
            storage: ExtendedStorage
            editor: SlideEditor
            type: NodeType
          }>),
  ): Node<ExtendedOptions, ExtendedStorage> {
    // If the extended config is a function, execute it to get the configuration object
    const resolvedConfig = typeof extendedConfig === 'function' ? extendedConfig() : extendedConfig
    return super.extend(resolvedConfig) as Node<ExtendedOptions, ExtendedStorage>
  }
}
