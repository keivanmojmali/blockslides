import type { DOMOutputSpec } from "prosemirror-model";

export const image = {
  attrs: {
    src: { default: "" },
    alt: { default: "" },
    width: { default: null }, // optional: number (pixels) or string (percentage)
    display: { default: "default" }, // 'default' | 'cover' | 'contain' | 'fill'
    align: { default: "left" }, // 'left' | 'center' | 'right'
  },
  inline: false, // block-level node
  group: "block",
  draggable: true,
  parseDOM: [
    {
      tag: "img",
      getAttrs: (dom: HTMLElement) => ({
        src: dom.getAttribute("src") || "",
        alt: dom.getAttribute("alt") || "",
        width: dom.getAttribute("width") || null,
        display: dom.getAttribute("data-display") || "default",
        align: dom.getAttribute("data-align") || "left",
      }),
    },
  ],
  toDOM(node: any): DOMOutputSpec {
    const { src, alt, width, display, align } = node.attrs;
    return [
      "img",
      {
        src,
        alt,
        width: width || undefined,
        "data-display": display,
        "data-align": align,
        "data-node-type": "image",
      },
    ];
  },
};
