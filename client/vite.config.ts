import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8085',
      '/uploads': 'http://localhost:8085',
      '/healthz': 'http://localhost:8085',
      '/metrics': 'http://localhost:8085',
    },
  },
})
