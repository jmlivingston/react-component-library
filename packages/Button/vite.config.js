import { defineConfig } from "vite";
import { createComponentViteConfig } from "../../scripts/viteConfig.js";

export default defineConfig(createComponentViteConfig("Button", import.meta.url));
