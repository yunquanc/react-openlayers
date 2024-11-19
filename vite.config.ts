import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // 开发环境
    proxy: {
      "/api": {
        target: "https://digitization-gateway-test.gwmdevops.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/socket.io": { target: "http://10.246.1.18:31430", ws: true },
    },
  },
});
