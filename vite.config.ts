import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "#": path.resolve(__dirname, "./src/components"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const p = id.split('node_modules/')[1].split(path.sep);
            const name = p[0].startsWith('@') ? `${p[0]}_${p[1]}` : p[0];
            return `vendor_${name.replace(/[@/]/g, '_')}`;
          }
        },
      },
    },
  },
});
