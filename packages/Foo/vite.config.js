import { defineConfig } from 'vite';
import { createComponentViteConfig } from '../../scripts/viteConfig';

const config = createComponentViteConfig('Foo', import.meta.url);

export default defineConfig(config);
