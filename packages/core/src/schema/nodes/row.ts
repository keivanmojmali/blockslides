import type { DOMOutputSpec } from "prosemirror-model";

export const row = {
  content: "column+ | block+",
  attrs: {
    className: { default: "" },
    layout: { default: "" }, // e.g., '2-1', '1-1-1', empty = equal distribution
  },
  parseDOM: [{ tag: "div.row" }],
  toDOM(node: any): DOMOutputSpec {
    const { className, layout } = node.attrs;
    return [
      "div",
      {
        class: `row ${className}`.trim(),
        "data-node-type": "row",
        "data-layout": layout || "auto",
      },
      0,
    ];
  },
};
