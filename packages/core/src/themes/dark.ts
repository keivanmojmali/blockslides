import type { Theme } from "./types.js";

export const darkTheme: Theme = {
  name: "dark",

  // Editor styling
  editor: {
    background: "transparent", // See-through canvas
    foreground: "#ffffff", // White text
    border: "#3e3e3e", // Dark border
  },

  // Slide styling
  slide: {
    background: "#1e1e1e", // Dark gray cards
    border: "#3e3e3e", // Subtle border
    borderRadius: "12px", // Rounded corners
    shadow: "0 4px 12px rgba(0, 0, 0, 0.4)", // Stronger shadow for dark
    marginBottom: "32px", // Space between slides
    padding: "48px", // Inner padding
  },

  // Shared/general styling
  selection: "#3b82f6", // Blue highlight
  selectionBg: "rgba(59, 130, 246, 0.2)", // Slightly more visible on dark
  hover: "#2d2d2d", // Hover state
  active: "#3d3d3d", // Active state
  focus: "#3b82f6", // Focus outline
};
