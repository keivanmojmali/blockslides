/**
 * Extendable.ts for AutoArtifacts Slide Editor
 *
 * Adapted from @tiptap/core
 * Original Copyright (c) 2025, Tiptap GmbH
 * Licensed under MIT License
 * https://github.com/ueberdosis/tiptap
 *
 * Modifications for slide editor use case:
 * - Changed Editor → SlideEditor throughout
 * - Adapted for slide-specific extension architecture
 */

import type { Plugin } from 'prosemirror-state'

import type { SlideEditor } from './SlideEditor.js'
import { getExtensionField } from './helpers/index.js'
import type {
  AnyConfig,
  EditorEvents,
  Extensions,
  GlobalAttributes,
  JSONContent,
  KeyboardShortcutCommand,
  MarkdownParseHelpers,
  MarkdownParseResult,
  MarkdownRendererHelpers,
  MarkdownToken,
  MarkdownTokenizer,
  ParentConfig,
  RawCommands,
  RenderContext,
} from './types/index.js'
import { callOrReturn } from './utils/callOrReturn.js'
import { mergeDeep } from './utils/mergeDeep.js'

// Import ProseMirror types for mark and node configs
import type { DOMOutputSpec, Mark as ProseMirrorMark, MarkSpec, MarkType, NodeSpec, NodeType } from 'prosemirror-model'

// Extension configuration types
// These are defined here to avoid circular dependencies
// ExtensionConfig is re-exported from Extension.ts for public API
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ExtensionConfig<Options = any, Storage = any> 
  extends ExtendableConfig<Options, Storage, ExtensionConfig<Options, Storage>, null> {}

// Mark configuration type
// MarkConfig is re-exported from Mark.ts for public API
export interface MarkConfig<Options = any, Storage = any>
  extends ExtendableConfig<Options, Storage, MarkConfig<Options, Storage>, MarkType> {
  /**
   * Custom mark view renderer
   */
  addMarkView?:
    | ((this: {
        name: string
        options: Options
        storage: Storage
        editor: any // SlideEditor
        type: MarkType
        parent: ParentConfig<MarkConfig<Options, Storage>>['addMarkView']
      }) => any)
    | null

  /**
   * Keep mark after split node
   */
  keepOnSplit?: boolean | (() => boolean)

  /**
   * Inclusive
   */
  inclusive?:
    | MarkSpec['inclusive']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<MarkConfig<Options, Storage>>['inclusive']
        editor?: any
      }) => MarkSpec['inclusive'])

  /**
   * Excludes
   */
  excludes?:
    | MarkSpec['excludes']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<MarkConfig<Options, Storage>>['excludes']
        editor?: any
      }) => MarkSpec['excludes'])

  /**
   * Exitable
   */
  exitable?: boolean | (() => boolean)

  /**
   * Group
   */
  group?:
    | MarkSpec['group']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<MarkConfig<Options, Storage>>['group']
        editor?: any
      }) => MarkSpec['group'])

  /**
   * Spanning
   */
  spanning?:
    | MarkSpec['spanning']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<MarkConfig<Options, Storage>>['spanning']
        editor?: any
      }) => MarkSpec['spanning'])

  /**
   * Code
   */
  code?:
    | boolean
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<MarkConfig<Options, Storage>>['code']
        editor?: any
      }) => boolean)

  /**
   * Parse HTML
   */
  parseHTML?: (this: {
    name: string
    options: Options
    storage: Storage
    parent: ParentConfig<MarkConfig<Options, Storage>>['parseHTML']
    editor?: any
  }) => MarkSpec['parseDOM']

  /**
   * Render HTML
   */
  renderHTML?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          parent: ParentConfig<MarkConfig<Options, Storage>>['renderHTML']
          editor?: any
        },
        props: {
          mark: ProseMirrorMark
          HTMLAttributes: Record<string, any>
        },
      ) => DOMOutputSpec)
    | null

  /**
   * Add attributes
   */
  addAttributes?: (this: {
    name: string
    options: Options
    storage: Storage
    parent: ParentConfig<MarkConfig<Options, Storage>>['addAttributes']
    editor?: any
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  }) => Record<string, any> | {}
}

// Node configuration type
// NodeConfig is re-exported from Node.ts for public API
export interface NodeConfig<Options = any, Storage = any>
  extends ExtendableConfig<Options, Storage, NodeConfig<Options, Storage>, NodeType> {
  /**
   * Custom node view renderer
   */
  addNodeView?:
    | ((this: {
        name: string
        options: Options
        storage: Storage
        editor: any // SlideEditor
        type: NodeType
        parent: ParentConfig<NodeConfig<Options, Storage>>['addNodeView']
      }) => any)
    | null

  /**
   * Top level node (doc)
   */
  topNode?: boolean

  /**
   * Content expression
   */
  content?:
    | NodeSpec['content']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['content']
        editor?: any
      }) => NodeSpec['content'])

  /**
   * Marks allowed in this node
   */
  marks?:
    | NodeSpec['marks']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['marks']
        editor?: any
      }) => NodeSpec['marks'])

  /**
   * Node group
   */
  group?:
    | NodeSpec['group']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['group']
        editor?: any
      }) => NodeSpec['group'])

  /**
   * Inline node
   */
  inline?:
    | NodeSpec['inline']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['inline']
        editor?: any
      }) => NodeSpec['inline'])

  /**
   * Atom node
   */
  atom?:
    | NodeSpec['atom']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['atom']
        editor?: any
      }) => NodeSpec['atom'])

  /**
   * Selectable
   */
  selectable?:
    | NodeSpec['selectable']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['selectable']
        editor?: any
      }) => NodeSpec['selectable'])

  /**
   * Draggable
   */
  draggable?:
    | NodeSpec['draggable']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['draggable']
        editor?: any
      }) => NodeSpec['draggable'])

  /**
   * Code node
   */
  code?:
    | NodeSpec['code']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['code']
        editor?: any
      }) => NodeSpec['code'])

  /**
   * Whitespace handling
   */
  whitespace?:
    | NodeSpec['whitespace']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['whitespace']
        editor?: any
      }) => NodeSpec['whitespace'])

  /**
   * Linebreak replacement
   */
  linebreakReplacement?:
    | NodeSpec['linebreakReplacement']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['linebreakReplacement']
        editor?: any
      }) => NodeSpec['linebreakReplacement'])

  /**
   * Defining
   */
  defining?:
    | NodeSpec['defining']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['defining']
        editor?: any
      }) => NodeSpec['defining'])

  /**
   * Isolating
   */
  isolating?:
    | NodeSpec['isolating']
    | ((this: {
        name: string
        options: Options
        storage: Storage
        parent: ParentConfig<NodeConfig<Options, Storage>>['isolating']
        editor?: any
      }) => NodeSpec['isolating'])

  /**
   * Parse HTML
   */
  parseHTML?: (this: {
    name: string
    options: Options
    storage: Storage
    parent: ParentConfig<NodeConfig<Options, Storage>>['parseHTML']
    editor?: any
  }) => NodeSpec['parseDOM']

  /**
   * Render HTML
   */
  renderHTML?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          parent: ParentConfig<NodeConfig<Options, Storage>>['renderHTML']
          editor?: any
        },
        props: {
          node: any // ProseMirrorNode
          HTMLAttributes: Record<string, any>
        },
      ) => DOMOutputSpec)
    | null

  /**
   * Render text
   */
  renderText?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          parent: ParentConfig<NodeConfig<Options, Storage>>['renderText']
          editor?: any
        },
        props: {
          node: any // ProseMirrorNode
          pos: number
          parent: any // ProseMirrorNode
          index: number
        },
      ) => string)
    | null

  /**
   * Add attributes
   */
  addAttributes?: (this: {
    name: string
    options: Options
    storage: Storage
    parent: ParentConfig<NodeConfig<Options, Storage>>['addAttributes']
    editor?: any
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  }) => Record<string, any> | {}
}

// Placeholder types for rules
export interface InputRule {}
export interface PasteRule {}
export interface Mark {}
export interface Node {}




export interface ExtendableConfig<
  Options = any,
  Storage = any,
  Config extends
    | ExtensionConfig<Options, Storage>
    | NodeConfig<Options, Storage>
    | MarkConfig<Options, Storage>
    | ExtendableConfig<Options, Storage> = ExtendableConfig<Options, Storage, any, any>,
  PMType = any,
> {
  /**
   * The extension name - this must be unique.
   * It will be used to identify the extension.
   *
   * @example 'myExtension'
   */
  name: string

  /**
   * The priority of your extension. The higher, the earlier it will be called
   * and will take precedence over other extensions with a lower priority.
   * @default 100
   * @example 101
   */
  priority?: number

  /**
   * This method will add options to this extension
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#settings
   * @example
   * addOptions() {
   *  return {
   *    myOption: 'foo',
   *    myOtherOption: 10,
   * }
   */
  addOptions?: (this: { name: string; parent: ParentConfig<Config>['addOptions'] }) => Options

  /**
   * The default storage this extension can save data to.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#storage
   * @example
   * defaultStorage: {
   *   prefetchedUsers: [],
   *   loading: false,
   * }
   */
  addStorage?: (this: { name: string; options: Options; parent: ParentConfig<Config>['addStorage'] }) => Storage

  /**
   * This function adds globalAttributes to specific nodes.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#global-attributes
   * @example
   * addGlobalAttributes() {
   *   return [
   *     {
           // Extend the following extensions
   *       types: [
   *         'heading',
   *         'paragraph',
   *       ],
   *       // … with those attributes
   *       attributes: {
   *         textAlign: {
   *           default: 'left',
   *           renderHTML: attributes => ({
   *             style: `text-align: ${attributes.textAlign}`,
   *           }),
   *           parseHTML: element => element.style.textAlign || 'left',
   *         },
   *       },
   *     },
   *   ]
   * }
   */
  addGlobalAttributes?: (this: {
    name: string
    options: Options
    storage: Storage
    extensions: (Node | Mark)[]
    parent: ParentConfig<Config>['addGlobalAttributes']
  }) => GlobalAttributes

  /**
   * This function adds commands to the editor
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#commands
   * @example
   * addCommands() {
   *   return {
   *     myCommand: () => ({ chain }) => chain().setMark('type', 'foo').run(),
   *   }
   * }
   */
  addCommands?: (this: {
    name: string
    options: Options
    storage: Storage
    editor: SlideEditor
    type: PMType
    parent: ParentConfig<Config>['addCommands']
  }) => Partial<RawCommands>

  /**
   * This function registers keyboard shortcuts.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#keyboard-shortcuts
   * @example
   * addKeyboardShortcuts() {
   *   return {
   *     'Mod-l': () => this.editor.commands.toggleBulletList(),
   *   }
   * },
   */
  addKeyboardShortcuts?: (this: {
    name: string
    options: Options
    storage: Storage
    editor: SlideEditor
    type: PMType
    parent: ParentConfig<Config>['addKeyboardShortcuts']
  }) => {
    [key: string]: KeyboardShortcutCommand
  }

  /**
   * This function adds input rules to the editor.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#input-rules
   * @example
   * addInputRules() {
   *   return [
   *     markInputRule({
   *       find: inputRegex,
   *       type: this.type,
   *     }),
   *   ]
   * },
   */
  addInputRules?: (this: {
    name: string
    options: Options
    storage: Storage
    editor: SlideEditor
    type: PMType
    parent: ParentConfig<Config>['addInputRules']
  }) => InputRule[]

  /**
   * This function adds paste rules to the editor.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#paste-rules
   * @example
   * addPasteRules() {
   *   return [
   *     markPasteRule({
   *       find: pasteRegex,
   *       type: this.type,
   *     }),
   *   ]
   * },
   */
  addPasteRules?: (this: {
    name: string
    options: Options
    storage: Storage
    editor: SlideEditor
    type: PMType
    parent: ParentConfig<Config>['addPasteRules']
  }) => PasteRule[]

  /**
   * This function adds Prosemirror plugins to the editor
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#prosemirror-plugins
   * @example
   * addProseMirrorPlugins() {
   *   return [
   *     customPlugin(),
   *   ]
   * }
   */
  addProseMirrorPlugins?: (this: {
    name: string
    options: Options
    storage: Storage
    editor: SlideEditor
    type: PMType
    parent: ParentConfig<Config>['addProseMirrorPlugins']
  }) => Plugin[]

  /**
   * This function adds additional extensions to the editor. This is useful for
   * building extension kits.
   * @example
   * addExtensions() {
   *   return [
   *     BulletList,
   *     OrderedList,
   *     ListItem
   *   ]
   * }
   */
  addExtensions?: (this: {
    name: string
    options: Options
    storage: Storage
    parent: ParentConfig<Config>['addExtensions']
  }) => Extensions

  /**
   * The markdown token name
   *
   * This is the name of the token that this extension uses to parse and render markdown and comes from the Marked Lexer.
   *
   * @see https://github.com/markedjs/marked/blob/master/src/Tokens.ts
   *
   */
  markdownTokenName?: string

  /**
   * The parse function used by the markdown parser to convert markdown tokens to ProseMirror nodes.
   */
  parseMarkdown?: (token: MarkdownToken, helpers: MarkdownParseHelpers) => MarkdownParseResult

  /**
   * The serializer function used by the markdown serializer to convert ProseMirror nodes to markdown tokens.
   */
  renderMarkdown?: (node: JSONContent, helpers: MarkdownRendererHelpers, ctx: RenderContext) => string

  /**
   * The markdown tokenizer responsible for turning a markdown string into tokens
   *
   * Custom tokenizers are only needed when you want to parse non-standard markdown token.
   */
  markdownTokenizer?: MarkdownTokenizer

  /**
   * Optional markdown options for indentation
   */
  markdownOptions?: {
    /**
     * Defines if this markdown element should indent it's child elements
     */
    indentsContent?: boolean
  }

  /**
   * This function extends the schema of the node.
   * @example
   * extendNodeSchema() {
   *   return {
   *     group: 'inline',
   *     selectable: false,
   *   }
   * }
   */
  extendNodeSchema?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          parent: ParentConfig<Config>['extendNodeSchema']
        },
        extension: Node,
      ) => Record<string, any>)
    | null

  /**
   * This function extends the schema of the mark.
   * @example
   * extendMarkSchema() {
   *   return {
   *     group: 'inline',
   *     selectable: false,
   *   }
   * }
   */
  extendMarkSchema?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          parent: ParentConfig<Config>['extendMarkSchema']
        },
        extension: Mark,
      ) => Record<string, any>)
    | null

  /**
   * The editor is not ready yet.
   */
  onBeforeCreate?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          editor: SlideEditor
          type: PMType
          parent: ParentConfig<Config>['onBeforeCreate']
        },
        event: EditorEvents['beforeCreate'],
      ) => void)
    | null

  /**
   * The editor is ready.
   */
  onCreate?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          editor: SlideEditor
          type: PMType
          parent: ParentConfig<Config>['onCreate']
        },
        event: EditorEvents['create'],
      ) => void)
    | null

  /**
   * The content has changed.
   */
  onUpdate?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          editor: SlideEditor
          type: PMType
          parent: ParentConfig<Config>['onUpdate']
        },
        event: EditorEvents['update'],
      ) => void)
    | null

  /**
   * The selection has changed.
   */
  onSelectionUpdate?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          editor: SlideEditor
          type: PMType
          parent: ParentConfig<Config>['onSelectionUpdate']
        },
        event: EditorEvents['selectionUpdate'],
      ) => void)
    | null

  /**
   * The editor state has changed.
   */
  onTransaction?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          editor: SlideEditor
          type: PMType
          parent: ParentConfig<Config>['onTransaction']
        },
        event: EditorEvents['transaction'],
      ) => void)
    | null

  /**
   * The editor is focused.
   */
  onFocus?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          editor: SlideEditor
          type: PMType
          parent: ParentConfig<Config>['onFocus']
        },
        event: EditorEvents['focus'],
      ) => void)
    | null

  /**
   * The editor isn't focused anymore.
   */
  onBlur?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          editor: SlideEditor
          type: PMType
          parent: ParentConfig<Config>['onBlur']
        },
        event: EditorEvents['blur'],
      ) => void)
    | null

  /**
   * The editor is destroyed.
   */
  onDestroy?:
    | ((
        this: {
          name: string
          options: Options
          storage: Storage
          editor: SlideEditor
          type: PMType
          parent: ParentConfig<Config>['onDestroy']
        },
        event: EditorEvents['destroy'],
      ) => void)
    | null
}

export class Extendable<
  Options = any,
  Storage = any,
  Config = ExtensionConfig<Options, Storage> | NodeConfig<Options, Storage> | MarkConfig<Options, Storage>,
> {
  type = 'extendable'
  parent: Extendable | null = null

  child: Extendable | null = null

  name = ''

  config: Config = {
    name: this.name,
  } as Config

  constructor(config: Partial<Config> = {}) {
    this.config = {
      ...this.config,
      ...config,
    }

    this.name = (this.config as any).name
  }

  get options(): Options {
    return {
      ...(callOrReturn(
        getExtensionField<AnyConfig['addOptions']>(this as any, 'addOptions', {
          name: this.name,
        }),
      ) || {}),
    }
  }

  get storage(): Readonly<Storage> {
    return {
      ...(callOrReturn(
        getExtensionField<AnyConfig['addStorage']>(this as any, 'addStorage', {
          name: this.name,
          options: this.options,
        }),
      ) || {}),
    }
  }

  configure(options: Partial<Options> = {}) {
    const extension = this.extend<Options, Storage, Config>({
      ...this.config,
      addOptions: () => {
        return mergeDeep(this.options as Record<string, any>, options) as Options
      },
    })

    extension.name = this.name
    extension.parent = this.parent

    return extension
  }

  extend<
    ExtendedOptions = Options,
    ExtendedStorage = Storage,
    ExtendedConfig =
      | ExtensionConfig<ExtendedOptions, ExtendedStorage>
      | NodeConfig<ExtendedOptions, ExtendedStorage>
      | MarkConfig<ExtendedOptions, ExtendedStorage>,
  >(extendedConfig: Partial<ExtendedConfig> = {}): Extendable<ExtendedOptions, ExtendedStorage> {
    const extension = new (this.constructor as any)({ ...this.config, ...extendedConfig })

    extension.parent = this
    this.child = extension
    extension.name = 'name' in extendedConfig ? extendedConfig.name : extension.parent.name

    return extension
  }
}
