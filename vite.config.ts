import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const DEV_PROXY_TARGET = process.env.VITE_DEV_PROXY_TARGET ?? 'http://localhost:8000';

export default defineConfig(() => ({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: DEV_PROXY_TARGET,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}));
