import { defineConfig } from 'vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/articles/**/*', // Copy all articles
          dest: 'articles',
        },
        {
          src: 'src/css/styles.css', // Explicitly include styles.css
          dest: 'css',
        },
      ],
    }),
  ],

  server: {
    open: true,
    port: 3000,
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    sourcemap: false,
    emptyOutDir: true,
    copyPublicDir: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  optimizeDeps: {
    include: ['axios', 'rss-parser'],
  },

  define: {
    'process.env': {},
  },
});
