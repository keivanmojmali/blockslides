# What can you make?

Blockslides stores your content as **slides**. A flexible JSON data structure you can shape into many kinds of visual assets.

```ts
const doc = {
  type: "doc", //Top level doc. Always there/ Always the same
  content: [
    {
      type: "slide", //<-- The slide block / Only valid child of top level doc
      attrs: { size: "4x3" }, //Where the asset layout is defined
      content: [...],
    },
  ],
};
```

Notice the `attrs.size: "4x3"` — that’s what makes this slide a 4x3 canvas.

## Things you can build
- Presentation decks
- LinkedIn banners and social cover images
- Instagram posts and reels covers
- Twitter/X cards
- Hero/landing banners and thumbnails
- Printable one-pagers and handouts (A4/Letter/PDF)

## Sizes you already get
- `16x9`, `4x3`
- `a4-portrait`, `a4-landscape`
- `letter-portrait`, `letter-landscape`
- `linkedin-banner`

## Pre-built layouts you can start from
Blockslides includes pre-built slide templates you can use as a starting point, like:

- `tpl.titleAndSubheader`
- `tpl.imageAndText`
- `tpl.textAndImage`
- `tpl.twoColumns`
- `tpl.twoColumnsWithHeader`
- `tpl.threeColumns`
- `tpl.threeColumnsWithHeader`
- `tpl.fourColumns`
- `tpl.fourColumnsWithHeader`
- `tpl.titleWithBullets`
- `tpl.titleBulletsAndImage`
- `tpl.twoImageColumns`
- `tpl.accentLeft`
- `tpl.accentRight`
- `tpl.accentTop`
- `tpl.accentRightFit`
- `tpl.accentLeftFit`
- `tpl.fullImage`

Here’s what a simple “two columns” slide structure looks like:

```ts
const twoColumns = {
  type: "slide",
  attrs: { id: "slide-1", size: "16x9" },
  content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Section heading" }] },
    {
      type: "columnGroup",
      content: [
        {
          type: "column",
          attrs: { padding: "md", gap: "sm", fill: true },
          content: [{ type: "paragraph", content: [{ type: "text", text: "Left column…" }] }],
        },
        {
          type: "column",
          attrs: { padding: "md", gap: "sm", fill: true },
          content: [{ type: "paragraph", content: [{ type: "text", text: "Right column…" }] }],
        },
      ],
    },
  ],
};
```

## Switching to `linkedin-banner`

```ts
const bannerDoc = {
  type: "doc",
  content: [
    {
      type: "slide",
      attrs: { id: "banner-1", size: "linkedin-banner" },
      content: [
        {
          type: "column",
          attrs: { padding: "lg", gap: "sm", fill: true, justify: "center" },
          content: [
            { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "LinkedIn banner" }] },
            { type: "paragraph", content: [{ type: "text", text: "Same blocks, different canvas size." }] },
          ],
        },
      ],
    },
  ],
};
```

**You can mix layouts within the same editor**:

```ts
const mixedSizes = {
  type: "doc",
  content: [
    { type: "slide", attrs: { id: "slide-1", size: "4x3" }, content: [] },
    { type: "slide", attrs: { id: "slide-2", size: "linkedin-banner" }, content: [] },
  ],
};
```

## Custom sizes
Use the slide size setting to match any aspect ratio or pixel target (e.g., a brand-specific social or print spec). Add your own preset when you need a bespoke format.

## Why this works
Slides are layout containers. You fill them with blocks (text, images, embeds, tables, etc.), so the same editor can produce decks, banners, posts, or print-friendly pages. Next up: “What are blocks?”
