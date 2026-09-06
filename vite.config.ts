import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ValloxIvCard',
      formats: ['es'],
      fileName: () => 'vallox-iv-card.js',
    },
    rollupOptions: {
      // Don't externalize anything - bundle everything into single file
      external: [],
    },
    outDir: mode === 'ha-preview' ? '.cache/ha-preview' : 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console.info for version logging
      },
    },
  },
  define: {
    __VALLOX_PREVIEW__: JSON.stringify(mode === 'ha-preview'),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
}));
