import { Node, mergeAttributes, createStyleTag } from "@blockslides/core";
import { Plugin, PluginKey } from "@blockslides/pm/state";

const slideStyles = `
.slide {
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
`;

const fixedSizeStyles = `
.slide[data-size="16x9"] { width: 1920px; height: 1080px; }
.slide[data-size="4x3"] { width: 1600px; height: 1200px; }
.slide[data-size="a4-portrait"] { width: 210mm; height: 297mm; }
.slide[data-size="a4-landscape"] { width: 297mm; height: 210mm; }
.slide[data-size="letter-portrait"] { width: 8.5in; height: 11in; }
.slide[data-size="letter-landscape"] { width: 11in; height: 8.5in; }
.slide[data-size="linkedin-banner"] { width: 1584px; height: 396px; }
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
   * Inject @media print/@page CSS for paper sizes
   * @default true
   */
  injectPrintCSS: boolean;
  /**
   * Content Security Policy nonce
   */
  injectNonce?: string;
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
      injectPrintCSS: true,
      injectNonce: undefined,
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
    };
  },

  parseHTML() {
    return [{ tag: "div.slide" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "slide",
        "data-node-type": "slide",
      }),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: SlidePluginKey,
        state: {
          init: () => {
            if (this.options.injectCSS && typeof document !== "undefined") {
              createStyleTag(slideStyles, this.options.injectNonce, "slide");
              const sizingCss =
                this.options.renderMode === "dynamic" ? dynamicSizeStyles : fixedSizeStyles;
              if (sizingCss) {
                createStyleTag(sizingCss, this.options.injectNonce, "slide-sizes");
              }
              if (this.options.injectPrintCSS) {
                const printCss = printSizeStyles;
                if (printCss) {
                  createStyleTag(printCss, this.options.injectNonce, "slide-print");
                }
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
