import type { DOMOutputSpec } from "@blockslides/pm/model";

export const subscript = {
  excludes: "superscript",
  parseDOM: [{ tag: "sub" }, { style: "vertical-align=sub" }],
  toDOM(): DOMOutputSpec {
    return ["sub", 0];
  },
};
