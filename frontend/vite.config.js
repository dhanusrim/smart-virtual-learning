import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: '/smart-virtual-learning/',
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})