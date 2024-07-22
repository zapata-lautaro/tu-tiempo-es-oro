// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
        entry: resolve(__dirname, 'src/background.ts'),
        name: 'background', 
        fileName: `src/background`,
        formats: ['es']
    }
  },
})