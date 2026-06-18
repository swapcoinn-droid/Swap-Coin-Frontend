import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
    restoreMocks: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://coin-swap-backend-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
