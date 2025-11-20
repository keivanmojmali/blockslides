import { Extension } from "@blockslides/core";

// Import all extensions
import type { BlockquoteOptions } from "@blockslides/extension-blockquote";
import { Blockquote } from "@blockslides/extension-blockquote";
import type { BoldOptions } from "@blockslides/extension-bold";
import { Bold } from "@blockslides/extension-bold";
import type { CodeOptions } from "@blockslides/extension-code";
import { Code } from "@blockslides/extension-code";
import type { CodeBlockOptions } from "@blockslides/extension-code-block";
import { CodeBlock } from "@blockslides/extension-code-block";
import type { ColorOptions } from "@blockslides/extension-color";
import { Color } from "@blockslides/extension-color";
import { Document } from "@blockslides/extension-document";
import AssetDocument from "@blockslides/extension-asset-document";
import { Details } from "@blockslides/extension-details";
import { DetailsContent } from "@blockslides/extension-details";
import { DetailsSummary } from "@blockslides/extension-details";
import type { FileHandlerOptions } from "@blockslides/extension-file-handler";
import { FileHandler } from "@blockslides/extension-file-handler";
import type { FontFamilyOptions } from "@blockslides/extension-font-family";
import { FontFamily } from "@blockslides/extension-font-family";
import type { HardBreakOptions } from "@blockslides/extension-hard-break";
import { HardBreak } from "@blockslides/extension-hard-break";
import type { HeadingOptions } from "@blockslides/extension-heading";
import { Heading } from "@blockslides/extension-heading";
import type { HighlightOptions } from "@blockslides/extension-highlight";
import { Highlight } from "@blockslides/extension-highlight";
import type { HorizontalRuleOptions } from "@blockslides/extension-horizontal-rule";
import { HorizontalRule } from "@blockslides/extension-horizontal-rule";
import type { ImageOptions } from "@blockslides/extension-image";
import { Image } from "@blockslides/extension-image";
import type { ItalicOptions } from "@blockslides/extension-italic";
import { Italic } from "@blockslides/extension-italic";
import type { LinkOptions } from "@blockslides/extension-link";
import { Link } from "@blockslides/extension-link";
import type {
  BulletListOptions,
  ListItemOptions,
  ListKeymapOptions,
  OrderedListOptions,
} from "@blockslides/extension-list";
import type { ImageBlockOptions } from "@blockslides/extension-image-block";
import { ImageBlock } from "@blockslides/extension-image-block";
import {
  BulletList,
  ListItem,
  ListKeymap,
  OrderedList,
} from "@blockslides/extension-list";
import type { MathematicsOptions } from "@blockslides/extension-mathematics";
import { Mathematics } from "@blockslides/extension-mathematics";
import type { MarkdownExtensionOptions } from "@blockslides/markdown";
import { Markdown } from "@blockslides/markdown";
import type { NodeRangeOptions } from "@blockslides/extension-node-range";
import { NodeRange } from "@blockslides/extension-node-range";
import type { ParagraphOptions } from "@blockslides/extension-paragraph";
import { Paragraph } from "@blockslides/extension-paragraph";
import type { PlaceholderOptions } from "@blockslides/extension-placeholder";
import { Placeholder } from "@blockslides/extension-placeholder";
import type { StrikeOptions } from "@blockslides/extension-strike";
import { Strike } from "@blockslides/extension-strike";
import type { SubscriptExtensionOptions } from "@blockslides/extension-subscript";
import { Subscript } from "@blockslides/extension-subscript";
import type { SuperscriptExtensionOptions } from "@blockslides/extension-superscript";
import { Superscript } from "@blockslides/extension-superscript";
import type { TableOptions } from "@blockslides/extension-table";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@blockslides/extension-table";
import type { TableOfContentsOptions } from "@blockslides/extension-table-of-contents";
import { TableOfContents } from "@blockslides/extension-table-of-contents";
import { Text } from "@blockslides/extension-text";
import type { TextAlignOptions } from "@blockslides/extension-text-align";
import { TextAlign } from "@blockslides/extension-text-align";
import type { TextStyleOptions } from "@blockslides/extension-text-style";
import { TextStyle } from "@blockslides/extension-text-style";
import type { TypographyOptions } from "@blockslides/extension-typography";
import { Typography } from "@blockslides/extension-typography";
import type { UnderlineOptions } from "@blockslides/extension-underline";
import { Underline } from "@blockslides/extension-underline";
import { UniqueID } from "@blockslides/extension-unique-id";
import type { UniqueIDOptions } from "@blockslides/extension-unique-id";
import type { YoutubeOptions } from "@blockslides/extension-youtube";
import { Youtube } from "@blockslides/extension-youtube";
import { Slide } from "@blockslides/extension-slide";
import { Row } from "@blockslides/extension-row";
import { Column } from "@blockslides/extension-column";
import { SelectWithinSlide } from "@blockslides/extension-select-within-slide";
import type { AddSlideButtonOptions } from "@blockslides/extension-add-slide-button";
import { AddSlideButton } from "@blockslides/extension-add-slide-button";
import type { BubbleMenuOptions } from "@blockslides/extension-bubble-menu";
import { BubbleMenu } from "@blockslides/extension-bubble-menu";
import type { FloatingMenuOptions } from "@blockslides/extension-floating-menu";
import { FloatingMenu } from "@blockslides/extension-floating-menu";
import type {
  DropcursorOptions,
  TrailingNodeOptions,
  UndoRedoOptions,
} from "@blockslides/extensions";
import {
  Dropcursor,
  Gapcursor,
  TrailingNode,
  UndoRedo,
} from "@blockslides/extensions";

/**
 * ExtensionKit Options Interface
 *
 * Each extension can be:
 * - undefined (default): Extension will be included with default options
 * - false: Extension will be excluded
 * - Partial<ExtensionOptions>: Extension will be included with custom options
 */
export interface ExtensionKitOptions {
  /**
   * Select which top-level document node to use.
   * 'slide' => default slideshow doc (slide+)
   * 'asset' => asset doc (block+)
   * @default 'slide'
   */
  topLevelDoc?: "slide" | "asset";
  /**
   * Add slide button extension
   * @default {}
   * @example addSlideButton: false
   * @example addSlideButton: { content: '➕', buttonStyle: { width: '64px' } }
   */
  addSlideButton?: Partial<AddSlideButtonOptions> | false;

  /**
   * Blockquote extension
   * @default {}
   * @example blockquote: false
   * @example blockquote: { HTMLAttributes: { class: 'my-blockquote' } }
   */
  blockquote?: Partial<BlockquoteOptions> | false;

  /**
   * Bold extension
   * @default {}
   * @example bold: false
   * @example bold: { HTMLAttributes: { class: 'font-bold' } }
   */
  bold?: Partial<BoldOptions> | false;

  /**
   * Bubble menu extension
   * @default {}
   * @example bubbleMenu: false
   */
  bubbleMenu?: Partial<BubbleMenuOptions> | false;

  /**
   * Bullet list extension
   * @default {}
   * @example bulletList: false
   * @example bulletList: { HTMLAttributes: { class: 'list-disc' } }
   */
  bulletList?: Partial<BulletListOptions> | false;

  /**
   * Inline code extension
   * @default {}
   * @example code: false
   */
  code?: Partial<CodeOptions> | false;

  /**
   * Code block extension
   * @default {}
   * @example codeBlock: false
   * @example codeBlock: { defaultLanguage: 'javascript' }
   */
  codeBlock?: Partial<CodeBlockOptions> | false;

  /**
   * Text color extension
   * @default {}
   * @example color: false
   * @example color: { types: ['textStyle'] }
   */
  color?: Partial<ColorOptions> | false;

  /**
   * Details/Summary (collapsible) extension
   * @default {}
   * @example details: false
   */
  details?: false;

  /**
   * Document extension (root node)
   * @default {}
   * @example document: false
   */
  document?: false;

  /**
   * Drop cursor extension
   * @default {}
   * @example dropcursor: false
   * @example dropcursor: { color: '#3b82f6', width: 2 }
   */
  dropcursor?: Partial<DropcursorOptions> | false;

  /**
   * File handler extension (drag & drop, paste)
   * @default {}
   * @example fileHandler: false
   */
  fileHandler?: Partial<FileHandlerOptions> | false;

  /**
   * Floating menu extension
   * @default {}
   * @example floatingMenu: false
   */
  floatingMenu?: Partial<FloatingMenuOptions> | false;

  /**
   * Font family extension
   * @default {}
   * @example fontFamily: false
   * @example fontFamily: { types: ['textStyle'] }
   */
  fontFamily?: Partial<FontFamilyOptions> | false;

  /**
   * Gap cursor extension
   * @default {}
   * @example gapcursor: false
   */
  gapcursor?: false;

  /**
   * Hard break extension
   * @default {}
   * @example hardBreak: false
   */
  hardBreak?: Partial<HardBreakOptions> | false;

  /**
   * Heading extension
   * @default {}
   * @example heading: false
   * @example heading: { levels: [1, 2, 3] }
   */
  heading?: Partial<HeadingOptions> | false;

  /**
   * Text highlight extension
   * @default {}
   * @example highlight: false
   * @example highlight: { multicolor: true }
   */
  highlight?: Partial<HighlightOptions> | false;

  /**
   * Horizontal rule extension
   * @default {}
   * @example horizontalRule: false
   */
  horizontalRule?: Partial<HorizontalRuleOptions> | false;

  /**
   * Image extension
   * @default {}
   * @example image: false
   * @example image: { inline: true, allowBase64: true }
   */
  image?: Partial<ImageOptions> | false;

  /**
   * Italic extension
   * @default {}
   * @example italic: false
   */
  italic?: Partial<ItalicOptions> | false;

  /**
   * Link extension
   * @default {}
   * @example link: false
   * @example link: { openOnClick: false, linkOnPaste: true }
   */
  link?: Partial<LinkOptions> | false;

  /**
   * List item extension
   * @default {}
   * @example listItem: false
   */
  listItem?: Partial<ListItemOptions> | false;

  /**
   * List keymap extension
   * @default {}
   * @example listKeymap: false
   */
  listKeymap?: Partial<ListKeymapOptions> | false;

  /**
   * Mathematics extension (LaTeX/KaTeX)
   * @default {}
   * @example mathematics: false
   */
  mathematics?: Partial<MathematicsOptions> | false;

  /**
   * Image block extension
   * @default {}
   * @example imageBlock: false
   */
  imageBlock?: Partial<ImageBlockOptions> | false;

  /**
   * Markdown extension (parse/serialize markdown)
   * @default {}
   * @example markdown: false
   */
  markdown?: Partial<MarkdownExtensionOptions> | false;

  /**
   * Node range extension
   * @default {}
   * @example nodeRange: false
   */
  nodeRange?: Partial<NodeRangeOptions> | false;

  /**
   * Ordered list extension
   * @default {}
   * @example orderedList: false
   */
  orderedList?: Partial<OrderedListOptions> | false;

  /**
   * Paragraph extension
   * @default {}
   * @example paragraph: false
   */
  paragraph?: Partial<ParagraphOptions> | false;

  /**
   * Placeholder extension
   * @default {}
   * @example placeholder: false
   * @example placeholder: { placeholder: 'Start typing...' }
   */
  placeholder?: Partial<PlaceholderOptions> | false;

  /**
   * Slide extension
   * @default {}
   * @example slide: false
   */
  slide?: false;

  /**
   * Select-within-slide keyboard shortcut override
   * @default {}
   * @example selectWithinSlide: false
   */
  selectWithinSlide?: false;

  /**
   * Strike-through extension
   * @default {}
   * @example strike: false
   */
  strike?: Partial<StrikeOptions> | false;

  /**
   * Subscript extension
   * @default {}
   * @example subscript: false
   */
  subscript?: Partial<SubscriptExtensionOptions> | false;

  /**
   * Superscript extension
   * @default {}
   * @example superscript: false
   */
  superscript?: Partial<SuperscriptExtensionOptions> | false;

  /**
   * Table extension
   * @default {}
   * @example table: false
   * @example table: { resizable: true, cellMinWidth: 50 }
   */
  table?: Partial<TableOptions> | false;

  /**
   * Table of contents extension
   * @default {}
   * @example tableOfContents: false
   */
  tableOfContents?: Partial<TableOfContentsOptions> | false;

  /**
   * Text extension (base text node)
   * @default {}
   * @example text: false
   */
  text?: false;

  /**
   * Text align extension
   * @default {}
   * @example textAlign: false
   * @example textAlign: { types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right'] }
   */
  textAlign?: Partial<TextAlignOptions> | false;

  /**
   * Text style extension
   * @default {}
   * @example textStyle: false
   */
  textStyle?: Partial<TextStyleOptions> | false;

  /**
   * Typography extension (smart quotes, dashes, etc.)
   * @default {}
   * @example typography: false
   */
  typography?: Partial<TypographyOptions> | false;

  /**
   * Underline extension
   * @default {}
   * @example underline: false
   */
  underline?: Partial<UnderlineOptions> | false;

  /**
   * Undo/Redo extension
   * @default {}
   * @example undoRedo: false
   */
  undoRedo?: Partial<UndoRedoOptions> | false;

  /**
   * Unique ID extension
   * @default {}
   * @example uniqueId: false
   */
  uniqueId?: Partial<UniqueIDOptions> | false;

  /**
   * Trailing node extension
   * @default {}
   * @example trailingNode: false
   */
  trailingNode?: Partial<TrailingNodeOptions> | false;

  /**
   * YouTube extension
   * @default {}
   * @example youtube: false
   * @example youtube: { width: 640, height: 480 }
   */
  youtube?: Partial<YoutubeOptions> | false;
}

/**
 * ExtensionKit - A comprehensive bundle of all available extensions
 *
 * This extension allows you to easily configure which extensions to include
 * in your editor and customize their options.
 *
 * @example
 * ```typescript
 * const editor = useSlideEditor({
 *   extensions: [
 *     ExtensionKit.configure({
 *       document: false,
 *       heading: { levels: [1, 2, 3] },
 *       link: { openOnClick: false },
 *       codeBlock: false,
 *     })
 *   ]
 * })
 * ```
 */
export const ExtensionKit = Extension.create<ExtensionKitOptions>({
  name: "extensionKit",

  addExtensions() {
    const extensions = [];

    // Core extensions
    if (this.options.document !== false) {
      const docType = this.options.topLevelDoc ?? "slide";
      if (docType === "asset") {
        extensions.push(AssetDocument);
      } else {
        extensions.push(Document.configure({}));
      }
    }

    if (this.options.text !== false) {
      extensions.push(Text.configure(this.options.text || {}));
    }

    if (this.options.paragraph !== false) {
      extensions.push(Paragraph.configure(this.options.paragraph || {}));
    }

    // Text formatting extensions
    if (this.options.bold !== false) {
      extensions.push(Bold.configure(this.options.bold || {}));
    }

    if (this.options.italic !== false) {
      extensions.push(Italic.configure(this.options.italic || {}));
    }

    if (this.options.underline !== false) {
      extensions.push(Underline.configure(this.options.underline || {}));
    }

    if (this.options.strike !== false) {
      extensions.push(Strike.configure(this.options.strike || {}));
    }

    if (this.options.code !== false) {
      extensions.push(Code.configure(this.options.code || {}));
    }

    if (this.options.subscript !== false) {
      extensions.push(Subscript.configure(this.options.subscript || {}));
    }

    if (this.options.superscript !== false) {
      extensions.push(Superscript.configure(this.options.superscript || {}));
    }

    // Text style extensions
    if (this.options.textStyle !== false) {
      extensions.push(TextStyle.configure(this.options.textStyle || {}));
    }

    if (this.options.color !== false) {
      extensions.push(Color.configure(this.options.color || {}));
    }

    if (this.options.fontFamily !== false) {
      extensions.push(FontFamily.configure(this.options.fontFamily || {}));
    }

    if (this.options.highlight !== false) {
      extensions.push(Highlight.configure(this.options.highlight || {}));
    }

    if (this.options.textAlign !== false) {
      extensions.push(TextAlign.configure(this.options.textAlign || {}));
    }

    // Block extensions
    if (this.options.heading !== false) {
      extensions.push(Heading.configure(this.options.heading || {}));
    }

    if (this.options.blockquote !== false) {
      extensions.push(Blockquote.configure(this.options.blockquote || {}));
    }

    if (this.options.codeBlock !== false) {
      extensions.push(CodeBlock.configure(this.options.codeBlock || {}));
    }

    if (this.options.horizontalRule !== false) {
      extensions.push(
        HorizontalRule.configure(this.options.horizontalRule || {})
      );
    }

    // List extensions
    if (this.options.bulletList !== false) {
      extensions.push(BulletList.configure(this.options.bulletList || {}));
    }

    if (this.options.orderedList !== false) {
      extensions.push(OrderedList.configure(this.options.orderedList || {}));
    }

    if (this.options.listItem !== false) {
      extensions.push(ListItem.configure(this.options.listItem || {}));
    }

    if (this.options.listKeymap !== false) {
      extensions.push(ListKeymap.configure(this.options.listKeymap || {}));
    }

    // Media extensions
    if (this.options.image !== false) {
      extensions.push(Image.configure(this.options.image || {}));
    }

    if (this.options.youtube !== false) {
      extensions.push(Youtube.configure(this.options.youtube || {}));
    }

    // Interactive extensions
    if (this.options.link !== false) {
      extensions.push(Link.configure(this.options.link || {}));
    }

    if (this.options.details !== false) {
      extensions.push(Details.configure(this.options.details || {}));
      extensions.push(DetailsContent.configure({}));
      extensions.push(DetailsSummary.configure({}));
    }

    // Table extensions
    if (this.options.table !== false) {
      extensions.push(Table.configure(this.options.table || {}));
      extensions.push(TableRow.configure({}));
      extensions.push(TableHeader.configure({}));
      extensions.push(TableCell.configure({}));
    }

    if (this.options.tableOfContents !== false) {
      extensions.push(
        TableOfContents.configure(this.options.tableOfContents || {})
      );
    }

    // Special content extensions
    if (this.options.mathematics !== false) {
      extensions.push(Mathematics.configure(this.options.mathematics || {}));
    }

    if (this.options.markdown !== false) {
      extensions.push(Markdown.configure(this.options.markdown || {}));
    }

    if (this.options.imageBlock !== false) {
      extensions.push(ImageBlock.configure(this.options.imageBlock || {}));
    } 

    // Editor behavior extensions
    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options.hardBreak || {}));
    }

    if (this.options.dropcursor !== false) {
      extensions.push(Dropcursor.configure(this.options.dropcursor || {}));
    }

    if (this.options.gapcursor !== false) {
      extensions.push(Gapcursor.configure(this.options.gapcursor || {}));
    }

    if (this.options.undoRedo !== false) {
      extensions.push(UndoRedo.configure(this.options.undoRedo || {}));
    }

    if (this.options.trailingNode !== false) {
      extensions.push(TrailingNode.configure(this.options.trailingNode || {}));
    }

    // UI extensions
    if (this.options.placeholder !== false) {
      extensions.push(Placeholder.configure(this.options.placeholder || {}));
    }

    if (this.options.bubbleMenu !== false) {
      extensions.push(BubbleMenu.configure(this.options.bubbleMenu || {}));
    }

    if (this.options.floatingMenu !== false) {
      extensions.push(FloatingMenu.configure(this.options.floatingMenu || {}));
    }

    // Utility extensions
    if (this.options.fileHandler !== false) {
      extensions.push(FileHandler.configure(this.options.fileHandler || {}));
    }

    if (this.options.nodeRange !== false) {
      extensions.push(NodeRange.configure(this.options.nodeRange || {}));
    }

    if (this.options.typography !== false) {
      extensions.push(Typography.configure(this.options.typography || {}));
    }

    if (this.options.uniqueId !== false) {
      extensions.push(UniqueID.configure(this.options.uniqueId || {}));
    }

    // Slide-specific extensions
    if (this.options.slide !== false) {
      extensions.push(Slide.configure(this.options.slide || {}));
    }

    if (this.options.selectWithinSlide !== false) {
      extensions.push(SelectWithinSlide);
    }

    extensions.push(Row.configure({}));
    extensions.push(Column.configure({}));

    if (this.options.addSlideButton !== false) {
      extensions.push(
        AddSlideButton.configure(this.options.addSlideButton || {})
      );
    }

    return extensions;
  },
});
