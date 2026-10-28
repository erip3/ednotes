import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../web-client/src"),
    },
  },
  server: {
    port: 5174,
  }, // Share CSS processing with client
  css: {
    postcss: path.resolve(__dirname, "./postcss.config.js"),
  },
});
