
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],

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
