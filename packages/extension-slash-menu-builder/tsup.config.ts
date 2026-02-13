import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/styles.css'],
  tsconfig: '../../tsconfig.build.json',
  outDir: 'dist',
  dts: true,
  clean: true,
  sourcemap: true,
  format: ['esm', 'cjs'],
})
