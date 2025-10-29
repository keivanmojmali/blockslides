import { mergeAttributes, Node, createStyleTag } from "@autoartifacts/core";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";

const columnStyles = `
.column {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-width: 0;
}
`;

export interface ColumnOptions {
  /**
   * The HTML attributes for a column node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
  /**
   * Whether to inject CSS styles
   * @default true
   */
  injectCSS: boolean;
  /**
   * Content Security Policy nonce
   */
  injectNonce?: string;
}

const ColumnPluginKey = new PluginKey("column");

/**
 * The Column extension defines vertical containers within rows.
 */
export const Column = Node.create<ColumnOptions>({
  name: "column",

  content: "block+ | row+",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      injectCSS: true,
      injectNonce: undefined,
    };
  },

  addAttributes() {
    return {
      className: {
        default: "",
      },
      contentMode: {
        default: "default",
      },
      verticalAlign: {
        default: "top",
      },
      horizontalAlign: {
        default: "left",
      },
      padding: {
        default: "medium",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.column" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { contentMode, verticalAlign, horizontalAlign, padding, className } =
      HTMLAttributes;

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        class: `column ${
          className || ""
        } content-${contentMode} v-align-${verticalAlign} h-align-${horizontalAlign} padding-${padding}`.trim(),
        "data-node-type": "column",
      }),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: ColumnPluginKey,
        state: {
          init: () => {
            if (this.options.injectCSS && document) {
              createStyleTag(columnStyles, this.options.injectNonce, "column");
            }
            return {};
          },
          apply: (tr, pluginState) => pluginState,
        },
      }),
    ];
  },
});
