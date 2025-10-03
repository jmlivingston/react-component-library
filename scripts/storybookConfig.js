/**
 * Shared Storybook configuration
 * This config is used across all component-specific and centralized Storybook instances
 */

import { readdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Generate aliases for all component packages
function generatePackageAliases() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const packagesDir = resolve(scriptDir, '../packages');
  const packages = readdirSync(packagesDir, { withFileTypes: true }).filter(
    (dirent) => dirent.isDirectory() && dirent.name !== 'Storybook'
  );

  const aliases = {};

  for (const pkg of packages) {
    const packageJsonPath = resolve(packagesDir, pkg.name, 'package.json');
    const projectJsonPath = resolve(packagesDir, pkg.name, 'project.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const projectJson = JSON.parse(readFileSync(projectJsonPath, 'utf-8'));
    const indexPath = new URL(`../${projectJson.sourceRoot}/index.js`, import.meta.url).pathname;
    aliases[packageJson.name] = indexPath;
  }

  return aliases;
}

export const sharedStorybookConfig = {
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: undefined,
      },
    },
  },
  async viteFinal(config) {
    return {
      ...config,
      esbuild: {
        ...config.esbuild,
        jsx: 'automatic',
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          ...generatePackageAliases(),
        },
      },
    };
  },
};

/**
 * Create a Storybook config for a single component
 * @param {string[]} stories - Array of story glob patterns
 * @returns {Object} Storybook configuration
 */
export function createComponentStorybookConfig(stories) {
  return {
    stories,
    ...sharedStorybookConfig,
  };
}
