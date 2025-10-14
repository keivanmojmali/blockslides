import type { DOMOutputSpec } from "prosemirror-model";

export const code = {
  parseDOM: [{ tag: "code" }],
  toDOM(): DOMOutputSpec {
    return ["code", { class: "inline-code" }, 0];
  },
  excludes: "_", // Code excludes all other marks
};
