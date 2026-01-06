import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../client/src"),
    },
  },
  server: {
    port: 5174,
  }, // Share CSS processing with client
  css: {
    postcss: path.resolve(__dirname, "../client/postcss.config.js"),
  },
});
