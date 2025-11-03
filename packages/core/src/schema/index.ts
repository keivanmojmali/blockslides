import { Schema } from "@autoartifacts/pm/model";
import { nodes } from "./nodes";
import { marks } from "./marks";

export const schema = new Schema({
  nodes,
  marks,
});
