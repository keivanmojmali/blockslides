import type { DOMOutputSpec } from "prosemirror-model";

export const slide = {
  content: "row+",
  attrs: {
    className: { default: "" },
    layout: { default: "1" },
  },
  parseDOM: [{ tag: "div.slide" }],
  toDOM(node: any): DOMOutputSpec {
    const { className, layout } = node.attrs;
    return [
      "div",
      {
        class: `slide ${className}`.trim(),
        "data-node-type": "slide",
        "data-layout": layout || "1",
      },
      0,
    ];
  },
};
