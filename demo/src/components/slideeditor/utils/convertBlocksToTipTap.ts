/*******************************************************
 *                Tiptap Conversion Types
 ********************************************************/

// Your custom block interface, matching the structure you provided.
interface CustomBlock {
  id: string;
  type: string; // e.g., 'paragraph', 'bulletListItem', 'numberedListItem', 'heading', 'table', 'imageBlock', ...
  props?: BlockProps; // e.g. { textColor, backgroundColor, textAlignment, src, etc. }
  content?: CustomInlineContent[] | TableContent; // Inline content OR table info
  children?: CustomBlock[]; // For nested blocks if needed
}

// A generic shape for your block props
interface BlockProps {
  textColor?: string;
  backgroundColor?: string;
  textAlignment?: string;
  url?: string; // if it's an image block
  name?: string; // if it's an image block
  src?: string; // if it's an image block
  alt?: string; // if it's an image block
  level?: number; // if it's a heading block (h1=1, h2=2, etc.)
}

// For inline content (text nodes, possibly inline images or other inline elements)
interface CustomInlineContent {
  type: "text" | "image" | string;
  text?: string;
  styles?: Record<string, any>; // e.g. { bold: true, italic: true, color: '#FF0000' }
}

// For table content (if type === 'table')
interface TableContent {
  type: "tableContent";
  rows: {
    cells: CustomInlineContent[][];
    // Each row is an object with `cells: CustomInlineContent[][]`,
    // i.e. an array of "cells", where each cell is an array of inline items.
  }[];
}

/*******************************************************
 *                Tiptap (ProseMirror) Types
 ********************************************************/

// The final shape of a Tiptap JSON doc
interface TiptapDoc {
  type: "doc";
  content: TiptapNode[];
}

// A generic Tiptap node (block-level or inline).
interface TiptapNode {
  type: string; // e.g., 'paragraph', 'heading', 'bulletList', 'listItem', 'orderedList', 'table', 'text', etc.
  attrs?: Record<string, any>;
  content?: TiptapNode[]; // nested child nodes
  text?: string; // for text nodes
  marks?: TiptapMark[]; // inline marks (bold, italic, color, etc.)
}

// A Tiptap mark, e.g., { type: 'bold' } or { type: 'textStyle', attrs: { color: '#FF0000'} }
interface TiptapMark {
  type: string;
  attrs?: Record<string, any>;
}

/*******************************************************
 *  Main Conversion Function
 ********************************************************/

/**
 * Converts an array of your custom blocks into a single Tiptap (ProseMirror) doc.
 *
 * @param blocks - The array of custom blocks.
 * @returns A TiptapDoc object that you can pass into Tiptap's setContent(...).
 */
export function convertBlocksToTiptap(blocks: CustomBlock[]): TiptapDoc {
  // The root doc node Tiptap expects
  const doc: TiptapDoc = {
    type: "doc",
    content: [],
  };

  // We'll group consecutive bulletListItems into a single bulletList node
  let bulletListNode: TiptapNode | null = null;
  // We'll group consecutive numberedListItems into a single orderedList node
  let orderedListNode: TiptapNode | null = null;

  for (const block of blocks) {
    switch (block.type) {
      // 1. bulletListItem -> group them in a bulletList
      case "bulletListItem": {
        // If we hit a bulletListItem, break any numberedList streak
        orderedListNode = null;
        if (!bulletListNode) {
          bulletListNode = {
            type: "bulletList",
            content: [],
          };
          doc.content.push(bulletListNode);
        }
        const listItemNode = convertBulletListItem(block);
        bulletListNode.content!.push(listItemNode);
        break;
      }

      // 2. numberedListItem -> group them in an orderedList
      case "numberedListItem": {
        // If we hit a numberedListItem, break any bulletList streak
        bulletListNode = null;
        if (!orderedListNode) {
          orderedListNode = {
            type: "orderedList",
            content: [],
          };
          doc.content.push(orderedListNode);
        }
        const listItemNode = convertNumberedListItem(block);
        orderedListNode.content!.push(listItemNode);
        break;
      }

      // 3. All other blocks -> close out bulletList or orderedList
      default: {
        bulletListNode = null;
        orderedListNode = null;

        // Convert the block normally
        const tiptapNode = convertBlock(block);
        if (tiptapNode) {
          doc.content.push(tiptapNode);
        }
      }
    }
  }

  return doc;
}

/*******************************************************
 *         Helpers for Converting Individual Blocks
 ********************************************************/

/**
 * Converts a single block into the appropriate Tiptap node.
 *
 * Add/modify cases to match the block types you use:
 * - paragraph
 * - heading
 * - imageBlock
 * - table
 * - fallback
 */
function convertBlock(block: CustomBlock): TiptapNode | null {
  const { type } = block;

  switch (type) {
    case "paragraph":
      return convertParagraphBlock(block);

    case "heading":
      return convertHeadingBlock(block);

    case "imageBlock":
      return convertImageBlock(block);

    case "image":
      return {
        type: "imageBlock",
        attrs: {
          ...convertBlockPropsToAttrs(block),
          // or rename if needed
          src: block.props?.url || "",
          alt: block.props?.name || "",
        },
      };

    case "table":
      return convertTableBlock(block);

    default:
      // Fallback: treat unrecognized blocks as paragraphs
      return convertParagraphBlock(block);
  }
}

/*******************************************************
 *   bulletListItem / numberedListItem Conversions
 ********************************************************/

/**
 * Converts a bulletListItem block into a Tiptap "listItem" node with a child paragraph.
 */
function convertBulletListItem(block: CustomBlock): TiptapNode {
  return {
    type: "listItem",
    attrs: {
      ...convertBlockPropsToAttrs(block),
    },
    content: [
      {
        type: "paragraph",
        attrs: {
          ...convertBlockPropsToAttrs(block),
        },
        content: convertInlineContent(block.content as CustomInlineContent[]),
      },
    ],
  };
}

/**
 * Converts a numberedListItem block into a Tiptap "listItem" node with a child paragraph.
 */
function convertNumberedListItem(block: CustomBlock): TiptapNode {
  return {
    type: "listItem",
    attrs: {
      ...convertBlockPropsToAttrs(block),
    },
    content: [
      {
        type: "paragraph",
        attrs: {
          ...convertBlockPropsToAttrs(block),
        },
        content: convertInlineContent(block.content as CustomInlineContent[]),
      },
    ],
  };
}

/*******************************************************
 *     Paragraph / Heading / Image / Table Blocks
 ********************************************************/

function convertParagraphBlock(block: CustomBlock): TiptapNode {
  return {
    type: "paragraph",
    attrs: {
      ...convertBlockPropsToAttrs(block),
    },
    content: convertInlineContent(block.content as CustomInlineContent[]),
  };
}

function convertHeadingBlock(block: CustomBlock): TiptapNode {
  // Tiptap's default heading node expects "attrs.level" from 1..6
  const level = block.props?.level ?? 1; // if missing, default to h1
  return {
    type: "heading",
    attrs: {
      ...convertBlockPropsToAttrs(block),
      level,
    },
    content: convertInlineContent(block.content as CustomInlineContent[]),
  };
}

function convertImageBlock(block: CustomBlock): TiptapNode {
  return {
    type: "image",
    attrs: {
      ...convertBlockPropsToAttrs(block),
      src: block.props?.src || "",
      alt: block.props?.alt || "",
    },
  };
}

/**
 * Converts a table block into Tiptap's table -> tableRow -> tableCell -> paragraph -> text structure.
 */
function convertTableBlock(block: CustomBlock): TiptapNode {
  const tableData = block.content as TableContent;
  // Safety check
  if (!tableData || tableData.type !== "tableContent" || !tableData.rows) {
    // Fallback: treat it as a paragraph block if something is off
    return convertParagraphBlock(block);
  }

  // Build the Tiptap "table" node
  return {
    type: "table",
    attrs: {
      ...convertBlockPropsToAttrs(block),
    },
    content: tableData.rows.map((row) => {
      // Each row -> tableRow node
      return {
        type: "tableRow",
        content: row.cells.map((cell) => {
          // Each cell is an array of inline items
          // We'll wrap them in a single paragraph
          return {
            type: "tableCell",
            content: [
              {
                type: "paragraph",
                content: convertInlineContent(cell),
              },
            ],
          };
        }),
      };
    }),
  };
}

/*******************************************************
 *    Inline Content & Marks (text, bold, color, etc.)
 ********************************************************/

/**
 * Convert an array of { type: 'text', text: ..., styles: ... } or inline images
 * to Tiptap text/image nodes.
 */
function convertInlineContent(
  contentArr: CustomInlineContent[] | undefined
): TiptapNode[] {
  if (!contentArr || contentArr.length === 0) {
    return [];
  }

  return contentArr.map((item) => {
    if (item.type === "text") {
      // Create a Tiptap text node
      return {
        type: "text",
        text: item.text || "",
        marks: convertStylesToMarks(item.styles),
      };
    }

    // If you had inline images in the content
    if (item.type === "image") {
      return {
        type: "image",
        attrs: {
          src: item.text || "", // or item.styles?.src, etc.
        },
      };
    }

    // Fallback if item.type is unknown
    return {
      type: "text",
      text: item.text || "",
      marks: convertStylesToMarks(item.styles),
    };
  });
}

/**
 * Convert your style object (e.g. { bold: true, italic: true, color: '#FF0000' })
 * into an array of Tiptap marks (e.g. [{type:'bold'}, {type:'textStyle', attrs:{color:'#FF0000'}}])
 */
function convertStylesToMarks(styles: Record<string, any> = {}): TiptapMark[] {
  const marks: TiptapMark[] = [];

  if (styles.bold) {
    marks.push({ type: "bold" });
  }
  if (styles.italic) {
    marks.push({ type: "italic" });
  }
  if (styles.underline) {
    marks.push({ type: "underline" });
  }
  if (styles.strike) {
    marks.push({ type: "strike" });
  }

  // If text color is stored in styles.color
  if (styles.color && styles.color !== "default") {
    marks.push({
      type: "textStyle",
      attrs: { color: styles.color },
    });
  }

  // If background color is stored in styles.backgroundColor
  // Tiptap's "highlight" extension can use .attrs.color or .attrs.highlightColor
  if (styles.backgroundColor && styles.backgroundColor !== "default") {
    marks.push({
      type: "highlight",
      attrs: { color: styles.backgroundColor },
    });
  }

  return marks;
}

/*******************************************************
 *        Block-Level Attributes (props -> attrs)
 ********************************************************/

/**
 * Converts block props (like alignment, textColor, backgroundColor) to Tiptap node.attrs.
 *
 * Also includes the block.id as `attrs.id` so you don't lose it.
 */
function convertBlockPropsToAttrs(block: CustomBlock): Record<string, any> {
  const { props } = block;
  const attrs: Record<string, any> = {};

  // Preserve the block's custom id in Tiptap's attrs
  attrs.id = block.id;

  // Example: store text alignment if it's not default
  if (props?.textAlignment && props.textAlignment !== "default") {
    // The Tiptap textAlign extension typically uses `textAlign`
    attrs.textAlign = props.textAlignment;
  }

  // Potentially store other block-level colors in node.attrs if needed
  if (props?.textColor && props.textColor !== "default") {
    attrs.textColor = props.textColor;
  }
  if (props?.backgroundColor && props.backgroundColor !== "default") {
    attrs.backgroundColor = props.backgroundColor;
  }

  return attrs;
}
