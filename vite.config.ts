import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Project site: https://nikfuz.github.io/billmint/
  base: '/billmint/',
  build: { chunkSizeWarningLimit: 1200 },
});
