import type { DOMOutputSpec } from "@autoartifacts/pm/model";

export const lineHeight = {
  attrs: {
    height: { default: "normal" }, // 'tight' | 'normal' | 'relaxed' | custom number
  },
  parseDOM: [
    {
      style: "line-height",
      getAttrs(value: string) {
        return { height: value };
      },
    },
  ],
  toDOM(mark: any): DOMOutputSpec {
    const { height } = mark.attrs;
    const heightMap: Record<string, string> = {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    };
    const cssHeight = heightMap[height] || height;
    return ["span", { style: `line-height: ${cssHeight}` }, 0];
  },
};
