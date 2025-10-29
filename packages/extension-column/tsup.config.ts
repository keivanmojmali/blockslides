import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/column.css"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  loader: {
    ".css": "copy",
  },
});
