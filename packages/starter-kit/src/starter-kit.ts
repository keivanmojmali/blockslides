import { Extension } from "@blockslides/core";
import type { BlockquoteOptions } from "@blockslides/extension-blockquote";
import { Blockquote } from "@blockslides/extension-blockquote";
import type { BoldOptions } from "@blockslides/extension-bold";
import { Bold } from "@blockslides/extension-bold";
import type { CodeOptions } from "@blockslides/extension-code";
import { Code } from "@blockslides/extension-code";
import type { CodeBlockOptions } from "@blockslides/extension-code-block";
import { CodeBlock } from "@blockslides/extension-code-block";
import { Document } from "@blockslides/extension-document";
import type { HardBreakOptions } from "@blockslides/extension-hard-break";
import { HardBreak } from "@blockslides/extension-hard-break";
import type { HeadingOptions } from "@blockslides/extension-heading";
import { Heading } from "@blockslides/extension-heading";
import type { HorizontalRuleOptions } from "@blockslides/extension-horizontal-rule";
import { HorizontalRule } from "@blockslides/extension-horizontal-rule";
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
import {
  BulletList,
  ListItem,
  ListKeymap,
  OrderedList,
} from "@blockslides/extension-list";
import type { ParagraphOptions } from "@blockslides/extension-paragraph";
import { Paragraph } from "@blockslides/extension-paragraph";
import type { StrikeOptions } from "@blockslides/extension-strike";
import { Strike } from "@blockslides/extension-strike";
import { Text } from "@blockslides/extension-text";
import type { UnderlineOptions } from "@blockslides/extension-underline";
import { Underline } from "@blockslides/extension-underline";
import type { PlaceholderOptions } from "@blockslides/extension-placeholder";
import { Placeholder } from "@blockslides/extension-placeholder";
import { Slide } from "@blockslides/extension-slide";
import { AddSlideButton } from "@blockslides/extension-add-slide-button";
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

export interface StarterKitOptions {
  /**
   * If set to false, the blockquote extension will not be registered
   * @default {}
   * @example blockquote: false
   */
  blockquote: Partial<BlockquoteOptions> | false;

  /**
   * If set to false, the bold extension will not be registered
   * @default {}
   * @example bold: false
   */
  bold: Partial<BoldOptions> | false;

  /**
   * If set to false, the bulletList extension will not be registered
   * @default {}
   * @example bulletList: false
   */
  bulletList: Partial<BulletListOptions> | false;

  /**
   * If set to false, the code extension will not be registered
   * @default {}
   * @example code: false
   */
  code: Partial<CodeOptions> | false;

  /**
   * If set to false, the codeBlock extension will not be registered
   * @default {}
   * @example codeBlock: false
   */
  codeBlock: Partial<CodeBlockOptions> | false;

  /**
   * If set to false, the document extension will not be registered
   * @default {}
   * @example document: false
   */
  document: false;

  /**
   * If set to false, the dropcursor extension will not be registered
   * @default {}
   * @example dropcursor: false
   */
  dropcursor: Partial<DropcursorOptions> | false;

  /**
   * If set to false, the gapcursor extension will not be registered
   * @default {}
   * @example gapcursor: false
   */
  gapcursor: false;

  /**
   * If set to false, the hardBreak extension will not be registered
   * @default {}
   * @example hardBreak: false
   */
  hardBreak: Partial<HardBreakOptions> | false;

  /**
   * If set to false, the heading extension will not be registered
   * @default {}
   * @example heading: false
   */
  heading: Partial<HeadingOptions> | false;

  /**
   * If set to false, the undo-redo extension will not be registered
   * @default {}
   * @example undoRedo: false
   */
  undoRedo: Partial<UndoRedoOptions> | false;

  /**
   * If set to false, the horizontalRule extension will not be registered
   * @default {}
   * @example horizontalRule: false
   */
  horizontalRule: Partial<HorizontalRuleOptions> | false;

  /**
   * If set to false, the italic extension will not be registered
   * @default {}
   * @example italic: false
   */
  italic: Partial<ItalicOptions> | false;

  /**
   * If set to false, the listItem extension will not be registered
   * @default {}
   * @example listItem: false
   */
  listItem: Partial<ListItemOptions> | false;

  /**
   * If set to false, the listItemKeymap extension will not be registered
   * @default {}
   * @example listKeymap: false
   */
  listKeymap: Partial<ListKeymapOptions> | false;

  /**
   * If set to false, the link extension will not be registered
   * @default {}
   * @example link: false
   */
  link: Partial<LinkOptions> | false;

  /**
   * If set to false, the orderedList extension will not be registered
   * @default {}
   * @example orderedList: false
   */
  orderedList: Partial<OrderedListOptions> | false;

  /**
   * If set to false, the paragraph extension will not be registered
   * @default {}
   * @example paragraph: false
   */
  paragraph: Partial<ParagraphOptions> | false;

  /**
   * If set to false, the strike extension will not be registered
   * @default {}
   * @example strike: false
   */
  strike: Partial<StrikeOptions> | false;

  /**
   * If set to false, the text extension will not be registered
   * @default {}
   * @example text: false
   */
  text: false;

  /**
   * If set to false, the underline extension will not be registered
   * @default {}
   * @example underline: false
   */
  underline: Partial<UnderlineOptions> | false;

  /**
   * If set to false, the trailingNode extension will not be registered
   * @default {}
   * @example trailingNode: false
   */
  trailingNode: Partial<TrailingNodeOptions> | false;

  /**
   * If set to false, the placeholder extension will not be registered
   * @default {}
   * @example placeholder: false
   */
  placeholder: Partial<PlaceholderOptions> | false;

  /**
   * If set to false, the slide extension will not be registered
   * @default {}
   * @example slide: false
   */
  slide: false;

  /**
   * If set to false, the addSlideButton extension will not be registered
   * @default {}
   * @example addSlideButton: false
   */
  addSlideButton: false;
}

/**
 * The starter kit is a collection of essential editor extensions for BlockSlides.
 *
 * It includes all the basic text editing extensions plus slide-specific functionality.
 */
export const StarterKit = Extension.create<StarterKitOptions>({
  name: "starterKit",

  addExtensions() {
    const extensions = [];

    if (this.options.bold !== false) {
      extensions.push(Bold.configure(this.options.bold));
    }

    if (this.options.blockquote !== false) {
      extensions.push(Blockquote.configure(this.options.blockquote));
    }

    if (this.options.bulletList !== false) {
      extensions.push(BulletList.configure(this.options.bulletList));
    }

    if (this.options.code !== false) {
      extensions.push(Code.configure(this.options.code));
    }

    if (this.options.codeBlock !== false) {
      extensions.push(CodeBlock.configure(this.options.codeBlock));
    }

    if (this.options.document !== false) {
      extensions.push(Document.configure(this.options.document));
    }

    if (this.options.dropcursor !== false) {
      extensions.push(Dropcursor.configure(this.options.dropcursor));
    }

    if (this.options.gapcursor !== false) {
      extensions.push(Gapcursor.configure(this.options.gapcursor));
    }

    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options.hardBreak));
    }

    if (this.options.heading !== false) {
      extensions.push(Heading.configure(this.options.heading));
    }

    if (this.options.undoRedo !== false) {
      extensions.push(UndoRedo.configure(this.options.undoRedo));
    }

    if (this.options.horizontalRule !== false) {
      extensions.push(HorizontalRule.configure(this.options.horizontalRule));
    }

    if (this.options.italic !== false) {
      extensions.push(Italic.configure(this.options.italic));
    }

    if (this.options.listItem !== false) {
      extensions.push(ListItem.configure(this.options.listItem));
    }

    if (this.options.listKeymap !== false) {
      extensions.push(ListKeymap.configure(this.options?.listKeymap));
    }

    if (this.options.link !== false) {
      extensions.push(Link.configure(this.options?.link));
    }

    if (this.options.orderedList !== false) {
      extensions.push(OrderedList.configure(this.options.orderedList));
    }

    if (this.options.paragraph !== false) {
      extensions.push(Paragraph.configure(this.options.paragraph));
    }

    if (this.options.strike !== false) {
      extensions.push(Strike.configure(this.options.strike));
    }

    if (this.options.text !== false) {
      extensions.push(Text.configure(this.options.text));
    }

    if (this.options.underline !== false) {
      extensions.push(Underline.configure(this.options?.underline));
    }

    if (this.options.trailingNode !== false) {
      extensions.push(TrailingNode.configure(this.options?.trailingNode));
    }

    if (this.options.placeholder !== false) {
      extensions.push(Placeholder.configure(this.options?.placeholder));
    }

    if (this.options.slide !== false) {
      extensions.push(Slide.configure(this.options?.slide));
    }

    if (this.options.addSlideButton !== false) {
      extensions.push(AddSlideButton.configure(this.options?.addSlideButton));
    }

    return extensions;
  },
});
