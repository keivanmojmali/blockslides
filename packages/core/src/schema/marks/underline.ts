import type { DOMOutputSpec } from "prosemirror-model";

export const underline = {
  parseDOM: [{ tag: "u" }, { style: "text-decoration=underline" }],
  toDOM(): DOMOutputSpec {
    return ["u", 0];
  },
};
