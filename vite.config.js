import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: './build',
    rollupOptions: {
      input: {
        app: 'src/main.js', // Your JavaScript/TypeScript entry file
        index: 'public/index.html', // Your HTML file
      },
    },
  },
});
