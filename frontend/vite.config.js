import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // React application running.
    proxy: { // redirect API calls during development.
      '/api': { // This is the path that will be proxied.
        target: 'http://localhost:5000', // backend server running.
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
