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
 * Create a Vite plugin to copy package.json to the lib folder
 * @param {string} packageDir - Directory path of the package
 * @returns {Object} Vite plugin
 */
export const createCopyPackageJsonPlugin = (packageDir) => {
  return {
    name: 'copy-package-json',
    closeBundle() {
      copyFileSync(resolve(packageDir, 'package.json'), resolve(packageDir, 'lib/package.json'));
    },
  };
};

/**
 * Create a library build configuration for a component
 * @param {string} componentName - Name of the component (e.g., "Button", "Card")
 * @param {string} packageDir - Directory path of the package (use import.meta.url)
 * @returns {Object} Vite build configuration
 */
export const createComponentBuildConfig = (componentName, packageDir) => {
  const dirName = dirname(fileURLToPath(packageDir));

  // Read peerDependencies from package.json
  const packageJsonPath = resolve(dirName, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const peerDeps = Object.keys(packageJson.peerDependencies || {});

  return {
    sourcemap: true,
    lib: {
      entry: resolve(dirName, 'src/index.js'),
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
    outDir: 'lib',
    emptyOutDir: true,
  };
};

/**
 * Create a complete Vite config for a component package
 * @param {string} componentName - Name of the component (e.g., "Button", "Card")
 * @param {string} packageUrl - import.meta.url of the calling vite.config.js
 * @returns {Object} Complete Vite configuration
 */
export const createComponentViteConfig = (componentName, packageUrl) => {
  const dirName = dirname(fileURLToPath(packageUrl));

  return {
    plugins: [reactPlugin, createCopyPackageJsonPlugin(dirName)],
    build: createComponentBuildConfig(componentName, packageUrl),
    css: cssConfig,
  };
};
