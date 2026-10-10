import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/countries/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          query: ['@tanstack/react-query'],
          data: ['src/data/nptData.ts', 'src/data/taxData.ts', 'src/data/sovereigntyData.ts'],
        },
      },
    },
  },
});
