import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

console.log('alias:', path.resolve(__dirname, 'src'))
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
