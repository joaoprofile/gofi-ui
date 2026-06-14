import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';

// Library build. Emits ESM + type declarations to ./dist.
// The CSS bundle (dist/gofi-ui.css) is produced separately by `build:css`
// (the Tailwind CLI), so it ships every utility the components use without
// requiring Tailwind in the consumer's project.
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.*'],
      rollupTypes: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        charts: fileURLToPath(new URL('./src/components/Charts/index.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    sourcemap: true,
    rollupOptions: {
      // Keep peers and runtime deps external — consumers install them.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'recharts',
        'lucide-react',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
      ],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        preserveModulesRoot: 'src',
      },
    },
  },
});
