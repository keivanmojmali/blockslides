export const row = `
<Context>
<row>
Node: row
Attrs:
- layout (optional): "", "1", "1-1", "2-1", "1-2", "1-1-1", "2-1-1", "1-2-1", "1-1-2", "1-1-1-1"
- className (optional): string (CSS classes)

Semantics:
- Fractions determine relative column flex:
  - 1-1: two equal columns
  - 2-1: first column is double width
  - 1-2: second column is double width
  - 1-1-1: three equal columns
  - 1-1-1-1: four equal columns
- Empty layout ("", "1") acts as a single full-width column.
</row>
</Context>
`.trim();


