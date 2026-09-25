/**
 * Shared Storybook configuration
 * This config is used across all component-specific and centralized Storybook instances
 */

import { listComponentPackages } from './packageInfo.js';

// Single source of truth for the Storybook dev server port, used for both "all" and per-component runs
export const STORYBOOK_PORT = 4000;

export const sharedStorybookConfig = {
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
  },
  async viteFinal(config) {
    return {
      ...config,
      build: {
        ...config.build,
        // Storybook's own preview and docs bundles are ~1 MB; component code is a tiny fraction of that.
        chunkSizeWarningLimit: 1500,
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          ...Object.fromEntries(listComponentPackages().map((pkg) => [pkg.npmName, pkg.sourceEntry])),
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
