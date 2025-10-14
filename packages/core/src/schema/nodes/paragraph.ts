import type { DOMOutputSpec } from "prosemirror-model";

export const paragraph = {
  content: "inline*",
  group: "block",
  attrs: {
    placeholder: { default: null },
  },
  parseDOM: [
    {
      tag: "p",
      getAttrs(dom: any) {
        return {
          placeholder: dom.getAttribute("data-placeholder") || null,
        };
      },
    },
  ],
  toDOM(node: any): DOMOutputSpec {
    const attrs: any = {};
    if (node.attrs.placeholder) {
      attrs["data-placeholder"] = node.attrs.placeholder;
    }
    return ["p", attrs, 0];
  },
};

