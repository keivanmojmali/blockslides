import type { DOMOutputSpec } from "prosemirror-model";

export const column = {
  content: "block+ | row+", // Allow nested rows
  attrs: {
    className: { default: "" },
    contentMode: { default: "default" }, // 'default' | 'cover' | 'contain'
    verticalAlign: { default: "top" }, // 'top' | 'center' | 'bottom'
    horizontalAlign: { default: "left" }, // 'left' | 'center' | 'right'
    padding: { default: "medium" }, // 'none' | 'small' | 'medium' | 'large'
  },
  parseDOM: [{ tag: "div.column" }],
  toDOM(node: any): DOMOutputSpec {
    const { className, contentMode, verticalAlign, horizontalAlign, padding } =
      node.attrs;
    return [
      "div",
      {
        class:
          `column ${className} content-${contentMode} v-align-${verticalAlign} h-align-${horizontalAlign} padding-${padding}`.trim(),
        "data-node-type": "column",
      },
      0,
    ];
  },
};
