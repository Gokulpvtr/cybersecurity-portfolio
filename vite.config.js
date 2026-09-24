import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' makes the built site work on any static host
// (Vercel, Netlify, GitHub Pages, or opening from a subfolder).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1600 },
})
