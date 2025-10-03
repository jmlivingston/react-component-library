import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync } from "fs";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    {
      name: "copy-package-json",
      closeBundle() {
        copyFileSync(
          resolve(__dirname, "package.json"),
          resolve(__dirname, "../../dist/packages/Button/package.json")
        );
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "Button",
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    outDir: "../../dist/packages/Button",
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
});
