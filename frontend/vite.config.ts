import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { analyzer } from 'vite-bundle-analyzer'
import path from "path";

export default defineConfig({
  plugins: [react(), analyzer()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
