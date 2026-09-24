import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  test: {
    projects: ['packages/*/vite.config.mjs'],
  },
});
