import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
  port: 5173,
  // CRITICAL FIX: Allow the new Cloudflare Tunnel URL
  allowedHosts: ['respiratory-bias-essentials-hydraulic.trycloudflare.com', 'localhost', '127.0.0.1'] 
}
})