// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // No need to set 'publicDir' as it defaults to 'public'
  // publicDir: 'public',

  server: {
    open: true, // Opens the browser when the server starts
    port: 3000, // Development server port
  },

  build: {
    outDir: 'dist', // Output directory for the build
    assetsDir: 'assets', // Directory for assets within 'dist'
    rollupOptions: {
      // Customize Rollup options if needed
      // Example: Externalize dependencies
      // external: ['some-external-dependency'],
    },
    sourcemap: false, // Disable source maps for production
  },

  // Define aliases for easier imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Add more aliases if needed
    },
  },
});
