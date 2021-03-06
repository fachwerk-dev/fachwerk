import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import postcss from "./postcss.config";

export default defineConfig({
  plugins: [vue({ reactivityTransform: true })],
  css: { postcss },
  build: {
    emptyOutDir: true,
    lib: {
      formats: ["es"],
      entry: path.resolve(__dirname, "src/lib.esm.ts"),
      name: "fachwerk",
      fileName: (format) => {
        return {
          es: "fachwerk.mjs",
        }[format];
      },
    },
    rollupOptions: {
      external: ["vue", "three"],
      output: {
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "fachwerk.css";
          return assetInfo.name;
        },
      },
    },
  },
});
