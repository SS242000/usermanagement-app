import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Ensure this matches your folder structure
    },
  },
  server: {
    port: 5173, // Ensure the development server is running on the correct port
    open: true, // Automatically open the browser
  },
})