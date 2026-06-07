import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  // Custom domain — base is root
  base: '/',

  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],

  build: {
    // Target modern browsers for smaller, faster bundles
    target: 'es2020',

    // Enable CSS code-splitting for better caching
    cssCodeSplit: true,

    // Raise chunk warning limit (three.js is large by design)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunk splitting — function form required by Rolldown
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) return 'vendor-charts';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('react-router') || id.includes('react-dom') || (id.includes('/react/') && !id.includes('react-hook'))) return 'vendor-react';
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) return 'vendor-forms';
          }
        },

        // Asset naming for long-term caching
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split('.').pop() ?? '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/.test(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/woff2?|eot|ttf|otf/.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },

  // Optimise deps pre-bundling for faster dev server cold start
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    exclude: ['three', 'gsap'],
  },
});
