# Keep per-package config files; trim them rather than remove them

Every Component package keeps its own `project.json`, `vite.config.mjs` and `.storybook/main.mjs`. Nx's `@nx/vite` and `@nx/storybook` plugins only infer a package's `build` and `storybook` targets when those files exist, and `scripts/packageInfo.js` reads each Package's identity (`name`, `projectType`, `sourceRoot`) from `project.json`. We trimmed the files instead: `project.json` holds only identity, shared release settings live in `nx.json`, and the other two files are one-call shims.

## Considered Options

- **A custom Nx plugin in the repo that infers targets for every `packages/*`**: rejected. It would remove about 7 lines per package but add a plugin module to maintain, and make it harder to see where a target comes from.
- **Drop `project.json` and register Packages through npm workspaces (`"workspaces": ["packages/*"]`)**: rejected. It changes `npm install` behaviour (sibling Packages get linked into `node_modules`) and `scripts/packageInfo.js` would have to read identity from somewhere else.
