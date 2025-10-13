import { nodes as basicNodes } from "prosemirror-schema-basic";
import { slide } from "./slides";
import { row } from "./row";
import { column } from "./column";
import { image } from "./image";
import { video } from "./video";
import { bulletList } from "./bulletList";
import { orderedList } from "./orderedList";
import { listItem } from "./listItem";
import { paragraph } from "./paragraph";
import { heading } from "./heading";

export const nodes = {
  doc: {
    content: "slide+",
  },
  slide,
  row,
  column,
  image,
  video,
  bulletList,
  orderedList,
  listItem,
  paragraph,
  heading,
  text: basicNodes.text,
};
