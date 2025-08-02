import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  esbuildOptions(options) {
    options.alias = {
      '@': './src'
    }
  }
}) 