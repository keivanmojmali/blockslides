import type { DOMOutputSpec } from "@autoartifacts/pm/model";

export const link = {
  attrs: {
    href: { default: "" },
    title: { default: null },
    target: { default: "_blank" },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: "a[href]",
      getAttrs(dom: HTMLElement) {
        return {
          href: dom.getAttribute("href"),
          title: dom.getAttribute("title"),
          target: dom.getAttribute("target"),
        };
      },
    },
  ],
  toDOM(mark: any): DOMOutputSpec {
    const { href, title, target } = mark.attrs;
    return [
      "a",
      {
        href,
        title: title || undefined,
        target,
        rel: "noopener noreferrer",
      },
      0,
    ];
  },
};
