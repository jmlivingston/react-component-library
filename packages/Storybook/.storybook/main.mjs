import { createComponentStorybookConfig } from "../../../scripts/storybookConfig.js";

export default createComponentStorybookConfig([
  "../../*/src/**/*.stories.jsx",
  "!../../Storybook/src/**/*.stories.jsx",
]);
