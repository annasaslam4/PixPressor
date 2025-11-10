import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ✅ Fixed alias config for "@/..." imports (Vercel compatible)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [], // ensures all dependencies are bundled
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
