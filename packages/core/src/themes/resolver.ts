import { lightTheme } from "./light.js";
import { darkTheme } from "./dark.js";
import type { Theme, ThemeInput, ThemeConfig, ResolvedTheme } from "./types.js";

/**
 * Built-in themes registry
 */
const BUILT_IN_THEMES: Record<string, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

/**
 * Deep merge two objects, preferring values from source
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key] as any, source[key] as any);
    } else if (source[key] !== undefined) {
      result[key] = source[key] as any;
    }
  }

  return result;
}

/**
 * Check if theme object is a partial theme (missing required properties)
 */
function isPartialTheme(theme: any): boolean {
  // Check if editor properties are complete
  if (
    !theme.editor ||
    !theme.editor.background ||
    !theme.editor.foreground ||
    !theme.editor.border
  ) {
    return true;
  }

  // Check if slide properties are complete
  if (
    !theme.slide ||
    !theme.slide.background ||
    !theme.slide.border ||
    !theme.slide.borderRadius ||
    !theme.slide.shadow ||
    !theme.slide.marginBottom ||
    !theme.slide.padding
  ) {
    return true;
  }

  // Check if shared properties are complete
  if (
    !theme.selection ||
    !theme.selectionBg ||
    !theme.hover ||
    !theme.active ||
    !theme.focus
  ) {
    return true;
  }

  return false;
}

/**
 * Resolve theme from various input formats
 *
 * Handles:
 * - String references to built-in themes ('light', 'dark')
 * - Full custom theme objects
 * - Partial themes that extend built-in themes
 * - Undefined/invalid (returns null - no theme applied)
 *
 * @param themeInput - Theme configuration
 * @returns Resolved complete theme or null if no theme should be applied
 */
export function resolveTheme(themeInput: ThemeInput): ResolvedTheme {
  // No theme provided - don't apply any theme
  if (!themeInput) {
    return null;
  }

  // String reference to built-in theme
  if (typeof themeInput === "string") {
    const builtIn = BUILT_IN_THEMES[themeInput];
    if (!builtIn) {
      console.warn(
        `[BlockSlides] Theme "${themeInput}" not found. No theme will be applied.`
      );
      return null;
    }
    return builtIn;
  }

  // Full custom theme (has all required properties)
  if (
    "editor" in themeInput &&
    "slide" in themeInput &&
    !isPartialTheme(themeInput)
  ) {
    return themeInput as Theme;
  }

  // Partial theme - merge with base theme
  const config = themeInput as ThemeConfig;
  const baseThemeName = config.extends || "light";
  const baseTheme = BUILT_IN_THEMES[baseThemeName];

  if (!baseTheme) {
    console.warn(
      `[BlockSlides] Base theme "${baseThemeName}" not found. No theme will be applied.`
    );
    return null;
  }

  return deepMerge(baseTheme, themeInput as Partial<Theme>);
}

/**
 * Apply theme to DOM element using CSS custom properties
 *
 * Sets CSS variables on the element that can be used by stylesheets.
 * Also sets a data-theme attribute for additional CSS targeting.
 * If theme is null, removes all theme-related attributes and CSS variables.
 *
 * @param theme - Resolved theme to apply (or null to remove theme)
 * @param element - DOM element to apply theme to
 */
export function applyTheme(theme: ResolvedTheme, element: HTMLElement): void {
  // No theme - remove theme attributes and CSS variables
  if (!theme) {
    element.removeAttribute("data-theme");
    element.style.removeProperty("--editor-bg");
    element.style.removeProperty("--editor-fg");
    element.style.removeProperty("--editor-border");
    element.style.removeProperty("--editor-selection");
    element.style.removeProperty("--editor-selection-bg");
    element.style.removeProperty("--editor-hover");
    element.style.removeProperty("--editor-active");
    element.style.removeProperty("--editor-focus");
    element.style.removeProperty("--slide-bg");
    element.style.removeProperty("--slide-border");
    element.style.removeProperty("--slide-border-radius");
    element.style.removeProperty("--slide-shadow");
    element.style.removeProperty("--slide-margin-bottom");
    element.style.removeProperty("--slide-padding");
    element.style.removeProperty("--slide-min-height");
    return;
  }

  // Set data-theme attribute for CSS selectors
  element.setAttribute("data-theme", theme.name);

  // Apply CSS variables
  const { editor, slide } = theme;

  // Editor properties
  element.style.setProperty("--editor-bg", editor.background);
  element.style.setProperty("--editor-fg", editor.foreground);
  element.style.setProperty("--editor-border", editor.border);

  // Shared/general properties
  element.style.setProperty("--editor-selection", theme.selection);
  element.style.setProperty("--editor-selection-bg", theme.selectionBg);
  element.style.setProperty("--editor-hover", theme.hover);
  element.style.setProperty("--editor-active", theme.active);
  element.style.setProperty("--editor-focus", theme.focus);

  // Slide properties
  element.style.setProperty("--slide-bg", slide.background);
  element.style.setProperty("--slide-border", slide.border);
  element.style.setProperty("--slide-border-radius", slide.borderRadius);
  element.style.setProperty("--slide-shadow", slide.shadow);
  element.style.setProperty("--slide-margin-bottom", slide.marginBottom);
  element.style.setProperty("--slide-padding", slide.padding);
  if (slide.minHeight) {
    element.style.setProperty("--slide-min-height", slide.minHeight);
  }
}

/**
 * Register a custom theme globally
 *
 * Allows registering custom themes that can be referenced by string name
 *
 * @param theme - Theme to register
 */
export function registerTheme(theme: Theme): void {
  BUILT_IN_THEMES[theme.name] = theme;
}

/**
 * Get all registered theme names
 *
 * @returns Array of theme names
 */
export function getThemeNames(): string[] {
  return Object.keys(BUILT_IN_THEMES);
}

/**
 * Get a theme by name
 *
 * @param name - Theme name
 * @returns Theme if found, undefined otherwise
 */
export function getTheme(name: string): Theme | undefined {
  return BUILT_IN_THEMES[name];
}
