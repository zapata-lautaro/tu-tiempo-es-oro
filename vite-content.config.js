// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
        entry: resolve(__dirname, 'src/content.ts'),
        name: 'Content', 
        fileName: `src/content`,
        formats: ['es']
    }
  },
})