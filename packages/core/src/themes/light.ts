import type { Theme } from "./types.js";

export const lightTheme: Theme = {
  name: "light",

  // Editor styling
  editor: {
    background: "transparent", // See-through canvas
    foreground: "#1a1a1a", // Text color
    border: "#e5e5e5", // Editor border (if any)
  },

  // Slide styling
  slide: {
    background: "#ffffff", // White cards
    border: "#e5e5e5", // Card border
    borderRadius: "12px", // Rounded corners
    shadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // Drop shadow
    marginBottom: "32px", // Space between slides
    padding: "48px", // Inner padding
  },

  // Shared/general styling
  selection: "#3b82f6", // Blue highlight
  selectionBg: "rgba(59, 130, 246, 0.1)", // Light blue background
  hover: "#f0f0f0", // Hover state
  active: "#e8e8e8", // Active state
  focus: "#3b82f6", // Focus outline
};
