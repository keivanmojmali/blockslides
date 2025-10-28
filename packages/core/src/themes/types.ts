/**
 * Editor Theme System
 *
 * Defines the styling system for both editor and slides.
 * Single unified theme that controls all visual aspects.
 */

/**
 * Complete theme definition
 */
export interface Theme {
  name: string;

  // Editor-specific properties (canvas/container)
  editor: {
    background: string; // Editor canvas background (transparent for see-through)
    foreground: string; // Default text color
    border: string; // Editor container border
  };

  // Slide-specific properties (the white cards)
  slide: {
    background: string; // Slide card background
    border: string; // Slide card border
    borderRadius: string; // Rounded corners
    shadow: string; // Drop shadow
    marginBottom: string; // Space between slides
    padding: string; // Inner content padding
    minHeight: string; // Minimum slide height
  };

  // General/shared properties (apply to both editor and slides)
  selection: string; // Selection highlight color
  selectionBg: string; // Selection background
  hover: string; // Hover state
  active: string; // Active/pressed state
  focus: string; // Focus outline color
}

/**
 * Resolved theme type (can be null if no theme should be applied)
 */
export type ResolvedTheme = Theme | null;

/**
 * Partial theme for extending/overriding built-in themes
 */
export type PartialTheme = {
  name?: string;
  editor?: Partial<Theme["editor"]>;
  slide?: Partial<Theme["slide"]>;
  selection?: string;
  selectionBg?: string;
  hover?: string;
  active?: string;
  focus?: string;
};

/**
 * Theme configuration with optional extension
 */
export type ThemeConfig = PartialTheme & {
  extends?: string;
};

/**
 * Union type for all theme input options
 */
export type ThemeInput = string | Theme | ThemeConfig | undefined;
