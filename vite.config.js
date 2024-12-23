import { defineConfig } from 'vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/articles/**/*', // Copies articles folder to dist/articles
          dest: 'articles', // Keeps it available after build
        },
        {
          src: 'src/js/previews.js', // Ensures previews.js is copied to dist/js
          dest: 'js',
        },
        {
          src: 'src/css/styles.css', // Ensures styles.css is copied to dist/css
          dest: 'css',
        },
      ],
    }),
  ],

  server: {
    open: true, // Automatically open browser on server start
    port: 3000, // Development server port
  },

  build: {
    outDir: 'dist', // Output directory for build
    assetsDir: 'assets', // Directory for static assets
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // Entry point
      },
    },
    sourcemap: false, // Disable source maps for production
    emptyOutDir: true, // Clears old files in the dist folder before build
    copyPublicDir: true, // Ensures files in public/ are copied to dist/
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for cleaner imports
    },
  },

  optimizeDeps: {
    include: ['axios', 'rss-parser'], // Pre-bundle dependencies for faster builds
  },

  define: {
    'process.env': {}, // Ensure compatibility with process.env variables
  },

  // Add clear debugging messages for the build process
  logLevel: 'info', // Shows more detailed logs during the build process
});
