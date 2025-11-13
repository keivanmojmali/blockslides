import type { DOMOutputSpec } from "@blockslides/pm/model";

export const textShadow = {
  attrs: {
    shadow: { default: "2px 2px 4px rgba(0,0,0,0.3)" },
  },
  parseDOM: [
    {
      style: "text-shadow",
      getAttrs(value: string) {
        return { shadow: value };
      },
    },
  ],
  toDOM(mark: any): DOMOutputSpec {
    const { shadow } = mark.attrs;
    return ["span", { style: `text-shadow: ${shadow}` }, 0];
  },
};
