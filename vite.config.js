import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Root user site: base should be '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})