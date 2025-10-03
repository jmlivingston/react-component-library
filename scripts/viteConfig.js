import react from '@vitejs/plugin-react';
import { copyFileSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/**
 * Shared React plugin configuration
 */
export const reactPlugin = react({
  jsxRuntime: 'automatic',
});

/**
 * Shared CSS preprocessor configuration
 */
export const cssConfig = {
  preprocessorOptions: {
    scss: {},
  },
};

/**
 * Create a Vite plugin to copy package.json to the dist folder
 * @param {string} componentName - Name of the component (e.g., "Button", "Card")
 * @param {string} packageDir - Directory path of the package
 * @returns {Object} Vite plugin
 */
export function createCopyPackageJsonPlugin(componentName, packageDir) {
  return {
    name: 'copy-package-json',
    closeBundle() {
      copyFileSync(
        resolve(packageDir, 'package.json'),
        resolve(packageDir, `../../dist/packages/${componentName}/package.json`)
      );
    },
  };
}

/**
 * Create a library build configuration for a component
 * @param {string} componentName - Name of the component (e.g., "Button", "Card")
 * @param {string} packageDir - Directory path of the package (use import.meta.url)
 * @returns {Object} Vite build configuration
 */
export function createComponentBuildConfig(componentName, packageDir) {
  const __dirname = dirname(fileURLToPath(packageDir));

  // Read peerDependencies from package.json
  const packageJsonPath = resolve(__dirname, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const peerDeps = Object.keys(packageJson.peerDependencies || {});

  return {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: componentName,
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: peerDeps,
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    outDir: `../../dist/packages/${componentName}`,
    emptyOutDir: true,
  };
}

/**
 * Create a complete Vite config for a component package
 * @param {string} componentName - Name of the component (e.g., "Button", "Card")
 * @param {string} packageUrl - import.meta.url of the calling vite.config.js
 * @returns {Object} Complete Vite configuration
 */
export function createComponentViteConfig(componentName, packageUrl) {
  const __dirname = dirname(fileURLToPath(packageUrl));

  return {
    plugins: [reactPlugin, createCopyPackageJsonPlugin(componentName, __dirname)],
    build: createComponentBuildConfig(componentName, packageUrl),
    css: cssConfig,
  };
}
