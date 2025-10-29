import { mergeAttributes, Node, createStyleTag } from "@autoartifacts/core";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";

const rowStyles = `
.row {
  display: flex;
  flex: 1;
  min-height: 0;
}
`;

export interface RowOptions {
  /**
   * The HTML attributes for a row node.
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

const RowPluginKey = new PluginKey("row");

/**
 * The Row extension defines horizontal containers that can hold columns or blocks.
 */
export const Row = Node.create<RowOptions>({
  name: "row",

  content: "column+ | block+",

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
      layout: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-layout"),
        renderHTML: (attributes) => {
          if (!attributes.layout) {
            return {};
          }
          return {
            "data-layout": attributes.layout,
          };
        },
      },
      className: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.row" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "row",
        "data-node-type": "row",
      }),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: RowPluginKey,
        state: {
          init: () => {
            if (this.options.injectCSS && document) {
              createStyleTag(rowStyles, this.options.injectNonce, "row");
            }
            return {};
          },
          apply: (tr, pluginState) => pluginState,
        },
      }),
    ];
  },
});
