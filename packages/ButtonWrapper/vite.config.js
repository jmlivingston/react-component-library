import { defineConfig } from 'vite';
import { createComponentViteConfig } from '../../scripts/viteConfig';

export default defineConfig(createComponentViteConfig('ButtonWrapper', import.meta.url));
