import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/slide.css"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  loader: {
    ".css": "copy",
  },
});
