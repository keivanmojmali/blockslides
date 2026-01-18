import { Node, mergeAttributes, createStyleTag } from "@blockslides/core";
import { Plugin, PluginKey } from "@blockslides/pm/state";

const slideStyles = `
.slide {
  position: relative;
  height: var(--slide-height, 100%);
  min-height: var(--slide-min-height, 250px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--slide-bg);
  border-radius: var(--slide-border-radius);
  box-shadow: var(--slide-shadow);
  margin-bottom: var(--slide-margin-bottom);
}

/* Background helpers (driven by data attributes + inline CSS vars) */
.slide[data-bg-mode="color"] {
  background-color: var(--slide-bg-color, var(--slide-bg));
}

.slide[data-bg-mode="image"],
.slide[data-bg-mode="imageOverlay"] {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.slide[data-bg-mode="imageOverlay"]::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-color: var(--slide-bg-overlay-color, #000);
  opacity: var(--slide-bg-overlay-opacity, 0.35);
}
`;

const getFixedSizeStyles = (scale: number) => `
.slide { --slide-scale: ${scale}; }
.slide[data-size="16x9"] { width: calc(1920px * var(--slide-scale)); height: calc(1080px * var(--slide-scale)); }
.slide[data-size="4x3"] { width: calc(1600px * var(--slide-scale)); height: calc(1200px * var(--slide-scale)); }
.slide[data-size="a4-portrait"] { width: calc(210mm * var(--slide-scale)); height: calc(297mm * var(--slide-scale)); }
.slide[data-size="a4-landscape"] { width: calc(297mm * var(--slide-scale)); height: calc(210mm * var(--slide-scale)); }
.slide[data-size="letter-portrait"] { width: calc(8.5in * var(--slide-scale)); height: calc(11in * var(--slide-scale)); }
.slide[data-size="letter-landscape"] { width: calc(11in * var(--slide-scale)); height: calc(8.5in * var(--slide-scale)); }
.slide[data-size="linkedin-banner"] { width: calc(1584px * var(--slide-scale)); height: calc(396px * var(--slide-scale)); }
`.trim();

const dynamicSizeStyles = `
.slide[data-size="16x9"] { width: 100%; height: auto; aspect-ratio: 16 / 9; }
.slide[data-size="4x3"] { width: 100%; height: auto; aspect-ratio: 4 / 3; }
.slide[data-size="a4-portrait"] { width: 100%; height: auto; aspect-ratio: 210 / 297; }
.slide[data-size="a4-landscape"] { width: 100%; height: auto; aspect-ratio: 297 / 210; }
.slide[data-size="letter-portrait"] { width: 100%; height: auto; aspect-ratio: 8.5 / 11; }
.slide[data-size="letter-landscape"] { width: 100%; height: auto; aspect-ratio: 11 / 8.5; }
.slide[data-size="linkedin-banner"] { width: 100%; height: auto; aspect-ratio: 1584 / 396; }
`.trim();

const printSizeStyles = `
@media print {
  .slide[data-size="a4-portrait"] { width: 210mm; height: 297mm; }
  @page { size: A4 portrait; margin: 0; }
}
@media print {
  .slide[data-size="a4-landscape"] { width: 297mm; height: 210mm; }
  @page { size: A4 landscape; margin: 0; }
}
@media print {
  .slide[data-size="letter-portrait"] { width: 8.5in; height: 11in; }
  @page { size: Letter portrait; margin: 0; }
}
@media print {
  .slide[data-size="letter-landscape"] { width: 11in; height: 8.5in; }
  @page { size: Letter landscape; margin: 0; }
}
`.trim();

const hoverableSelector = [
  '[data-node-type]:not([data-node-type="slide"])',
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "ul",
  "ol",
  "li",
  "pre",
  "figure",
  "table",
].join(", ");

const hoverOutlineStyles = `
.slide[data-hover-outline="on"]
  :where(${hoverableSelector}):hover:not(:has(:hover)) {
  outline: var(--slide-hover-outline-width, 1.5px) solid var(--slide-hover-outline-color, rgba(59, 130, 246, 0.65));
  outline-offset: var(--slide-hover-outline-offset, 4px);
  transition: outline-color 120ms ease, outline-width 120ms ease;
}

/* Cascade: when hovering a container, outline its descendant blocks too */
.slide[data-hover-outline="on"][data-hover-outline-cascade="on"]
  :where(${hoverableSelector}):hover
  :where(${hoverableSelector}) {
  outline: var(--slide-hover-outline-width, 1.5px) solid var(--slide-hover-outline-color, rgba(59, 130, 246, 0.65));
  outline-offset: var(--slide-hover-outline-offset, 4px);
  transition: outline-color 120ms ease, outline-width 120ms ease;
}
`.trim();

export interface SlideOptions {
  /**
   * The HTML attributes for a slide node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
  /**
   * Whether to inject CSS styles
   * @default true
   */
  injectCSS: boolean;
  /**
   * Render mode for sizing
   * - fixed: width/height set from size registry (mm/in/px)
   * - dynamic: width:100% with preserved aspect ratio
   * @default 'fixed'
   */
  renderMode: "fixed" | "dynamic";
  /**
   * Default size applied when attrs.size is absent
   * @default '16x9'
   */
  defaultSize: "16x9" | "4x3" | "a4-portrait" | "a4-landscape" | "letter-portrait" | "letter-landscape" | "linkedin-banner";
  /**
   * Scale factor for fixed-size slides.
   * Only applies when renderMode is 'fixed'.
   * Helpful for shrinking/expanding fixed previews without changing size presets.
   * @default 1
   */
  scale: number;
  /**
   * Inject @media print/@page CSS for paper sizes
   * @default true
   */
  injectPrintCSS: boolean;
  /**
   * Content Security Policy nonce
   */
  injectNonce?: string;
  /**
   * Hover outline highlight for nodes within a slide.
   * - false: disabled (default)
   * - true: enabled with defaults
   * - object: enabled with overrides
   */
  hoverOutline:
    | false
    | true
    | {
        color?: string;
        width?: string;
        offset?: string;
      };
  /**
   * When enabled, hovering a container outlines its descendant blocks too.
   * @default false
   */
  hoverOutlineCascade?: boolean;
}

const SlidePluginKey = new PluginKey("slide");

export const Slide = Node.create<SlideOptions>({
  name: "slide",
  isolating: true,
  content: "row+",

  group: "slide",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      injectCSS: true,
      renderMode: "fixed",
      defaultSize: "16x9",
      scale: 1,
      injectPrintCSS: true,
      injectNonce: undefined,
      hoverOutline: false,
      hoverOutlineCascade: false,
    };
  },

  addAttributes() {
    return {
      size: {
        default: this.options.defaultSize,
        parseHTML: (element) => element.getAttribute("data-size") || this.options.defaultSize,
        renderHTML: (attributes) => {
          if (!attributes.size) {
            return { "data-size": this.options.defaultSize };
          }
          return { "data-size": attributes.size };
        },
      },
      className: {
        default: "",
      },
      id: {
        default: null,
      },
      backgroundMode: {
        default: "none",
      },
      backgroundColor: {
        default: null,
      },
      backgroundImage: {
        default: null,
      },
      backgroundOverlayColor: {
        default: null,
      },
      backgroundOverlayOpacity: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.slide" }];
  },

  renderHTML({ HTMLAttributes }) {
    const merged = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    const {
      backgroundMode,
      backgroundColor,
      backgroundImage,
      backgroundOverlayColor,
      backgroundOverlayOpacity,
      ...rest
    } = merged;

    const styleParts: string[] = [];

    const hoverEnabled = this.options.hoverOutline !== false;
    const hoverConfig =
      this.options.hoverOutline === true ? {} : (this.options.hoverOutline || {});
    const hoverCascade = !!this.options.hoverOutlineCascade;

    if (backgroundColor) {
      styleParts.push(`--slide-bg-color: ${backgroundColor}`);
    }

    if (backgroundImage) {
      const escaped = String(backgroundImage).replace(/"/g, '\\"');
      styleParts.push(`background-image: url("${escaped}")`);
    }

    if (backgroundOverlayColor) {
      styleParts.push(`--slide-bg-overlay-color: ${backgroundOverlayColor}`);
    }

    if (backgroundOverlayOpacity != null) {
      styleParts.push(`--slide-bg-overlay-opacity: ${backgroundOverlayOpacity}`);
    }

    if (hoverEnabled) {
      const {
        color = "rgba(59, 130, 246, 0.65)",
        width = "1.5px",
        offset = "4px",
      } = hoverConfig;
      styleParts.push(`--slide-hover-outline-color: ${color}`);
      styleParts.push(`--slide-hover-outline-width: ${width}`);
      styleParts.push(`--slide-hover-outline-offset: ${offset}`);
    }

    const style = [rest.style, styleParts.join("; ")].filter(Boolean).join("; ");

    const className = [rest.class, rest.className, "slide"].filter(Boolean).join(" ");

    delete (rest as any).className;
    delete (rest as any).class;

    return [
      "div",
      {
        ...rest,
        class: className || "slide",
        "data-node-type": "slide",
        "data-bg-mode": backgroundMode || "none",
        "data-hover-outline": hoverEnabled ? "on" : undefined,
        "data-hover-outline-cascade": hoverCascade ? "on" : undefined,
        style: style || undefined,
      },
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: SlidePluginKey,
        state: {
          init: () => {
            // Warn if scale is set but renderMode is not 'fixed'
            if (this.options.scale !== 1 && this.options.renderMode !== "fixed") {
              console.warn(
                `[Slide] The 'scale' option only applies when renderMode is 'fixed'. ` +
                `Current renderMode is '${this.options.renderMode}', so the scale value of ${this.options.scale} will be ignored.`
              );
            }

            if (this.options.injectCSS && typeof document !== "undefined") {
              createStyleTag(slideStyles, this.options.injectNonce, "slide");
              const sizingCss =
                this.options.renderMode === "dynamic"
                  ? dynamicSizeStyles
                  : getFixedSizeStyles(this.options.scale);
              if (sizingCss) {
                createStyleTag(sizingCss, this.options.injectNonce, "slide-sizes");
              }
              if (this.options.injectPrintCSS) {
                const printCss = printSizeStyles;
                if (printCss) {
                  createStyleTag(printCss, this.options.injectNonce, "slide-print");
                }
              }
              if (this.options.hoverOutline !== false) {
                createStyleTag(
                  hoverOutlineStyles,
                  this.options.injectNonce,
                  "slide-hover-outline"
                );
              }
            }
            return {};
          },
          apply: (_tr, pluginState: Record<string, never>) => pluginState,
        },
      }),
    ];
  },
});
