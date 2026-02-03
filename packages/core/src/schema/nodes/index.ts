import { nodes as basicNodes } from "@blockslides/pm/schema-basic";
import { slide } from "./slides";
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
  image,
  video,
  bulletList,
  orderedList,
  listItem,
  paragraph,
  heading,
  text: basicNodes.text,
};
