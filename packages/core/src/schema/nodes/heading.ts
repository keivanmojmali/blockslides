import type { DOMOutputSpec } from "@blockslides/pm/model";

export const heading = {
  attrs: {
    level: { default: 1 },
    placeholder: { default: null },
  },
  content: "inline*",
  group: "block",
  defining: true,
  parseDOM: [
    {
      tag: "h1",
      getAttrs(dom: any) {
        return {
          level: 1,
          placeholder: dom.getAttribute("data-placeholder") || null,
        };
      },
    },
    {
      tag: "h2",
      getAttrs(dom: any) {
        return {
          level: 2,
          placeholder: dom.getAttribute("data-placeholder") || null,
        };
      },
    },
    {
      tag: "h3",
      getAttrs(dom: any) {
        return {
          level: 3,
          placeholder: dom.getAttribute("data-placeholder") || null,
        };
      },
    },
    {
      tag: "h4",
      getAttrs(dom: any) {
        return {
          level: 4,
          placeholder: dom.getAttribute("data-placeholder") || null,
        };
      },
    },
    {
      tag: "h5",
      getAttrs(dom: any) {
        return {
          level: 5,
          placeholder: dom.getAttribute("data-placeholder") || null,
        };
      },
    },
    {
      tag: "h6",
      getAttrs(dom: any) {
        return {
          level: 6,
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
    return ["h" + node.attrs.level, attrs, 0];
  },
};

