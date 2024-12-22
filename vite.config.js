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

  // Optimize dependencies to ensure compatibility
  optimizeDeps: {
    include: ['axios', 'rss-parser'], // Pre-bundle dependencies for faster builds
  },

  // Build environment settings
  define: {
    'process.env': {}, // Ensure compatibility with process.env variables
  },
});
