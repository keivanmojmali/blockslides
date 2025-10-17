import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    dts: true,
    clean: true,
    sourcemap: true,
    format: ['esm', 'cjs'],
  },
  {
    entry: ['src/jsx-runtime.ts'],
    outDir: 'dist/jsx-runtime',
    dts: true,
    sourcemap: true,
    format: ['esm', 'cjs'],
  },
]);
