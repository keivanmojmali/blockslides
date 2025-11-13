import type { DOMOutputSpec } from "@blockslides/pm/model";

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
