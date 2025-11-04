# AutoArtifacts

AutoArtifacts is a ProseMirror-powered slide authoring toolkit that provides the core building blocks, schema, and UI bindings needed to build interactive presentation editors. The project adapts the TipTap-inspired architecture to support slide-specific concepts such as rows, columns, and layout-driven styling.

## Features
- ProseMirror schema tailored for slide decks (`slide`, `row`, `column`, etc.)
- Core editor runtime exposed via `@autoartifacts/core`
- React bindings (`@autoartifacts/react`) and a prebuilt extension kit for rapid prototyping
- Demo Next.js application that showcases composing slides with rich text, media, and layout controls

## Prerequisites
- Node.js 20.x or newer (Next.js 15 and React 19 require Node 18+, Node 20 is recommended)
- [pnpm](https://pnpm.io/) v8 or newer

## Installation
1. pnpm i
2. pnpm build (from root)

## Running the Demo
3. pnpm dev from /demo


## Schema Overview
AutoArtifacts extends the base ProseMirror schema with slide-focused nodes:

- **Document → `slide+`**: every document starts as a stack of slides.
- **`slide` node**: wraps one or more `row` nodes, carrying slide-level attributes (classes, theming).
- **`row` node** (`@autoartifacts/extension-row`): horizontal flex container; can host `column` nodes or fallback `block` content. Supports layout presets via `data-layout` (e.g., `1-1`, `1-2-1`).
- **`column` node** (`@autoartifacts/extension-column`): vertical flex container inside a row; controls alignment, padding, and stacking of nested blocks or rows for complex grids.
- **Block content**: paragraphs, headings, bullet/ordered lists, images, videos, and any custom nodes added via extensions.
- **Marks**: bold, italic, underline, highlight, links, code, font-family, font-size, text color/shadow, superscript/subscript, etc., defined under `packages/core/src/schema/marks`.

All nodes and marks follow standard ProseMirror specs, so you can extend or override them as needed. The `@autoartifacts/extension-kit` package exports a curated set of extensions (slides, rows, columns, text blocks, list support, layout UI helpers) to jump-start editor configuration.

## Development Scripts
- `pnpm dev`: runs `dev` for every workspace package that exposes it.
- `pnpm build`: builds the core library with `tsup`.

## License
See `LICENSE.md`.