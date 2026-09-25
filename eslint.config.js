import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist/', '**/storybook-static/', '.nx/', '.agents/']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [js.configs.recommended],
  },
  {
    files: ['*.{js,mjs}', 'scripts/**/*.js', 'packages/*/vite.config.mjs', 'packages/*/.storybook/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['packages/*/src/**/*.{js,jsx}'],
    extends: [react.configs.flat.recommended, react.configs.flat['jsx-runtime'], reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-console': 'error',
      // React 19 no longer checks propTypes, so this rule would only demand dead code.
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: { globals: globals.vitest },
  },
]);
