import { mergeAttributes, Node } from "@autoartifacts/core";
import "./column.css";

export interface ColumnOptions {
  /**
   * The HTML attributes for a column node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
}

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
});
