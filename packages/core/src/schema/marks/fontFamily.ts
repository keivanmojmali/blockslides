import type { DOMOutputSpec } from "@autoartifacts/pm/model";

export const fontFamily = {
  attrs: {
    family: { default: "sans-serif" }, // 'sans-serif' | 'serif' | 'monospace' | custom
  },
  parseDOM: [
    {
      style: "font-family",
      getAttrs(value: string) {
        return { family: value };
      },
    },
  ],
  toDOM(mark: any): DOMOutputSpec {
    const { family } = mark.attrs;
    return ["span", { style: `font-family: ${family}` }, 0];
  },
};
