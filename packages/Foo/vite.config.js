import { defineConfig } from 'vite';
import { createComponentViteConfig } from '../../scripts/viteConfig.js';

const config = createComponentViteConfig('Foo', import.meta.url);

// Add Button as an external dependency
config.build.rollupOptions.external.push('@react-component-library/button');

export default defineConfig(config);
