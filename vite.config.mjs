import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { metadataPlugin } from './scripts/site-metadata.mjs';

export default defineConfig({
  plugins: [react(), metadataPlugin()],
  base: '/',
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: process.env.BUILD_PATH || 'build',
  },
});
