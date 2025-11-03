import type { DOMOutputSpec } from "@autoartifacts/pm/model";

export const textTransform = {
  attrs: {
    transform: { default: "none" }, // 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  },
  parseDOM: [
    {
      style: "text-transform",
      getAttrs(value: string) {
        return { transform: value };
      },
    },
  ],
  toDOM(mark: any): DOMOutputSpec {
    const { transform } = mark.attrs;
    return ["span", { style: `text-transform: ${transform}` }, 0];
  },
};
