import { defineConfig } from 'vite';
import { createComponentViteConfig } from '../../scripts/viteConfig.js';

export default defineConfig(createComponentViteConfig('Card', import.meta.url));
