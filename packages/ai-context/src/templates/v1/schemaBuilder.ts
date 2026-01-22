// TODO: Add additional block helpers (tables, marks) to cover all extensions.
// TODO: Add server-side validation helper that checks slides against schemasV1.
// TODO: Add tests/examples that demonstrate agent/tool usage.

import type { JSONContent } from "@blockslides/core";
import type {
  SizeKey,
  SlideAttrs,
  ColumnAttrs,
  ImageBlockAttrs,
  BaseBlockAttrs,
} from "../../types/v1";

type Block = JSONContent;
type SlideNode = JSONContent; // slide -> block+
type TextMark = { type: string; attrs?: Record<string, any> };

const defaults = {
  slide: (attrs?: Partial<SlideAttrs>): SlideAttrs => ({
    id: attrs?.id ?? "slide-1",
    size: attrs?.size ?? ("16x9" as SizeKey),
    className: attrs?.className ?? "",
  }),
  column: (attrs?: Partial<ColumnAttrs>): ColumnAttrs => ({
    ...attrs,
  }),
};

const textNode = (text: string) =>
  ({
    type: "text",
    text,
  }) satisfies Block;

export const blocks = {
  text: (text: string, marks?: TextMark[]): Block =>
    marks && marks.length > 0
      ? ({ type: "text", text, marks } as Block)
      : textNode(text),

  paragraph: (text?: string): Block => ({
    type: "paragraph",
    content: text ? [textNode(text)] : [],
  }),

  heading: (text: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 2): Block => ({
    type: "heading",
    attrs: { level },
    content: [textNode(text)],
  }),

  bulletList: (items: (string | Block)[]): Block => ({
    type: "bulletList",
    content: items.map((item) =>
      typeof item === "string"
        ? {
            type: "listItem",
            content: [{ type: "paragraph", content: [textNode(item)] }],
          }
        : { type: "listItem", content: [item] }
    ),
  }),

  horizontalRule: (): Block => ({ type: "horizontalRule" }),

  hardBreak: (): Block => ({ type: "hardBreak" }),

  codeBlock: (code: string, language?: string): Block => ({
    type: "codeBlock",
    attrs: language ? { language } : undefined,
    content: code ? [textNode(code)] : [],
  }),

  imageBlock: (attrs: ImageBlockAttrs): Block => ({
    type: "imageBlock",
    attrs,
  }),

  // Additional nodes to mirror extensions/schemas
  blockquote: (content: Block[] = []): Block => ({
    type: "blockquote",
    content,
  }),

  listItem: (content: Block[] = []): Block => ({
    type: "listItem",
    content,
  }),

  image: (attrs: {
    src: string;
    alt?: string | null;
    title?: string | null;
    width?: number | null;
    height?: number | null;
  }): Block => ({
    type: "image",
    attrs,
  }),

  youtube: (attrs: {
    src?: string | null;
    start?: number;
    width?: number;
    height?: number;
  }): Block => ({
    type: "youtube",
    attrs,
  }),
};

type SingleColOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  columnAttrs?: Partial<ColumnAttrs>;
  content?: Block[];
};

type TwoColOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  leftColumnAttrs?: Partial<ColumnAttrs>;
  rightColumnAttrs?: Partial<ColumnAttrs>;
  left?: Block[];
  right?: Block[];
};

/**
 * Slide builder with presets for common layouts.
 * 
 * New schema: slides contain blocks directly (doc → slide+ → block+).
 * Adjacent columns automatically form horizontal layouts via CSS.
 */
export const slide = Object.assign(
  /**
   * Create a slide with direct block content (no column wrapper).
   */
  (opts: {
    slideAttrs?: Partial<SlideAttrs>;
    content?: Block[];
  } = {}): SlideNode => ({
    type: "slide",
    attrs: defaults.slide(opts.slideAttrs),
    content: opts.content ?? [],
  }),
  {
    /**
     * Single column layout - wraps content in one column block.
     */
    singleCol: (opts: SingleColOpts = {}): SlideNode => ({
      type: "slide",
      attrs: defaults.slide(opts.slideAttrs),
      content: [
        {
          type: "column",
          attrs: defaults.column(opts.columnAttrs),
          content: opts.content ?? [],
        },
      ],
    }),

    /**
     * Two column layout - adjacent columns form horizontal row via CSS.
     */
    twoCol: (opts: TwoColOpts = {}): SlideNode => ({
      type: "slide",
      attrs: defaults.slide(opts.slideAttrs),
      content: [
        {
          type: "column",
          attrs: defaults.column(opts.leftColumnAttrs),
          content: opts.left ?? [],
        },
        {
          type: "column",
          attrs: defaults.column(opts.rightColumnAttrs),
          content: opts.right ?? [],
        },
      ],
    }),

    /**
     * Three column layout - adjacent columns form horizontal row via CSS.
     */
    threeCol: (opts: {
      slideAttrs?: Partial<SlideAttrs>;
      col1Attrs?: Partial<ColumnAttrs>;
      col2Attrs?: Partial<ColumnAttrs>;
      col3Attrs?: Partial<ColumnAttrs>;
      col1?: Block[];
      col2?: Block[];
      col3?: Block[];
    } = {}): SlideNode => ({
      type: "slide",
      attrs: defaults.slide(opts.slideAttrs),
      content: [
        {
          type: "column",
          attrs: defaults.column(opts.col1Attrs),
          content: opts.col1 ?? [],
        },
        {
          type: "column",
          attrs: defaults.column(opts.col2Attrs),
          content: opts.col2 ?? [],
        },
        {
          type: "column",
          attrs: defaults.column(opts.col3Attrs),
          content: opts.col3 ?? [],
        },
      ],
    }),

    /**
     * Four column layout - adjacent columns form horizontal row via CSS.
     */
    fourCol: (opts: {
      slideAttrs?: Partial<SlideAttrs>;
      col1Attrs?: Partial<ColumnAttrs>;
      col2Attrs?: Partial<ColumnAttrs>;
      col3Attrs?: Partial<ColumnAttrs>;
      col4Attrs?: Partial<ColumnAttrs>;
      col1?: Block[];
      col2?: Block[];
      col3?: Block[];
      col4?: Block[];
    } = {}): SlideNode => ({
      type: "slide",
      attrs: defaults.slide(opts.slideAttrs),
      content: [
        {
          type: "column",
          attrs: defaults.column(opts.col1Attrs),
          content: opts.col1 ?? [],
        },
        {
          type: "column",
          attrs: defaults.column(opts.col2Attrs),
          content: opts.col2 ?? [],
        },
        {
          type: "column",
          attrs: defaults.column(opts.col3Attrs),
          content: opts.col3 ?? [],
        },
        {
          type: "column",
          attrs: defaults.column(opts.col4Attrs),
          content: opts.col4 ?? [],
        },
      ],
    }),
  }
);

// Slide layout presets beyond the base helpers
type HeroOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  columnAttrs?: Partial<ColumnAttrs>;
  content?: Block[];
};

type ImageCoverOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  image?: ImageBlockAttrs;
  overlay?: Block[];
  columnAttrs?: Partial<ColumnAttrs>;
};

type QuoteOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  columnAttrs?: Partial<ColumnAttrs>;
  quote?: Block[];
};

type AgendaOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  columnAttrs?: Partial<ColumnAttrs>;
  items?: (string | Block)[];
};

type MultiColOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  columns: {
    content?: Block[];
    attrs?: Partial<ColumnAttrs>;
  }[];
};

type MediaTextOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  media?: Block[];
  text?: Block[];
  mediaColumnAttrs?: Partial<ColumnAttrs>;
  textColumnAttrs?: Partial<ColumnAttrs>;
};

type Stack2Opts = {
  slideAttrs?: Partial<SlideAttrs>;
  topColumns?: { content?: Block[]; attrs?: Partial<ColumnAttrs> }[];
  bottomColumns?: { content?: Block[]; attrs?: Partial<ColumnAttrs> }[];
};

/** Helper to create a column block with attrs and content */
const column = (attrs: Partial<ColumnAttrs> | undefined, content: Block[] = []): Block => ({
  type: "column",
  attrs: defaults.column(attrs),
  content,
});

type TemplatePreset =
  | "slide.empty"
  | "slide.singleCol"
  | "slide.twoCol"
  | "slide.hero"
  | "slide.imageCover"
  | "slide.quote"
  | "slide.agenda"
  | "slide.grid3"
  | "slide.grid4"
  | "slide.oneTwo"
  | "slide.twoOne"
  | "slide.oneTwoOne"
  | "slide.textMedia"
  | "slide.mediaText"
  | "slide.stack2";

type CreateTemplateInput = {
  preset: TemplatePreset;
  slideAttrs?: Partial<SlideAttrs>;
  columnAttrs?: Partial<ColumnAttrs>;
  leftColumnAttrs?: Partial<ColumnAttrs>;
  rightColumnAttrs?: Partial<ColumnAttrs>;
  content?: Block[];
  left?: Block[];
  right?: Block[];
  heroOpts?: HeroOpts;
  imageCoverOpts?: ImageCoverOpts;
  quoteOpts?: QuoteOpts;
  agendaOpts?: AgendaOpts;
  multiColOpts?: MultiColOpts;
  mediaTextOpts?: MediaTextOpts;
  stack2Opts?: Stack2Opts;
};

export const createTemplate = (input: CreateTemplateInput): SlideNode => {
  switch (input.preset) {
    case "slide.empty":
      return slide({
        slideAttrs: input.slideAttrs,
        content: [],
      });
    case "slide.singleCol":
      return slide.singleCol({
        slideAttrs: input.slideAttrs,
        columnAttrs: input.columnAttrs,
        content: input.content ?? [],
      });
    case "slide.twoCol":
      return slide.twoCol({
        slideAttrs: input.slideAttrs,
        leftColumnAttrs: input.leftColumnAttrs,
        rightColumnAttrs: input.rightColumnAttrs,
        left: input.left ?? [],
        right: input.right ?? [],
      });
    case "slide.hero": {
      const opts = input.heroOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#020617" }),
        content: [
          column(
            { justify: "center", align: "center", padding: "lg", fill: true, ...opts.columnAttrs },
            opts.content ?? [
              blocks.heading("Your headline", 1),
              blocks.paragraph("Subhead goes here."),
              blocks.paragraph("Add supporting details here."),
            ]
          ),
        ],
      };
    }
    case "slide.imageCover": {
      const opts = input.imageCoverOpts ?? {};
      const image = opts.image ?? {
        src: "https://placehold.co/1600x900/png",
        size: "fill",
      };
      const overlay = opts.overlay ?? [blocks.heading("Overlay title", 1)];
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#000000" }),
        content: [
          column(
            { fill: true, padding: "none", ...opts.columnAttrs },
            [
              blocks.imageBlock(image),
              ...overlay,
            ]
          ),
        ],
      };
    }
    case "slide.quote": {
      const opts = input.quoteOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: [
          column(
            { justify: "center", align: "center", padding: "lg", gap: "md", fill: true, ...opts.columnAttrs },
            [
              blocks.blockquote(
                opts.quote ?? [
                  blocks.paragraph("Add your quote here."),
                  blocks.paragraph("— Author"),
                ]
              ),
            ]
          ),
        ],
      };
    }
    case "slide.agenda": {
      const opts = input.agendaOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: [
          column(
            { padding: "lg", gap: "lg", ...opts.columnAttrs },
            [
              blocks.heading("Agenda", 1),
              blocks.bulletList(opts.items ?? ["Topic 1", "Topic 2", "Topic 3"]),
            ]
          ),
        ],
      };
    }
    case "slide.grid3": {
      const opts = input.multiColOpts ?? { columns: [] };
      const cols =
        opts.columns.length > 0
          ? opts.columns
          : [
              { content: [blocks.heading("One", 3), blocks.paragraph("Details.")] },
              { content: [blocks.heading("Two", 3), blocks.paragraph("Details.")] },
              { content: [blocks.heading("Three", 3), blocks.paragraph("Details.")] },
            ];
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: cols.map((c) => column({ padding: "md", gap: "sm", fill: true, ...c.attrs }, c.content ?? [])),
      };
    }
    case "slide.grid4": {
      const opts = input.multiColOpts ?? { columns: [] };
      const cols =
        opts.columns.length > 0
          ? opts.columns
          : [
              { content: [blocks.heading("One", 4)] },
              { content: [blocks.heading("Two", 4)] },
              { content: [blocks.heading("Three", 4)] },
              { content: [blocks.heading("Four", 4)] },
            ];
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: cols.map((c) => column({ padding: "md", gap: "sm", fill: true, ...c.attrs }, c.content ?? [])),
      };
    }
    case "slide.oneTwo": {
      const opts = input.mediaTextOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: [
          column({ padding: "md", gap: "sm", width: "33%", ...opts.textColumnAttrs }, opts.text ?? []),
          column({ padding: "md", gap: "sm", fill: true, ...opts.mediaColumnAttrs }, opts.media ?? []),
        ],
      };
    }
    case "slide.twoOne": {
      const opts = input.mediaTextOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: [
          column({ padding: "md", gap: "sm", fill: true, ...opts.mediaColumnAttrs }, opts.media ?? []),
          column({ padding: "md", gap: "sm", width: "33%", ...opts.textColumnAttrs }, opts.text ?? []),
        ],
      };
    }
    case "slide.oneTwoOne": {
      const opts = input.multiColOpts ?? { columns: [] };
      const cols =
        opts.columns.length > 0
          ? opts.columns
          : [
              { content: [blocks.paragraph("Left")] },
              { content: [blocks.paragraph("Center")] },
              { content: [blocks.paragraph("Right")] },
            ];
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: cols.map((c, i) => column({ padding: "md", gap: "sm", width: i === 1 ? "50%" : "25%", ...c.attrs }, c.content ?? [])),
      };
    }
    case "slide.textMedia": {
      const opts = input.mediaTextOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: [
          column({ padding: "lg", gap: "sm", fill: true, ...opts.textColumnAttrs }, opts.text ?? []),
          column({ padding: "lg", gap: "sm", fill: true, backgroundColor: "#f8fafc", ...opts.mediaColumnAttrs }, opts.media ?? []),
        ],
      };
    }
    case "slide.mediaText": {
      const opts = input.mediaTextOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: [
          column({ padding: "lg", gap: "sm", fill: true, backgroundColor: "#f8fafc", ...opts.mediaColumnAttrs }, opts.media ?? []),
          column({ padding: "lg", gap: "sm", fill: true, ...opts.textColumnAttrs }, opts.text ?? []),
        ],
      };
    }
    case "slide.stack2": {
      const opts = input.stack2Opts ?? {};
      const top = opts.topColumns ?? [{ content: [blocks.heading("Title", 1), blocks.paragraph("Subhead")] }];
      const bottom = opts.bottomColumns ?? [
        { content: [blocks.paragraph("Left detail")] },
        { content: [blocks.paragraph("Right detail")] },
      ];
      return {
        type: "slide",
        attrs: defaults.slide({ ...opts.slideAttrs, backgroundColor: opts.slideAttrs?.backgroundColor ?? "#ffffff" }),
        content: [
          ...top.map((c) => column({ padding: "md", gap: "sm", ...c.attrs }, c.content ?? [])),
          ...bottom.map((c) => column({ padding: "md", gap: "sm", ...c.attrs }, c.content ?? [])),
        ],
      };
    }
    default:
      return slide(); // fallback
  }
};

export const listTemplates = (): TemplatePreset[] => [
  "slide.empty",
  "slide.singleCol",
  "slide.twoCol",
  "slide.hero",
  "slide.imageCover",
  "slide.quote",
  "slide.agenda",
  "slide.grid3",
  "slide.grid4",
  "slide.oneTwo",
  "slide.twoOne",
  "slide.oneTwoOne",
  "slide.textMedia",
  "slide.mediaText",
  "slide.stack2",
];

export const templatesV1Context = `
BlockSlides templates API (v1)

Document Hierarchy:
doc → slide+ → block+
Slides contain blocks directly - no mandatory row wrapper.
Adjacent columns automatically form horizontal layouts via CSS.

Presets:
- slide({ content?, slideAttrs? }): slide with direct block content
- slide.singleCol({ content?, slideAttrs?, columnAttrs? }): single column layout
- slide.twoCol({ left?, right?, slideAttrs?, leftColumnAttrs?, rightColumnAttrs? }): two columns side by side
- slide.threeCol/fourCol: three/four columns side by side
- slide.hero({ heroOpts }): centered content on dark background
- slide.imageCover({ imageCoverOpts }): full-bleed image with overlay
- slide.quote({ quoteOpts }): centered blockquote
- slide.agenda({ agendaOpts }): title with bullet list
- slide.grid3/grid4({ multiColOpts }): equal-width column grids
- slide.oneTwo/twoOne({ mediaTextOpts }): asymmetric layouts
- slide.textMedia/mediaText({ mediaTextOpts }): text and media columns
- slide.stack2({ stack2Opts }): stacked column sections

Base Block Attributes (available on ALL blocks):
- align: "left" | "center" | "right" | "stretch" - horizontal alignment
- justify: "start" | "center" | "end" | "space-between" - vertical distribution
- padding: "none" | "sm" | "md" | "lg" - internal spacing (8px/16px/32px)
- margin: "none" | "sm" | "md" | "lg" - external spacing
- gap: "none" | "sm" | "md" | "lg" - space between children
- backgroundColor: CSS color
- backgroundImage: URL
- borderRadius: "none" | "sm" | "md" | "lg" (4px/8px/16px)
- border: CSS border
- fill: boolean - fill available space
- width: CSS width
- height: CSS height

Block Helpers:
- blocks.text(text, marks?)
- blocks.heading(text, level?) - level 1-6
- blocks.paragraph(text?)
- blocks.bulletList([string | Block][])
- blocks.codeBlock(code, language?)
- blocks.horizontalRule()
- blocks.hardBreak()
- blocks.imageBlock({ src, size?, crop?, alt?, caption?, credit? })
  - size: "fill" | "fit" | "natural" - how image fills container
  - crop: "center" | "top" | "bottom" | "left" | "right" | corner positions
- blocks.blockquote(content?)
- blocks.listItem(content?)
- blocks.youtube({ src?, start?, width?, height? })

Agent/tool usage:
- Call createTemplate({ preset: "slide.twoCol", left: [...], right: [...] })
- Wrap returned slides in { type: "doc", content: [/* slides here */] }

Notes:
- Size defaults to 16x9; override via slideAttrs.size
- Use fill: true on columns to distribute space evenly
- Use semantic spacing tokens (sm/md/lg) instead of raw pixel values
`.trim();

export type { Block, SlideNode, TemplatePreset, CreateTemplateInput };
