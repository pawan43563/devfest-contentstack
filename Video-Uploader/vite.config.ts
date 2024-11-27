import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "chromeextension.js", // Ensure static file names
        chunkFileNames: "chromeextension.js",
        assetFileNames: "chromeextension.css",
      },
    },
  },
});
