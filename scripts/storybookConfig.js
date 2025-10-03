/**
 * Shared Storybook configuration
 * This config is used across all component-specific and centralized Storybook instances
 */

export const sharedStorybookConfig = {
  addons: ["@storybook/addon-docs", "@storybook/addon-links"],
  framework: "@storybook/react-vite",
  async viteFinal(config) {
    return {
      ...config,
      esbuild: {
        ...config.esbuild,
        jsx: "automatic",
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
