# @autoartifacts/extension-slide

Slide node extension for AutoArtifacts presentations.

## What it does

Defines the `slide` node type that goes inside the `doc` node.

Each slide contains block content (paragraphs, headings, lists, images, etc.)

## Structure

```
doc
└── slide (this extension)
    └── paragraph | heading | list | etc.
```

## Usage

```typescript
import { SlideEditor } from "@autoartifacts/core";
import { Document } from "@autoartifacts/extension-document";
import { Slide } from "@autoartifacts/extension-slide";
import { Paragraph } from "@autoartifacts/extension-paragraph";

const editor = new SlideEditor({
  extensions: [
    Document, // Top level: content: 'slide+'
    Slide, // Defines what a slide is
    Paragraph, // Content inside slides
  ],
});
```

## Attribution

Based on Tiptap's extension patterns.
Copyright (c) 2025, Tiptap GmbH
Licensed under MIT License
