import * as schemas from "../../schemas/v1";

/**
 * Human- and AI-readable bundle of all v1 JSON Schemas.
 *
 * This is intended for:
 * - LLMs that want to see the exact JSON Schema contracts
 * - Tools that want a single text blob containing every schema
 *
 * Each schema is pretty-printed and prefixed with its key name.
 */
export const allSchemas = Object.entries(schemas)
  .map(
    ([name, schema]) =>
      `Schema "${name}":\n` + JSON.stringify(schema as unknown, null, 2)
  )
  .join("\n\n");



