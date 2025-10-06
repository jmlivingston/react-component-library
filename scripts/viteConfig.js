import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/**
 * Generate Vite aliases for all component packages
 * Returns an object mapping package names to their src/index.js entry
 */
export const generatePackageAliases = () => {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const packagesDir = resolve(scriptDir, '../packages');
  const packages = readdirSync(packagesDir, { withFileTypes: true });

  return packages.reduce((aliases, dirent) => {
    if (!dirent.isDirectory() || dirent.name === 'Storybook') {
      return aliases;
    }
    const packageJsonPath = resolve(packagesDir, dirent.name, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const indexPath = resolve(packagesDir, dirent.name, 'src');
    return {
      ...aliases,
      [packageJson.name]: indexPath,
    };
  }, {});
};

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
    writeBundle() {
      const libDir = resolve(packageDir, 'lib');
      mkdirSync(libDir, { recursive: true });
      copyFileSync(resolve(packageDir, 'package.json'), resolve(libDir, 'package.json'));
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
      entry: resolve(dirName, 'src/index'),
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
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return `${componentName}.css`;
          }
          return assetInfo.name;
        },
      },
    },
    outDir: resolve(dirName, 'lib'),
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
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['../../vitest.setup.js'],
    },
    resolve: {
      alias: generatePackageAliases(),
    },
  };
};
