/**
 * Editor Theme System
 *
 * Provides theming for editor UI (not slide content).
 *
 * @example Built-in themes
 * ```typescript
 * import { lightTheme, darkTheme } from '@blockslides/core';
 * ```
 *
 * @example Custom theme
 * ```typescript
 * const myTheme = {
 *   name: 'custom',
 *   colors: {
 *     background: '#1e1e1e',
 *     // ... all other colors
 *   }
 * };
 * ```
 *
 * @example Extend existing theme
 * ```typescript
 * const editor = new SlideEditor({
 *   theme: {
 *     extends: 'dark',
 *     colors: {
 *       background: '#0a0a0a',  // Override only this
 *     }
 *   }
 * });
 * ```
 */

export * from "./types.js";
export * from "./light.js";
export * from "./dark.js";
export * from "./resolver.js";
