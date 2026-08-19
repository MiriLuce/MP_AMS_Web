import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Path alias configuration
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // Proxy configuration for API requests
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5121',
        changeOrigin: true,
      },
    },
  },
})
