import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Forward /api requests to the Express server, so the browser only
    // ever talks to Vite (same origin) and CORS never comes into play
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
