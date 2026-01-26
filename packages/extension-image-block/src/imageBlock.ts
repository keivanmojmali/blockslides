import { mergeAttributes, Node, createStyleTag } from "@blockslides/core";
import { Plugin, PluginKey } from "@blockslides/pm/state";

type CommandHelpers = {
  insertContent: (value: unknown, options?: unknown) => boolean;
  updateAttributes: (
    typeOrName: unknown,
    attributes: Record<string, unknown>,
  ) => boolean;
};

const baseStyles = `
  .image-block {
    --image-block-inline-width: auto;
    --image-block-block-size: auto;
    --image-block-object-fit: cover;
    --image-block-object-position: 50% 50%;
    --image-block-background-repeat: no-repeat;
    --image-block-background-size: cover;
    --image-block-background-mode: image;
    --image-block-caption-color: inherit;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
    width: var(--image-block-inline-width);
    height: var(--image-block-block-size);
    background-color: var(--image-block-background-color, transparent);
  }

  .image-block[data-align="left"] { align-self: flex-start; }
  .image-block[data-align="center"] { align-self: center; }
  .image-block[data-align="right"] { align-self: flex-end; }
  .image-block[data-align="stretch"] { align-self: stretch; }

  .image-block[data-full-bleed="true"] {
    border-radius: 0;
    width: 100%;
  }

  /* ═══════════════════════════════════════════════════════════════ */
  /* NEW SIMPLIFIED SIZE MODES                                        */
  /* ═══════════════════════════════════════════════════════════════ */
  
  /* fill: Cover entire container */
  .image-block[data-size="fill"] {
    width: 100%;
    height: 100%;
    --image-block-inline-width: 100%;
    --image-block-block-size: 100%;
    --image-block-object-fit: cover;
  }
  
  /* fit: Fit inside container with letterboxing */
  .image-block[data-size="fit"] {
    width: 100%;
    height: 100%;
    --image-block-inline-width: 100%;
    --image-block-block-size: 100%;
    --image-block-object-fit: contain;
  }
  
  /* natural: Use image's natural dimensions */
  .image-block[data-size="natural"] {
    width: auto;
    height: auto;
    --image-block-inline-width: auto;
    --image-block-block-size: auto;
    --image-block-object-fit: none;
  }

  /* ═══════════════════════════════════════════════════════════════ */
  /* NEW SIMPLIFIED CROP POSITIONS                                    */
  /* ═══════════════════════════════════════════════════════════════ */
  
  .image-block[data-crop="center"] { --image-block-object-position: center; }
  .image-block[data-crop="top"] { --image-block-object-position: top center; }
  .image-block[data-crop="bottom"] { --image-block-object-position: bottom center; }
  .image-block[data-crop="left"] { --image-block-object-position: center left; }
  .image-block[data-crop="right"] { --image-block-object-position: center right; }
  .image-block[data-crop="top-left"] { --image-block-object-position: top left; }
  .image-block[data-crop="top-right"] { --image-block-object-position: top right; }
  .image-block[data-crop="bottom-left"] { --image-block-object-position: bottom left; }
  .image-block[data-crop="bottom-right"] { --image-block-object-position: bottom right; }

  .image-block__figure {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    height: 100%;
  }

  .image-block__media {
    position: relative;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .image-block__image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: var(--image-block-object-fit);
    object-position: var(--image-block-object-position);
    border-radius: inherit;
    user-select: none;
    pointer-events: none;
  }

  .image-block[data-background-mode="pattern"] .image-block__media {
    background-image: var(--image-block-src);
    background-repeat: var(--image-block-background-repeat);
    background-size: var(--image-block-background-size);
  }

  .image-block[data-background-mode="pattern"] .image-block__image {
    display: none;
  }

  .image-block__caption {
    color: var(--image-block-caption-color);
    font-size: 0.875rem;
    line-height: 1.3;
  }

  .image-block__credit {
    opacity: 0.7;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
`;

/**
 * @deprecated Legacy layout definitions - use size/crop instead
 */
export interface ImageBlockLayoutDefinition {
  label?: string;
  className?: string;
  vars?: Record<string, string>;
  css?: string;
}

/**
 * @deprecated Legacy layout definitions - kept for backwards compatibility
 */
const DEFAULT_LAYOUTS: Record<string, ImageBlockLayoutDefinition> = {
  cover: {
    label: "Cover",
    vars: {
      "--image-block-object-fit": "cover",
      "--image-block-block-size": "100%",
    },
  },
  contain: {
    label: "Contain",
    vars: {
      "--image-block-object-fit": "contain",
    },
  },
  fill: {
    label: "Fill",
    vars: {
      "--image-block-object-fit": "fill",
    },
  },
};

const ImageBlockPluginKey = new PluginKey("image-block");

export type ImageBlockAlignment = "left" | "center" | "right" | "stretch";

/**
 * Simplified size modes for images
 * - fill: Cover entire container (width:100%, height:100%, object-fit:cover)
 * - fit: Fit inside container (object-fit:contain)
 * - natural: Use image's natural dimensions
 */
export type ImageBlockSize = "fill" | "fit" | "natural";

/**
 * Simplified crop/focus positions
 */
export type ImageBlockCrop = 
  | "center" 
  | "top" 
  | "bottom" 
  | "left" 
  | "right" 
  | "top-left" 
  | "top-right" 
  | "bottom-left" 
  | "bottom-right";

export interface ImageBlockMetadata {
  alt?: string;
  caption?: string;
  credit?: string;
}

export interface ImageBlockDimensions {
  width?: string | number | null;
  height?: string | number | null;
}

export interface ImageBlockFocalPoint {
  x: number;
  y: number;
}

export interface ImageBlockAttributes extends ImageBlockMetadata {
  src: string;
  assetId?: string | null;
  /** @deprecated Use `size` instead */
  layout?: string | null;
  /** Use BlockAttributes `align` instead for block alignment */
  align?: ImageBlockAlignment | null;
  width?: string | null;
  height?: string | null;
  /** @deprecated Use `size: "fill"` instead */
  fullBleed?: boolean;
  /** @deprecated Use `crop` instead */
  focalX?: number | null;
  /** @deprecated Use `crop` instead */
  focalY?: number | null;
  /** Simplified size mode: fill, fit, or natural */
  size?: ImageBlockSize | null;
  /** Simplified crop/focus position */
  crop?: ImageBlockCrop | null;
}

export interface InsertImageBlockOptions
  extends Partial<Omit<ImageBlockAttributes, "focalX" | "focalY">> {
  src: string;
  focalPoint?: ImageBlockFocalPoint;
}

export interface ReplaceImageBlockOptions
  extends Partial<Omit<ImageBlockAttributes, "layout" | "align" | "fullBleed" | "focalX" | "focalY">> {
  focalPoint?: ImageBlockFocalPoint | null;
}

export interface ImageBlockOptions {
  HTMLAttributes: Record<string, any>;
  /** @deprecated Use size/crop attributes instead */
  defaultLayout: string;
  /** @deprecated Use size/crop attributes instead */
  layouts: Record<string, ImageBlockLayoutDefinition>;
  injectCSS: boolean;
  injectNonce?: string;
}

declare module "@blockslides/core" {
  interface Commands<ReturnType> {
    imageBlock: {
      insertImageBlock: (options: InsertImageBlockOptions) => ReturnType;
      replaceImageBlock: (options: ReplaceImageBlockOptions) => ReturnType;
      /** @deprecated Use setImageBlockSize instead */
      setImageBlockLayout: (layout: string) => ReturnType;
      setImageBlockAlignment: (align: ImageBlockAlignment) => ReturnType;
      setImageBlockDimensions: (dimensions: ImageBlockDimensions) => ReturnType;
      /** @deprecated Use setImageBlockSize("fill") instead */
      setImageBlockFullBleed: (fullBleed?: boolean) => ReturnType;
      setImageBlockMetadata: (metadata: Partial<ImageBlockMetadata>) => ReturnType;
      /** @deprecated Use setImageBlockCrop instead */
      setImageBlockFocalPoint: (point: ImageBlockFocalPoint | null) => ReturnType;
      /** Set the size mode: fill, fit, or natural */
      setImageBlockSize: (size: ImageBlockSize) => ReturnType;
      /** Set the crop/focus position */
      setImageBlockCrop: (crop: ImageBlockCrop) => ReturnType;
    };
  }
}

const clampFocusPercentage = (value?: number | null): number | null => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }
  return Math.min(100, Math.max(0, value));
};

const normalizeDimension = (value?: string | number | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
};

/**
 * @deprecated Legacy layout resolution - kept for backwards compatibility
 */
const resolveLayouts = (options: ImageBlockOptions) => ({
  ...DEFAULT_LAYOUTS,
  ...(options.layouts || {}),
});

/**
 * @deprecated Legacy layout styles - kept for backwards compatibility
 */
const buildLayoutStyles = (layouts: Record<string, ImageBlockLayoutDefinition>) =>
  Object.entries(layouts)
    .map(([key, layout]) => {
      const selector = `.image-block[data-layout="${key}"]`;
      const vars =
        layout.vars && Object.keys(layout.vars).length > 0
          ? `${selector} { ${Object.entries(layout.vars)
              .map(([cssVar, value]) => `${cssVar}: ${value};`)
              .join(" ")} }`
          : "";
      return [vars, layout.css ?? ""].filter(Boolean).join("\n");
    })
    .filter(Boolean)
    .join("\n");

export const ImageBlock = Node.create<ImageBlockOptions>({
  name: "imageBlock",

  group: "block",

  atom: true,

  draggable: true,

  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      defaultLayout: "cover",
      layouts: DEFAULT_LAYOUTS,
      injectCSS: true,
      injectNonce: undefined,
    };
  },

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-src") || "",
      },
      assetId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-asset-id"),
      },
      alt: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-alt") || "",
      },
      caption: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-caption") || "",
      },
      credit: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-credit") || "",
      },
      layout: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-layout"),
      },
      align: {
        default: "center",
        parseHTML: (element) =>
          (element.getAttribute("data-align") as ImageBlockAlignment | null) || "center",
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-width"),
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-height"),
      },
      fullBleed: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-full-bleed") === "true",
        renderHTML: (attributes) => {
          if (!attributes.fullBleed) {
            return {};
          }
          return { "data-full-bleed": "true" };
        },
      },
      focalX: {
        default: null,
        parseHTML: (element) => {
          const raw = element.getAttribute("data-focal-x");
          return raw ? Number(raw) : null;
        },
      },
      focalY: {
        default: null,
        parseHTML: (element) => {
          const raw = element.getAttribute("data-focal-y");
          return raw ? Number(raw) : null;
        },
      },
      // New simplified attributes
      size: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-size") as ImageBlockSize | null,
        renderHTML: (attributes) => {
          if (!attributes.size) return {};
          return { "data-size": attributes.size };
        },
      },
      crop: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-crop") as ImageBlockCrop | null,
        renderHTML: (attributes) => {
          if (!attributes.crop) return {};
          return { "data-crop": attributes.crop };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.image-block",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const {
      src,
      alt,
      caption,
      credit,
      size,
      crop,
      assetId,
      // Legacy attributes (deprecated, kept for backwards compatibility)
      layout,
      align,
      width,
      height,
      fullBleed,
      focalX,
      focalY,
    } = node.attrs as ImageBlockAttributes;

    const inlineStyles: string[] = [];

    // Use explicit width/height if provided
    const normalizedWidth = normalizeDimension(width ?? null);
    const normalizedHeight = normalizeDimension(height ?? null);

    if (normalizedWidth) {
      inlineStyles.push(`--image-block-inline-width: ${normalizedWidth}`);
    }

    if (normalizedHeight) {
      inlineStyles.push(`--image-block-block-size: ${normalizedHeight}`);
    }

    if (src) {
      const escapedSrc = src.replace(/"/g, '\\"');
      inlineStyles.push(`--image-block-src: url("${escapedSrc}")`);
    }

    // Determine size mode (prefer new size attribute, fallback to legacy)
    let effectiveSize = size;
    if (!effectiveSize) {
      // Backwards compatibility: convert old attributes to new size
      if (fullBleed) {
        effectiveSize = 'fill';
      } else if (layout === 'cover') {
        effectiveSize = 'fill';
      } else if (layout === 'contain') {
        effectiveSize = 'fit';
      }
    }

    // Determine crop/position (prefer new crop attribute, fallback to legacy focalX/Y)
    let effectiveCrop = crop;
    if (!effectiveCrop && (focalX !== null || focalY !== null)) {
      // Backwards compatibility: use focalX/Y if no crop specified
      const clampedFocusX = clampFocusPercentage(focalX ?? null);
      const clampedFocusY = clampFocusPercentage(focalY ?? null);
      if (clampedFocusX !== null || clampedFocusY !== null) {
        inlineStyles.push(
          `--image-block-object-position: ${clampedFocusX ?? 50}% ${clampedFocusY ?? 50}%`
        );
      }
    }

    const attributes = mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes,
      {
        class: ["image-block", HTMLAttributes?.class].filter(Boolean).join(" "),
        "data-node-type": "image-block",
        "data-src": src,
        "data-asset-id": assetId ?? undefined,
        "data-alt": alt || undefined,
        "data-caption": caption || undefined,
        "data-credit": credit || undefined,
        "data-size": effectiveSize ?? undefined,
        "data-crop": effectiveCrop ?? undefined,
        // Legacy attributes for backwards compat
        "data-layout": layout ?? undefined,
        "data-align": align ?? undefined,
        "data-full-bleed": fullBleed ? "true" : undefined,
        style: [HTMLAttributes?.style, inlineStyles.join("; ")].filter(Boolean).join("; "),
      }
    );

    const children: any[] = [
      [
        "div",
        { class: "image-block__media" },
        [
          "img",
          mergeAttributes(
            {
              class: "image-block__image",
              src,
              alt,
              draggable: "false",
            },
            alt ? {} : { "aria-hidden": "true" }
          ),
        ],
      ],
    ];

    if (caption || credit) {
      children.push([
        "figcaption",
        { class: "image-block__caption" },
        caption || "",
        credit ? ["span", { class: "image-block__credit" }, credit] : null,
      ]);
    }

    return [
      "div",
      attributes,
      ["figure", { class: "image-block__figure", draggable: "false" }, ...children],
    ];
  },

  addCommands() {
    return {
      insertImageBlock:
        (options: InsertImageBlockOptions) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          const { focalPoint, layout, align, ...rest } = options;
          return cmds.insertContent({
            type: this.name,
            attrs: {
              layout: layout ?? this.options.defaultLayout,
              align: align ?? "center",
              focalX: clampFocusPercentage(focalPoint?.x ?? null),
              focalY: clampFocusPercentage(focalPoint?.y ?? null),
              ...rest,
            },
          });
        },
      replaceImageBlock:
        (options: ReplaceImageBlockOptions) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          const { focalPoint, ...attrs } = options;
          return cmds.updateAttributes(this.name, {
            ...attrs,
            focalX: clampFocusPercentage(focalPoint?.x ?? null),
            focalY: clampFocusPercentage(focalPoint?.y ?? null),
          });
        },
      setImageBlockLayout:
        (layout: string) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          return cmds.updateAttributes(this.name, { layout });
        },
      setImageBlockAlignment:
        (align: ImageBlockAlignment) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          return cmds.updateAttributes(this.name, { align });
        },
      setImageBlockDimensions:
        ({ width, height }: ImageBlockDimensions) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          return cmds.updateAttributes(this.name, {
            width: normalizeDimension(width ?? null),
            height: normalizeDimension(height ?? null),
          });
        },
      setImageBlockFullBleed:
        (fullBleed = true) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          return cmds.updateAttributes(this.name, { fullBleed });
        },
      setImageBlockMetadata:
        (metadata: Partial<ImageBlockMetadata>) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          return cmds.updateAttributes(this.name, metadata);
        },
      setImageBlockFocalPoint:
        (point: ImageBlockFocalPoint | null) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          return cmds.updateAttributes(this.name, {
            focalX: point ? clampFocusPercentage(point.x) : null,
            focalY: point ? clampFocusPercentage(point.y) : null,
          });
        },
      setImageBlockSize:
        (size: ImageBlockSize) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          return cmds.updateAttributes(this.name, { size });
        },
      setImageBlockCrop:
        (crop: ImageBlockCrop) =>
        ({ commands }) => {
          const cmds = commands as unknown as CommandHelpers;
          return cmds.updateAttributes(this.name, { crop });
        },
    };
  },

  addProseMirrorPlugins() {
    if (!this.options.injectCSS || typeof document === "undefined") {
      return [];
    }

    const resolvedLayouts = resolveLayouts(this.options);
    const layoutStyles = buildLayoutStyles(resolvedLayouts);

    return [
      new Plugin({
        key: ImageBlockPluginKey,
        state: {
          init: () => {
            createStyleTag(baseStyles, this.options.injectNonce, "image-block-base");
            if (layoutStyles) {
              createStyleTag(layoutStyles, this.options.injectNonce, "image-block-layouts");
            }
            return {};
          },
          apply: (_tr, pluginState: Record<string, never>) => pluginState,
        },
      }),
    ];
  },
});