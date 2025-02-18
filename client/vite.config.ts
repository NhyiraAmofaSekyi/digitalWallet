import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.example.env") }); // Load env from the root .env

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.VITE_PORT || "5173"), // Read VITE_PORT
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL || "http://localhost:5249/api"),
  },

})
