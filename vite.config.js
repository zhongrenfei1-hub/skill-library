import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const REPO_BASE = process.env.VITE_BASE || '/skill-library/';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? REPO_BASE : '/',
  server: { port: 5173, host: true },
  resolve: {
    alias: { '@': '/src' },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor bundle — cached across deploys
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) return 'vendor-react';
            if (id.includes('marked')) return 'vendor-marked';
            return 'vendor';
          }
          // 注意:NOT chunking content/skills together — let Rollup emit one tiny chunk per md.
          // Each SkillPage view fetches only the markdown it needs.
        },
      },
    },
  },
}));
