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
 * Create a Vite plugin to add sourceMappingURL to CSS files and inject CSS imports
 * Captures source maps during CSS processing and preserves them in the output
 * @param {string} packageDir - Directory path of the package
 * @returns {Object} Vite plugin
 */
export const createCssSourceMapPlugin = (packageDir) => {
  return {
    name: 'css-sourcemap-plugin',
    enforce: 'post',
    generateBundle(_options, bundle) {
      let cssFileName = null;
      let cssContent = null;

      // Find CSS assets and process them
      Object.entries(bundle).forEach(([fileName, file]) => {
        if (file.type === 'asset' && fileName.endsWith('.css')) {
          cssFileName = fileName;
          cssContent = file.source.toString();
          const mapFileName = `${fileName}.map`;

          // Find the original SCSS file
          const scssPath = resolve(packageDir, 'src', fileName.replace('.css', '.scss'));
          let scssContent = '';
          try {
            scssContent = readFileSync(scssPath, 'utf-8');
          } catch (e) {
            // SCSS file not found, use CSS as source
            scssContent = cssContent;
          }

          // Add sourceMappingURL comment to CSS
          const updatedSource = `${cssContent}\n/*# sourceMappingURL=${mapFileName} */`;
          Object.assign(file, { source: updatedSource });

          // Create source map pointing to the SCSS file
          const sourceMap = {
            version: 3,
            sources: [fileName.replace('.css', '.scss')],
            names: [],
            mappings: '',
            file: fileName,
            sourcesContent: [scssContent],
          };

          // Add the map file to the bundle
          Object.assign(bundle, {
            [mapFileName]: {
              type: 'asset',
              fileName: mapFileName,
              source: JSON.stringify(sourceMap, null, 2),
            },
          });
        }
      });

      // Inject CSS import into JS bundles
      if (cssFileName) {
        Object.entries(bundle).forEach(([fileName, file]) => {
          if (file.type === 'chunk' && (fileName.endsWith('.js') || fileName.endsWith('.mjs'))) {
            // Prepend CSS import to the bundle
            const cssImport = `import './${cssFileName}';\n`;
            const updatedFile = { ...file, code: cssImport + file.code };
            Object.assign(bundle[fileName], updatedFile);
          }
        });
      }
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
    plugins: [reactPlugin, createCopyPackageJsonPlugin(dirName), createCssSourceMapPlugin(dirName)],
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
