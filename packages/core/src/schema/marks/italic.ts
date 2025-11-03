import type { DOMOutputSpec } from "@autoartifacts/pm/model";

export const italic = {
  parseDOM: [{ tag: "em" }, { tag: "i" }, { style: "font-style=italic" }],
  toDOM(): DOMOutputSpec {
    return ["em", 0];
  },
};
