# BlockSlides

ProseMirror-powered, slide-first editing toolkit for visual asset editors (slides, social graphics, printables) with a headless core, 50+ extensions, and React bindings.


## Quick links
- Hosted docs: https://blockslides.com
- React quickstart (local): `docs/getting-started/quickstart/react.md`
- Start here (local concepts): `docs/getting-started/overview.md`
- Full local docs: `docs/` (run `pnpm docs:dev`)
- Packages: `packages/`

## Why BlockSlides
Most editors are document-first; BlockSlides is asset-first. Slides have dimensions and layouts, making them ideal for bounded canvases like decks, hero banners, social graphics, and printables. Content stays as structured JSON for rendering, export, and AI workflows.

## Core concepts
- **Slides**: containers with size (16:9, A4, square) and layout.
- **Blocks**: content pieces inside slides (text, images, lists, tables, media).
- **Extensions**: modular features (block types, behaviors, shortcuts); compose what you need.
- **Schemas**: structured JSON definitions for validation, transforms, and export.

## What you get
- Headless editor runtime on ProseMirror (`@blockslides/core`).
- 50+ extensions for text, media, layouts, tables, math, markdown, and editor behaviors.
- React bindings (`@blockslides/react`) plus a batteries-included Extension Kit.
- Import/export helpers for HTML/Markdown and static rendering.
- AI-ready schemas and templates (`@blockslides/ai-context`).

## Quickstart (React)

Install:

```bash
pnpm add @blockslides/react @blockslides/core @blockslides/pm
```

Example:

```tsx
"use client";
import { ReactSlideEditor } from "@blockslides/react";
import type { JSONContent, Editor } from "@blockslides/react";

export default function MyEditor() {
  const initialContent: JSONContent = {
    type: "doc",
    content: [
      {
        type: "slide",
        attrs: { size: "16x9", id: "slide-1" },
        content: [
          {
            type: "column",
            attrs: { align: "center", justify: "center" },
            content: [
              { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Welcome" }] },
            ],
          },
        ],
      },
    ],
  };

  const handleChange = (doc: JSONContent, editor: Editor) => {
    console.log("Document updated:", doc);
  };

  return (
    <div style={{ backgroundColor: "#f3f4f6", height: "100%", padding: "3rem", display: "flex", justifyContent: "center" }}>
      <ReactSlideEditor
        content={initialContent}
        onChange={handleChange}
        extensionKitOptions={{ slide: { renderMode: "dynamic" } }}
      />
    </div>
  );
}
```

`ReactSlideEditor` includes everything to get started quickly. For more control over rendering and layout, see the hooks section in `docs/getting-started/quickstart/react.md` (`#using-hooks-for-more-control`).

## Packages snapshot
- `@blockslides/core`: editor runtime and schema.
- `@blockslides/react`: hooks and components.
- `@blockslides/extension-kit`: pre-configured bundle of extensions.
- `@blockslides/pm`: ProseMirror glue and shared types.
- `@blockslides/html`, `@blockslides/markdown`, `@blockslides/static-renderer`: render/import/export helpers.
- `@blockslides/ai-context`: AI-ready schemas and templates.

## Repo scripts
- Install: `pnpm install`
- Build all packages: `pnpm build`
- Dev (per package): `pnpm dev`
- Docs dev server: `pnpm docs:dev`

## License

See `LICENSE.md`.
