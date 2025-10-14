import type { DOMOutputSpec } from "prosemirror-model";

export const highlight = {
  attrs: {
    color: { default: "#ffff00" },
  },
  parseDOM: [
    {
      tag: "mark",
      getAttrs(dom: HTMLElement) {
        return { color: dom.style.backgroundColor || "#ffff00" };
      },
    },
    {
      style: "background-color",
      getAttrs(value: string) {
        return { color: value };
      },
    },
  ],
  toDOM(mark: any): DOMOutputSpec {
    const { color } = mark.attrs;
    return ["mark", { style: `background-color: ${color}` }, 0];
  },
};
