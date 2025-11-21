import { core, fullDocument, slide, row, column } from "../../contexts/v1";

export const createSlide = [
  core,
  fullDocument,
  slide,
  row,
  column,
  `
Return a single JSON document that creates one 16x9 slide with a 1-1 row:
{
  "type": "doc",
  "content": [
    {
      "type": "slide",
      "attrs": { "size": "16x9" },
      "content": [
        { "type": "row", "attrs": { "layout": "1-1" }, "content": [
          { "type": "column", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Left" }] }] },
          { "type": "column", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Right" }] }] }
        ] }
      ]
    }
  ]
}
`.trim(),
].join("\n\n");


