import { mergeAttributes, Node } from "@autoartifacts/core";
import "./row.css";

export interface RowOptions {
  /**
   * The HTML attributes for a row node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
}

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
});
