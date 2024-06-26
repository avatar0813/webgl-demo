import { defineConfig } from "vite"
import UnoCSS from "unocss/vite"
import path from "path"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
