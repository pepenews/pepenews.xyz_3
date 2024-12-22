import { defineConfig } from 'vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/articles/**/*', // Copies articles folder
          dest: 'articles', // Keeps it available after build
        },
      ],
    }),
  ],

  server: {
    open: true, // Opens browser
    port: 3000, // Dev server port
  },

  build: {
    outDir: 'dist', // Build directory
    assetsDir: 'assets', // Asset folder
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    sourcemap: false,
    emptyOutDir: true, // Clears old files before build
    copyPublicDir: true, // Ensures public files are copied
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
