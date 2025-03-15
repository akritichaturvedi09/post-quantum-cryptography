import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import polyfillNode from "rollup-plugin-polyfill-node";

export default defineConfig({
  plugins: [react(), polyfillNode()],
  define: {
    global: "globalThis",
     // Define process to avoid errors
  },
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      process: "process/browser",
    },
  },
  
});
