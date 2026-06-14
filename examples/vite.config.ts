import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// Examples / documentation site.
// Consumes the library straight from source via the `@` alias (and `gofi-ui`),
// so the docs always reflect the current components without a build step.
// `base` is set for GitHub Pages project hosting: https://<user>.github.io/gofi-ui/
export default defineConfig({
  base: process.env.PAGES_BASE ?? '/gofi-ui/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url)),
      'gofi-ui': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
});
