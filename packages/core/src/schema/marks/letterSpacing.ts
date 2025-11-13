import type { DOMOutputSpec } from "@blockslides/pm/model";

export const letterSpacing = {
  attrs: {
    spacing: { default: "normal" }, // 'tight' | 'normal' | 'wide' | custom em/px
  },
  parseDOM: [
    {
      style: "letter-spacing",
      getAttrs(value: string) {
        return { spacing: value };
      },
    },
  ],
  toDOM(mark: any): DOMOutputSpec {
    const { spacing } = mark.attrs;
    const spacingMap: Record<string, string> = {
      tight: "-0.05em",
      normal: "normal",
      wide: "0.1em",
    };
    const cssSpacing = spacingMap[spacing] || spacing;
    return ["span", { style: `letter-spacing: ${cssSpacing}` }, 0];
  },
};
