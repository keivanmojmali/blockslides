// TODO: Add additional block helpers (tables, marks) to cover all extensions.
// TODO: Add more slide presets (hero, imageCover, agenda) once shapes are finalized.
// TODO: Add server-side validation helper that checks slides against schemasV1.
// TODO: Add tests/examples that demonstrate agent/tool usage.

import type { JSONContent } from "@blockslides/core";
import type {
  SizeKey,
  SlideAttrs,
  RowAttrs,
  ColumnAttrs,
  ImageBlockAttrs,
} from "../../types/v1";

type Block = JSONContent;
type SlideNode = JSONContent; // slide -> row -> column -> blocks
type TextMark = { type: string; attrs?: Record<string, any> };

const defaults = {
  slide: (attrs?: Partial<SlideAttrs>): SlideAttrs => ({
    id: attrs?.id ?? "slide-1",
    size: attrs?.size ?? ("16x9" as SizeKey),
    className: attrs?.className ?? "",
  }),
  row: (attrs?: Partial<RowAttrs>): RowAttrs => ({
    layout: attrs?.layout ?? "1",
    className: attrs?.className ?? "",
  }),
  column: (attrs?: Partial<ColumnAttrs>): ColumnAttrs => ({
    className: attrs?.className ?? "",
    contentMode: attrs?.contentMode ?? "default",
    verticalAlign: attrs?.verticalAlign,
    horizontalAlign: attrs?.horizontalAlign,
    padding: attrs?.padding,
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
  rowAttrs?: Partial<RowAttrs>;
  columnAttrs?: Partial<ColumnAttrs>;
  content?: Block[];
};

type TwoColOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  rowAttrs?: Partial<RowAttrs>;
  leftColumnAttrs?: Partial<ColumnAttrs>;
  rightColumnAttrs?: Partial<ColumnAttrs>;
  left?: Block[];
  right?: Block[];
};

export const slide = Object.assign(
  (opts: {
    slideAttrs?: Partial<SlideAttrs>;
    rowAttrs?: Partial<RowAttrs>;
    columnAttrs?: Partial<ColumnAttrs>;
  } = {}): SlideNode => ({
    type: "slide",
    attrs: defaults.slide(opts.slideAttrs),
    content: [
      {
        type: "row",
        attrs: defaults.row(opts.rowAttrs),
        content: [
          {
            type: "column",
            attrs: defaults.column(opts.columnAttrs),
            content: [],
          },
        ],
      },
    ],
  }),
  {
    singleCol: (opts: SingleColOpts = {}): SlideNode => ({
      type: "slide",
      attrs: defaults.slide(opts.slideAttrs),
      content: [
        {
          type: "row",
          attrs: defaults.row(opts.rowAttrs),
          content: [
            {
              type: "column",
              attrs: defaults.column(opts.columnAttrs),
              content: opts.content ?? [],
            },
          ],
        },
      ],
    }),

    twoCol: (opts: TwoColOpts = {}): SlideNode => ({
      type: "slide",
      attrs: defaults.slide(opts.slideAttrs),
      content: [
        {
          type: "row",
          attrs: defaults.row({
            layout: opts.rowAttrs?.layout ?? "1-1",
            ...opts.rowAttrs,
          }),
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
        },
      ],
    }),
  }
);

// Slide layout presets beyond the base helpers
type HeroOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  rowAttrs?: Partial<RowAttrs>;
  columnAttrs?: Partial<ColumnAttrs>;
  content?: Block[];
};

type ImageCoverOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  image?: ImageBlockAttrs;
  overlay?: Block[];
  columnAttrs?: Partial<ColumnAttrs>;
  rowAttrs?: Partial<RowAttrs>;
};

type QuoteOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  rowAttrs?: Partial<RowAttrs>;
  columnAttrs?: Partial<ColumnAttrs>;
  quote?: Block[];
};

type AgendaOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  rowAttrs?: Partial<RowAttrs>;
  columnAttrs?: Partial<ColumnAttrs>;
  items?: (string | Block)[];
};

type MultiColOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  rowAttrs?: Partial<RowAttrs>;
  columns: {
    content?: Block[];
    attrs?: Partial<ColumnAttrs>;
  }[];
};

type MediaTextOpts = {
  slideAttrs?: Partial<SlideAttrs>;
  rowAttrs?: Partial<RowAttrs>;
  media?: Block[];
  text?: Block[];
  mediaColumnAttrs?: Partial<ColumnAttrs>;
  textColumnAttrs?: Partial<ColumnAttrs>;
};

type Stack2Opts = {
  slideAttrs?: Partial<SlideAttrs>;
  topRow?: {
    rowAttrs?: Partial<RowAttrs>;
    columns: { content?: Block[]; attrs?: Partial<ColumnAttrs> }[];
  };
  bottomRow?: {
    rowAttrs?: Partial<RowAttrs>;
    columns: { content?: Block[]; attrs?: Partial<ColumnAttrs> }[];
  };
};

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
  rowAttrs?: Partial<RowAttrs>;
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

const column = (attrs: Partial<ColumnAttrs> | undefined, content: Block[] = []): Block => ({
  type: "column",
  attrs: defaults.column(attrs),
  content,
});

const row = (layout: RowAttrs["layout"], content: Block[], attrs?: Partial<RowAttrs>): Block => ({
  type: "row",
  attrs: defaults.row({ layout, ...attrs }),
  content,
});

export const createTemplate = (input: CreateTemplateInput): SlideNode => {
  switch (input.preset) {
    case "slide.empty":
      return slide({
        slideAttrs: input.slideAttrs,
        rowAttrs: input.rowAttrs,
        columnAttrs: input.columnAttrs,
      });
    case "slide.singleCol":
      return slide.singleCol({
        slideAttrs: input.slideAttrs,
        rowAttrs: input.rowAttrs,
        columnAttrs: input.columnAttrs,
        content: input.content ?? [],
      });
    case "slide.twoCol":
      return slide.twoCol({
        slideAttrs: input.slideAttrs,
        rowAttrs: input.rowAttrs,
        leftColumnAttrs: input.leftColumnAttrs,
        rightColumnAttrs: input.rightColumnAttrs,
        left: input.left ?? [],
        right: input.right ?? [],
      });
    case "slide.hero": {
      const opts = input.heroOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ className: "bg-slate-950 text-white", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1",
            [
              column(
                opts.columnAttrs ?? { className: "max-w-4xl gap-6 p-12" },
                opts.content ?? [
                  blocks.heading("Your headline", 1),
                  blocks.paragraph("Subhead goes here."),
                  blocks.paragraph("Add supporting details here."),
                ]
              ),
            ],
            { className: "min-h-[720px] items-center justify-center p-12", ...opts.rowAttrs }
          ),
        ],
      };
    }
    case "slide.imageCover": {
      const opts = input.imageCoverOpts ?? {};
      const image = opts.image ?? {
        src: "https://placehold.co/1600x900/png",
        layout: "cover",
        fullBleed: true,
        align: "center",
      };
      const overlay = opts.overlay ?? [blocks.heading("Overlay title", 1)];
      return {
        type: "slide",
        attrs: defaults.slide({ className: "bg-black text-white", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1",
            [
              {
                type: "column",
                attrs: defaults.column({ className: "relative w-full h-full", ...opts.columnAttrs }),
                content: [
                  blocks.imageBlock(image),
                  ...overlay.map((node) => ({
                    ...node,
                    attrs: {
                      ...(node as any).attrs,
                      className: `${((node as any).attrs?.className ?? "")} absolute bottom-12 left-12 drop-shadow-lg`.trim(),
                    },
                  })),
                ],
              },
            ],
            { className: "min-h-[720px]", ...opts.rowAttrs }
          ),
        ],
      };
    }
    case "slide.quote": {
      const opts = input.quoteOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1",
            [
              column(
                opts.columnAttrs ?? { className: "max-w-3xl mx-auto gap-4 p-12" },
                [
                  blocks.blockquote(
                    opts.quote ?? [
                      blocks.paragraph("“Add your quote here.”"),
                      blocks.paragraph("— Author"),
                    ]
                  ),
                ]
              ),
            ],
            { className: "min-h-[640px] items-center justify-center", ...opts.rowAttrs }
          ),
        ],
      };
    }
    case "slide.agenda": {
      const opts = input.agendaOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1",
            [
              column(
                opts.columnAttrs ?? { className: "p-12 gap-6" },
                [
                  blocks.heading("Agenda", 1),
                  blocks.bulletList(opts.items ?? ["Topic 1", "Topic 2", "Topic 3"]),
                ]
              ),
            ],
            { className: "min-h-[640px]", ...opts.rowAttrs }
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
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1-1-1",
            cols.map((c) => column(c.attrs, c.content ?? [])),
            { className: "p-8 gap-4", ...opts.rowAttrs }
          ),
        ],
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
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1-1-1-1",
            cols.map((c) => column(c.attrs, c.content ?? [])),
            { className: "p-8 gap-4", ...opts.rowAttrs }
          ),
        ],
      };
    }
    case "slide.oneTwo": {
      const opts = input.mediaTextOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1-2",
            [
              column(opts.textColumnAttrs ?? { className: "p-8 gap-4" }, opts.text ?? []),
              column(opts.mediaColumnAttrs ?? { className: "p-8 gap-4" }, opts.media ?? []),
            ],
            { className: "min-h-[640px]", ...opts.rowAttrs }
          ),
        ],
      };
    }
    case "slide.twoOne": {
      const opts = input.mediaTextOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "2-1",
            [
              column(opts.mediaColumnAttrs ?? { className: "p-8 gap-4" }, opts.media ?? []),
              column(opts.textColumnAttrs ?? { className: "p-8 gap-4" }, opts.text ?? []),
            ],
            { className: "min-h-[640px]", ...opts.rowAttrs }
          ),
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
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1-2-1",
            cols.map((c) => column(c.attrs, c.content ?? [])),
            { className: "p-8 gap-4", ...opts.rowAttrs }
          ),
        ],
      };
    }
    case "slide.textMedia": {
      const opts = input.mediaTextOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1-1",
            [
              column(opts.textColumnAttrs ?? { className: "p-10 gap-4" }, opts.text ?? []),
              column(opts.mediaColumnAttrs ?? { className: "p-10 gap-4 bg-slate-50" }, opts.media ?? []),
            ],
            { className: "min-h-[640px]", ...opts.rowAttrs }
          ),
        ],
      };
    }
    case "slide.mediaText": {
      const opts = input.mediaTextOpts ?? {};
      return {
        type: "slide",
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            opts.rowAttrs?.layout ?? "1-1",
            [
              column(opts.mediaColumnAttrs ?? { className: "p-10 gap-4 bg-slate-50" }, opts.media ?? []),
              column(opts.textColumnAttrs ?? { className: "p-10 gap-4" }, opts.text ?? []),
            ],
            { className: "min-h-[640px]", ...opts.rowAttrs }
          ),
        ],
      };
    }
    case "slide.stack2": {
      const opts = input.stack2Opts ?? {};
      const top = opts.topRow ?? {
        rowAttrs: { layout: "1" },
        columns: [{ content: [blocks.heading("Title", 1), blocks.paragraph("Subhead")] }],
      };
      const bottom = opts.bottomRow ?? {
        rowAttrs: { layout: "1-1" },
        columns: [
          { content: [blocks.paragraph("Left detail")] },
          { content: [blocks.paragraph("Right detail")] },
        ],
      };
      return {
        type: "slide",
        attrs: defaults.slide({ className: "bg-white text-slate-900", ...opts.slideAttrs }),
        content: [
          row(
            top.rowAttrs?.layout ?? "1",
            top.columns.map((c) => column(c.attrs, c.content ?? [])),
            { className: "p-8 gap-4", ...top.rowAttrs }
          ),
          row(
            bottom.rowAttrs?.layout ?? "1-1",
            bottom.columns.map((c) => column(c.attrs, c.content ?? [])),
            { className: "p-8 gap-4", ...bottom.rowAttrs }
          ),
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

Presets:
- slide.empty(): slide with one empty column.
- slide.singleCol({ content?, slideAttrs?, rowAttrs?, columnAttrs? })
- slide.twoCol({ left?, right?, slideAttrs?, rowAttrs?, leftColumnAttrs?, rightColumnAttrs? })
- slide.hero({ content?, slideAttrs?, rowAttrs?, columnAttrs? })
- slide.imageCover({ image?, overlay?, slideAttrs?, rowAttrs?, columnAttrs? })
- slide.quote({ quote?, slideAttrs?, rowAttrs?, columnAttrs? })
- slide.agenda({ items?, slideAttrs?, rowAttrs?, columnAttrs? })
- slide.grid3/grid4({ columns?, slideAttrs?, rowAttrs? })
- slide.oneTwo/twoOne/oneTwoOne({ columns?, slideAttrs?, rowAttrs? })
- slide.textMedia/mediaText({ text?, media?, slideAttrs?, rowAttrs? })
- slide.stack2({ topRow?, bottomRow?, slideAttrs? })

Blocks:
- blocks.text(text, marks?)
- blocks.heading(text, level?)
- blocks.paragraph(text?)
- blocks.bulletList([string | Block][])
- blocks.codeBlock(code, language?)
- blocks.horizontalRule()
- blocks.hardBreak()
- blocks.imageBlock({ src, alt?, layout?, fullBleed?, align?, ...ImageBlockAttrs })
- blocks.blockquote(content?)
- blocks.listItem(content?)
- blocks.image({ src, alt?, title?, width?, height? })
- blocks.youtube({ src?, start?, width?, height? })

Agent/tool usage:
- Call createTemplate({ preset: "slide.twoCol", left: [blocks.paragraph("Left")], right: [blocks.imageBlock({ src })] })
- Wrap returned slides in { type: "doc", content: [/* slides here */] } before sending to the editor.

Notes:
- Size defaults to 16x9; override via slideAttrs.size.
- Layout defaults: singleCol uses "1"; twoCol uses "1-1" unless rowAttrs.layout overrides.
`.trim();

export type { Block, SlideNode, TemplatePreset, CreateTemplateInput };
