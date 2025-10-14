import type { DOMOutputSpec } from "prosemirror-model";

export const strikethrough = {
  parseDOM: [
    { tag: "s" },
    { tag: "del" },
    { style: "text-decoration=line-through" },
  ],
  toDOM(): DOMOutputSpec {
    return ["s", 0];
  },
};
