export default {
  stories: ["../src/**/*.stories.jsx"],
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
