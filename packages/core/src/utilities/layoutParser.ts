/**
 * Layout Parser Utility
 *
 * Parses layout strings like '2-1' or '1-1-1' and applies flex ratios to columns.
 * Handles validation and provides graceful fallback to equal distribution.
 *
 * Examples:
 * - '1' → single column at 100%
 * - '1-1' → two equal columns (50/50)
 * - '2-1' → two columns (66.66% / 33.33%)
 * - '1-2-1' → three columns (25% / 50% / 25%)
 * - '5-3-2' → three columns (50% / 30% / 20%)
 */

/**
 * Parses a layout string and returns flex ratios for each column
 *
 * @param layout - Layout string (e.g., '2-1', '1-1-1')
 * @param columnCount - Number of columns in the columnGroup
 * @returns Array of flex ratio numbers
 *
 * @example
 * parseLayout('2-1', 2) // Returns [2, 1]
 * parseLayout('1-1-1', 3) // Returns [1, 1, 1]
 * parseLayout('invalid', 2) // Returns [1, 1] with console warning
 */
export function parseLayout(layout: string, columnCount: number): number[] {
  // Empty or 'auto' layout = equal distribution
  if (!layout || layout === "auto") {
    return new Array(columnCount).fill(1);
  }

  // Validate format: must be numbers separated by dashes
  // Valid: '1-2', '1-1-1', '5-3-2'
  // Invalid: 'abc', '1--2', '1-2-', '-1-2'
  const layoutRegex = /^\d+(-\d+)*$/;
  if (!layoutRegex.test(layout)) {
    console.warn(
      `[BlockSlides] Invalid layout format '${layout}'. ` +
        `Expected format: numbers separated by dashes (e.g., '2-1', '1-1-1'). ` +
        `Using equal distribution.`
    );
    return new Array(columnCount).fill(1);
  }

  // Parse the layout string into numbers
  const ratios = layout.split("-").map(Number);

  // Validate column count matches
  if (ratios.length !== columnCount) {
    console.warn(
      `[BlockSlides] Layout '${layout}' expects ${ratios.length} column(s) ` +
        `but found ${columnCount} column(s) in the columnGroup. ` +
        `Using equal distribution.`
    );
    return new Array(columnCount).fill(1);
  }

  return ratios;
}

/**
 * Applies layout ratios to a columnGroup's columns by setting flex values
 *
 * @param columnGroupElement - The DOM element for the columnGroup
 * @param layout - Layout string (e.g., '2-1')
 *
 * @example
 * const columnGroup = document.querySelector('[data-node-type="columnGroup"]');
 * applyLayoutToColumnGroup(columnGroup, '2-1');
 * // First column will have flex: 2 1 0%
 * // Second column will have flex: 1 1 0%
 */
export function applyLayoutToColumnGroup(
  columnGroupElement: HTMLElement,
  layout: string
): void {
  // Get all column children
  const columns = Array.from(columnGroupElement.children).filter(
    (el) => el.getAttribute('data-node-type') === 'column'
  ) as HTMLElement[];

  if (columns.length === 0) {
    return; // No columns to apply layout to
  }

  // Parse the layout
  const ratios = parseLayout(layout, columns.length);

  // Apply flex values to each column as inline styles
  // Note: CSS also handles common layouts, but inline styles provide
  // a fallback for custom/dynamic layouts
  columns.forEach((column, index) => {
    const ratio = ratios[index];
    column.style.flex = `${ratio} 1 0%`;
    column.style.flexGrow = `${ratio}`;
    column.style.flexShrink = '1';
    column.style.flexBasis = '0%';
  });
}

/**
 * Applies layouts to all columnGroups in the editor
 * Should be called after editor mount and after content updates
 *
 * @param editorElement - The root editor DOM element
 */
export function applyAllLayouts(editorElement: HTMLElement): void {
  // Find all columnGroup elements
  const columnGroups = editorElement.querySelectorAll(
    '[data-node-type="columnGroup"]'
  ) as NodeListOf<HTMLElement>;

  columnGroups.forEach((columnGroup) => {
    const layout = columnGroup.getAttribute("data-layout");

    // Only apply if layout is specified and not 'auto'
    // Note: CSS handles most common layouts, but this provides
    // support for custom/dynamic layouts
    if (layout && layout !== "auto") {
      applyLayoutToColumnGroup(columnGroup, layout);
    }
    // If no layout or 'auto', columns will use default flex: 1 from CSS
  });
}

// Backward compatibility - keep the old function name as an alias
/** @deprecated Use applyLayoutToColumnGroup instead */
export function applyLayoutToRow(
  rowElement: HTMLElement,
  layout: string
): void {
  applyLayoutToColumnGroup(rowElement, layout);
}
