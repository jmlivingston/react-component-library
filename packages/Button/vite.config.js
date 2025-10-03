import { defineConfig } from 'vite';
import { createComponentViteConfig } from '../../scripts/viteConfig';

export default defineConfig(createComponentViteConfig('Button', import.meta.url));
