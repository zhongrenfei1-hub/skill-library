import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For GitHub Pages project sites: assets must be served under /<repo>/
// Set via env var so CI can override (or switch between repos).
const REPO_BASE = process.env.VITE_BASE || '/skill-library/';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? REPO_BASE : '/',
  server: { port: 5173, host: true },
  resolve: {
    alias: { '@': '/src' },
  },
}));
