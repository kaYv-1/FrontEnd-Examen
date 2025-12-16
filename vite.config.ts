import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@hooks': '/src/hooks',
      '@store': '/src/store',
      '@types': '/src/types',
      '@utils': '/src/utils',
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
