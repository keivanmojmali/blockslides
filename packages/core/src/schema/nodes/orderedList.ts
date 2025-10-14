import type { DOMOutputSpec } from "prosemirror-model";

export const orderedList = {
  attrs: {
    className: { default: "" },
    start: { default: 1 }, // starting number
  },
  group: "block",
  content: "listItem+",
  parseDOM: [
    {
      tag: "ol",
      getAttrs: (dom: HTMLElement) => ({
        className: dom.className || "",
        start: parseInt(dom.getAttribute("start") || "1", 10),
      }),
    },
  ],
  toDOM(node: any): DOMOutputSpec {
    const { className, start } = node.attrs;
    return [
      "ol",
      {
        class: `ordered-list ${className}`.trim(),
        start: start !== 1 ? start : undefined,
        "data-node-type": "ordered-list",
      },
      0,
    ];
  },
};
