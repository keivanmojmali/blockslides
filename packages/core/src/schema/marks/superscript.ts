import type { DOMOutputSpec } from "prosemirror-model";

export const superscript = {
  excludes: "subscript", // Can't be both superscript and subscript
  parseDOM: [{ tag: "sup" }, { style: "vertical-align=super" }],
  toDOM(): DOMOutputSpec {
    return ["sup", 0];
  },
};
