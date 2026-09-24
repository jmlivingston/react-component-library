/**
 * Shared Storybook configuration
 * This config is used across all component-specific and centralized Storybook instances
 */

import { generatePackageAliases } from './utils.js';

// Single source of truth for the Storybook dev server port, used for both "all" and per-component runs
export const STORYBOOK_PORT = 4000;

export const sharedStorybookConfig = {
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
  },
  async viteFinal(config) {
    return {
      ...config,
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
