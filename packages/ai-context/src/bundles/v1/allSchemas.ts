import * as schemas from "../../schemas/v1";

/**
 * Human- and AI-readable bundle of all v1 JSON Schemas.
 *
 * Wrapped in a top-level <Schemas>…</Schemas> tag, with each schema
 * enclosed in its own <{name}Schema>…</{name}Schema> block.
 */
export const allSchemas = `
<Schemas>
${Object.entries(schemas)
  .map(
    ([name, schema]) =>
      `<${name}Schema>\n` +
      JSON.stringify(schema as unknown, null, 2) +
      `\n</${name}Schema>`
  )
  .join("\n\n")}
</Schemas>
`.trim();



