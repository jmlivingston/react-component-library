import { defineConfig } from 'vite';
import { createComponentViteConfig } from '../../scripts/viteConfig.js';

export default defineConfig(createComponentViteConfig('Foo', import.meta.url));
