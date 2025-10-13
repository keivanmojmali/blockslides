/**
 * Content Redistribution Utilities
 * 
 * Handles extraction and redistribution of content blocks when changing
 * slide layouts. Uses sequential distribution to divide content evenly
 * across new column arrangements.
 */

import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';

/**
 * Extracts all content blocks from all columns in a slide
 * 
 * @param slideNode - The slide node to extract content from
 * @returns Array of content block nodes
 */
export function extractContentBlocks(slideNode: ProseMirrorNode): ProseMirrorNode[] {
  const blocks: ProseMirrorNode[] = [];
  
  // Iterate through all rows in the slide
  slideNode.forEach((rowNode) => {
    if (rowNode.type.name === 'row') {
      // Iterate through all columns in the row
      rowNode.forEach((columnNode) => {
        if (columnNode.type.name === 'column') {
          // Extract all blocks from this column
          columnNode.forEach((blockNode) => {
            // Only add non-empty blocks (skip empty paragraphs)
            if (blockNode.type.name !== 'paragraph' || blockNode.content.size > 0) {
              blocks.push(blockNode);
            }
          });
        }
      });
    }
  });
  
  return blocks;
}

/**
 * Redistributes content blocks across multiple columns using sequential distribution
 * 
 * @param blocks - Array of content blocks to redistribute
 * @param columnCount - Number of columns to distribute across
 * @param schema - ProseMirror schema for creating nodes
 * @returns Array of column nodes with redistributed content
 */
export function redistributeContent(
  blocks: ProseMirrorNode[],
  columnCount: number,
  schema: Schema
): ProseMirrorNode[] {
  const columns: ProseMirrorNode[] = [];
  const columnType = schema.nodes.column;
  const paragraphType = schema.nodes.paragraph;
  
  if (!columnType || !paragraphType) {
    console.error('[AutoArtifacts] Missing column or paragraph node type');
    return [];
  }
  
  // If no blocks, create empty columns
  if (blocks.length === 0) {
    for (let i = 0; i < columnCount; i++) {
      const emptyParagraph = paragraphType.create();
      const column = columnType.create(null, [emptyParagraph]);
      columns.push(column);
    }
    return columns;
  }
  
  // Calculate how many blocks per column (distribute evenly)
  const blocksPerColumn = Math.ceil(blocks.length / columnCount);
  
  // Distribute blocks sequentially across columns
  for (let i = 0; i < columnCount; i++) {
    const startIndex = i * blocksPerColumn;
    const endIndex = Math.min(startIndex + blocksPerColumn, blocks.length);
    const columnBlocks = blocks.slice(startIndex, endIndex);
    
    // Ensure each column has at least an empty paragraph
    if (columnBlocks.length === 0) {
      columnBlocks.push(paragraphType.create());
    }
    
    const column = columnType.create(null, columnBlocks);
    columns.push(column);
  }
  
  return columns;
}

/**
 * Creates an empty column with a single empty paragraph
 * 
 * @param schema - ProseMirror schema
 * @returns Column node with empty paragraph
 */
export function createEmptyColumn(schema: Schema): ProseMirrorNode | null {
  const columnType = schema.nodes.column;
  const paragraphType = schema.nodes.paragraph;
  
  if (!columnType || !paragraphType) {
    console.error('[AutoArtifacts] Missing column or paragraph node type');
    return null;
  }
  
  const emptyParagraph = paragraphType.create();
  return columnType.create(null, [emptyParagraph]);
}

/**
 * Checks if a slide is empty (single column with only empty paragraph)
 * 
 * @param slideNode - The slide node to check
 * @returns True if slide is empty
 */
export function isSlideEmpty(slideNode: ProseMirrorNode): boolean {
  // Check layout attribute
  const layout = slideNode.attrs.layout;
  if (layout && layout !== '1' && layout !== '') {
    return false;
  }
  
  // Check structure: should have exactly 1 row
  if (slideNode.childCount !== 1) {
    return false;
  }
  
  const rowNode = slideNode.child(0);
  if (rowNode.type.name !== 'row') {
    return false;
  }
  
  // Row should have exactly 1 column
  if (rowNode.childCount !== 1) {
    return false;
  }
  
  const columnNode = rowNode.child(0);
  if (columnNode.type.name !== 'column') {
    return false;
  }
  
  // Column should have exactly 1 paragraph
  if (columnNode.childCount !== 1) {
    return false;
  }
  
  const blockNode = columnNode.child(0);
  if (blockNode.type.name !== 'paragraph') {
    return false;
  }
  
  // Paragraph should be empty or only whitespace
  const text = blockNode.textContent.trim();
  return text.length === 0;
}

