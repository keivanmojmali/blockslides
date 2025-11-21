import { core, fullDocument, imageBlock, editingRules } from "../../contexts/v1";

export const imageEditing = [core, fullDocument, imageBlock, editingRules].join("\n\n");


