import react from '@vitejs/plugin-react';
import { copyFileSync, readFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { findComponentPackage, listComponentPackages } from './packageInfo.js';

/**
 * Create the Vite config for a component package
 * @param {string} packageUrl - import.meta.url of the calling vite.config.mjs
 */
export function createComponentViteConfig(packageUrl) {
  const packageDir = dirname(fileURLToPath(packageUrl));
  const root = resolve(packageDir, '../..');
  const pkg = findComponentPackage(basename(packageDir), { root });
  if (!pkg) {
    throw new Error(`No component package found at ${packageDir}`);
  }
  const packageJson = JSON.parse(readFileSync(resolve(packageDir, 'package.json'), 'utf-8'));
  const peerDeps = Object.keys(packageJson.peerDependencies ?? {});

  return {
    plugins: [
      react(),
      {
        name: 'copy-package-json',
        closeBundle() {
          copyFileSync(resolve(packageDir, 'package.json'), resolve(pkg.distDir, 'package.json'));
        },
      },
    ],
    build: {
      sourcemap: true,
      lib: {
        entry: pkg.sourceEntry,
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
        formats: ['es', 'cjs'],
      },
      rolldownOptions: {
        // Subpaths such as react/jsx-runtime must stay external too, or React gets bundled.
        external: (id) => peerDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      },
      outDir: pkg.distDir,
      emptyOutDir: true,
    },
    // Alias sibling packages to their source so tests don't require a prior build/link
    resolve: process.env.VITEST
      ? { alias: Object.fromEntries(listComponentPackages({ root }).map((p) => [p.npmName, p.sourceEntry])) }
      : undefined,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: [fileURLToPath(new URL('./vitestSetup.js', import.meta.url))],
    },
  };
}
