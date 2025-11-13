import type { DOMOutputSpec } from "@blockslides/pm/model";

export const slide = {
  content: "row+",
  attrs: {
    className: { default: "" },
  },
  parseDOM: [{ tag: "div.slide" }],
  toDOM(node: any): DOMOutputSpec {
    const { className } = node.attrs;
    return [
      "div",
      {
        class: `slide ${className}`.trim(),
        "data-node-type": "slide",
      },
      0,
    ];
  },
};
