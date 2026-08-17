import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: '0.0.0.0',
    port: 5173,

    proxy: {
      '/api': {
        target: 'http://192.168.4.58:3005',
        changeOrigin: true,

        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('[VITE PROXY]', req.method, req.url, '→', proxyReq.path);
          });
        },
      },
    },
  },
});
