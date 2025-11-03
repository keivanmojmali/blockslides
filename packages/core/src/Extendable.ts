import type { Plugin } from "@autoartifacts/pm/state";

import { SlideEditor as Editor } from "./SlideEditor.js";
import { getExtensionField } from "./helpers/getExtensionField.js";
import type { ExtensionConfig, MarkConfig, NodeConfig } from "./index.js";
import type { InputRule } from "./InputRule.js";
import type { Mark } from "./Mark.js";
import type { Node } from "./Node.js";
import type { PasteRule } from "./PasteRule.js";
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
} from "./types.js";
import { callOrReturn } from "./utilities/callOrReturn.js";
import { mergeDeep } from "./utilities/mergeDeep.js";

export interface ExtendableConfig<
  Options = any,
  Storage = any,
  Config extends
    | ExtensionConfig<Options, Storage>
    | NodeConfig<Options, Storage>
    | MarkConfig<Options, Storage>
    | ExtendableConfig<Options, Storage> = ExtendableConfig<
    Options,
    Storage,
    any,
    any
  >,
  PMType = any
> {
  /**
   * The extension name - this must be unique.
   * It will be used to identify the extension.
   *
   * @example 'myExtension'
   */
  name: string;

  /**
   * The priority of your extension. The higher, the earlier it will be called
   * and will take precedence over other extensions with a lower priority.
   * @default 100
   * @example 101
   */
  priority?: number;

  addOptions?: (this: {
    name: string;
    parent: ParentConfig<Config>["addOptions"];
  }) => Options;

  
  addStorage?: (this: {
    name: string;
    options: Options;
    parent: ParentConfig<Config>["addStorage"];
  }) => Storage;

  addGlobalAttributes?: (this: {
    name: string;
    options: Options;
    storage: Storage;
    extensions: (Node | Mark)[];
    parent: ParentConfig<Config>["addGlobalAttributes"];
  }) => GlobalAttributes;

  addCommands?: (this: {
    name: string;
    options: Options;
    storage: Storage;
    editor: Editor;
    type: PMType;
    parent: ParentConfig<Config>["addCommands"];
  }) => Partial<RawCommands>;

  addKeyboardShortcuts?: (this: {
    name: string;
    options: Options;
    storage: Storage;
    editor: Editor;
    type: PMType;
    parent: ParentConfig<Config>["addKeyboardShortcuts"];
  }) => {
    [key: string]: KeyboardShortcutCommand;
  };

  addInputRules?: (this: {
    name: string;
    options: Options;
    storage: Storage;
    editor: Editor;
    type: PMType;
    parent: ParentConfig<Config>["addInputRules"];
  }) => InputRule[];

  addPasteRules?: (this: {
    name: string;
    options: Options;
    storage: Storage;
    editor: Editor;
    type: PMType;
    parent: ParentConfig<Config>["addPasteRules"];
  }) => PasteRule[];

  addProseMirrorPlugins?: (this: {
    name: string;
    options: Options;
    storage: Storage;
    editor: Editor;
    type: PMType;
    parent: ParentConfig<Config>["addProseMirrorPlugins"];
  }) => Plugin[];

  addExtensions?: (this: {
    name: string;
    options: Options;
    storage: Storage;
    parent: ParentConfig<Config>["addExtensions"];
  }) => Extensions;

  markdownTokenName?: string;

  /**
   * The parse function used by the markdown parser to convert markdown tokens to ProseMirror nodes.
   */
  parseMarkdown?: (
    token: MarkdownToken,
    helpers: MarkdownParseHelpers
  ) => MarkdownParseResult;

  /**
   * The serializer function used by the markdown serializer to convert ProseMirror nodes to markdown tokens.
   */
  renderMarkdown?: (
    node: JSONContent,
    helpers: MarkdownRendererHelpers,
    ctx: RenderContext
  ) => string;

  /**
   * The markdown tokenizer responsible for turning a markdown string into tokens
   *
   * Custom tokenizers are only needed when you want to parse non-standard markdown token.
   */
  markdownTokenizer?: MarkdownTokenizer;

  /**
   * Optional markdown options for indentation
   */
  markdownOptions?: {
    /**
     * Defines if this markdown element should indent it's child elements
     */
    indentsContent?: boolean;
  };

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
          name: string;
          options: Options;
          storage: Storage;
          parent: ParentConfig<Config>["extendNodeSchema"];
        },
        extension: Node
      ) => Record<string, any>)
    | null;

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
          name: string;
          options: Options;
          storage: Storage;
          parent: ParentConfig<Config>["extendMarkSchema"];
        },
        extension: Mark
      ) => Record<string, any>)
    | null;

  /**
   * The editor is not ready yet.
   */
  onBeforeCreate?:
    | ((
        this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          type: PMType;
          parent: ParentConfig<Config>["onBeforeCreate"];
        },
        event: EditorEvents["beforeCreate"]
      ) => void)
    | null;

  /**
   * The editor is ready.
   */
  onCreate?:
    | ((
        this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          type: PMType;
          parent: ParentConfig<Config>["onCreate"];
        },
        event: EditorEvents["create"]
      ) => void)
    | null;

  /**
   * The content has changed.
   */
  onUpdate?:
    | ((
        this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          type: PMType;
          parent: ParentConfig<Config>["onUpdate"];
        },
        event: EditorEvents["update"]
      ) => void)
    | null;

  /**
   * The selection has changed.
   */
  onSelectionUpdate?:
    | ((
        this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          type: PMType;
          parent: ParentConfig<Config>["onSelectionUpdate"];
        },
        event: EditorEvents["selectionUpdate"]
      ) => void)
    | null;

  /**
   * The editor state has changed.
   */
  onTransaction?:
    | ((
        this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          type: PMType;
          parent: ParentConfig<Config>["onTransaction"];
        },
        event: EditorEvents["transaction"]
      ) => void)
    | null;

  /**
   * The editor is focused.
   */
  onFocus?:
    | ((
        this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          type: PMType;
          parent: ParentConfig<Config>["onFocus"];
        },
        event: EditorEvents["focus"]
      ) => void)
    | null;

  /**
   * The editor isn’t focused anymore.
   */
  onBlur?:
    | ((
        this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          type: PMType;
          parent: ParentConfig<Config>["onBlur"];
        },
        event: EditorEvents["blur"]
      ) => void)
    | null;

  /**
   * The editor is destroyed.
   */
  onDestroy?:
    | ((
        this: {
          name: string;
          options: Options;
          storage: Storage;
          editor: Editor;
          type: PMType;
          parent: ParentConfig<Config>["onDestroy"];
        },
        event: EditorEvents["destroy"]
      ) => void)
    | null;
}

export class Extendable<
  Options = any,
  Storage = any,
  Config =
    | ExtensionConfig<Options, Storage>
    | NodeConfig<Options, Storage>
    | MarkConfig<Options, Storage>
> {
  type = "extendable";
  parent: Extendable | null = null;

  child: Extendable | null = null;

  name = "";

  config: Config = {
    name: this.name,
  } as Config;

  constructor(config: Partial<Config> = {}) {
    this.config = {
      ...this.config,
      ...config,
    };

    this.name = (this.config as any).name;
  }

  get options(): Options {
    return {
      ...(callOrReturn(
        getExtensionField<AnyConfig["addOptions"]>(this as any, "addOptions", {
          name: this.name,
        })
      ) || {}),
    };
  }

  get storage(): Readonly<Storage> {
    return {
      ...(callOrReturn(
        getExtensionField<AnyConfig["addStorage"]>(this as any, "addStorage", {
          name: this.name,
          options: this.options,
        })
      ) || {}),
    };
  }

  configure(options: Partial<Options> = {}) {
    const extension = this.extend<Options, Storage, Config>({
      ...this.config,
      addOptions: () => {
        return mergeDeep(
          this.options as Record<string, any>,
          options
        ) as Options;
      },
    });

    extension.name = this.name;
    extension.parent = this.parent;

    return extension;
  }

  extend<
    ExtendedOptions = Options,
    ExtendedStorage = Storage,
    ExtendedConfig =
      | ExtensionConfig<ExtendedOptions, ExtendedStorage>
      | NodeConfig<ExtendedOptions, ExtendedStorage>
      | MarkConfig<ExtendedOptions, ExtendedStorage>
  >(
    extendedConfig: Partial<ExtendedConfig> = {}
  ): Extendable<ExtendedOptions, ExtendedStorage> {
    const extension = new (this.constructor as any)({
      ...this.config,
      ...extendedConfig,
    });

    extension.parent = this;
    this.child = extension;
    extension.name =
      "name" in extendedConfig ? extendedConfig.name : extension.parent.name;

    return extension;
  }
}
