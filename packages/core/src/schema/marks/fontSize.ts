import type { DOMOutputSpec } from "prosemirror-model";

export const fontSize = {
  attrs: {
    size: { default: "normal" }, // 'small' | 'normal' | 'large' | 'xlarge' | custom px/rem
  },
  parseDOM: [
    {
      style: "font-size",
      getAttrs(value: string) {
        return { size: value };
      },
    },
  ],
  toDOM(mark: any): DOMOutputSpec {
    const { size } = mark.attrs;
    const sizeMap: Record<string, string> = {
      small: "0.875rem",
      normal: "1rem",
      large: "1.25rem",
      xlarge: "1.5rem",
    };
    const cssSize = sizeMap[size] || size;
    return ["span", { style: `font-size: ${cssSize}` }, 0];
  },
};
