// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  root: 'client',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5001', // forward /api requests to Express server
    },
    historyApiFallback: true, //fallback to index.html for SPA routes
  },
})