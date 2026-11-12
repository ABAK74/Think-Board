import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendProxy = {
  '/api': {
    target: 'https://thinkboard.codewithmmd.ir',
    changeOrigin: true,
    secure: true,
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: backendProxy,
  },
  preview: {
    proxy: backendProxy,
  },
});
