import { defineConfig } from 'vite';
import { createComponentViteConfig } from '../../scripts/viteConfig.js';

const config = createComponentViteConfig('Foo', import.meta.url);

export default defineConfig(config);
