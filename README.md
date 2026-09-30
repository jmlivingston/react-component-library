# React Component Library

A monorepo component library built with React, Vite, Storybook, and NX.

## Getting Started

### Installation

```bash
npm install
```

## Available Scripts

### Build

Build all projects with a build target, including components and Storybook:

```bash
npm run build
```

**Build Output:**

- Components: `dist/packages/<ComponentName>/`
- Storybook: `dist/packages/Storybook/`

Each component package includes:

- `index.js` (CommonJS)
- `index.mjs` (ES Modules)
- `<component>.css` (Styles)
- `package.json` (Package metadata)

### Storybook

Start the Storybook development server:

```bash
npm run start
```

### Test

Run all Nx test targets or a single package's tests:

```bash
npm test
npm test button
```

Run the scripts test suite directly with `npx vitest run --config scripts/vitest.config.js`.

### Lint

Run ESLint with the recommended JavaScript, React and React Hooks rules. `console` calls are errors in component code.

Run all Nx lint targets or a single package:

```bash
npm run lint
npm run lint button
```

## Project Structure

```
react-component-library/
├── packages/
│   ├── Button/            # Component package
│   ├── Card/              # Component package
│   ├── Foo/               # Component package
│   └── Storybook/          # Storybook application
├── scripts/               # Build and utility scripts
├── dist/                 # Build output (generated)
└── package.json
```

## Features

- ✅ **Automatic JSX Runtime** - No need to import React in component files
- ✅ **NX Monorepo** - Efficient build caching and task orchestration
- ✅ **Vite** - Fast builds and HMR
- ✅ **Storybook** - Component documentation and development
- ✅ **Dynamic Package Discovery** - Automatically detects new components
- ✅ **Multiple Build Formats** - ESM and CommonJS outputs

## Adding New Components

Generate a component package with the workspace Nx generator:

```bash
npm run create -- --name=MyComponent
# or: npx nx generate react-component-library:component --name=MyComponent
```

Omit `--name` to be prompted. Names must be PascalCase; the generator creates
the component, styles, test, story, package metadata, and Nx configuration.

No need to update any scripts - they dynamically read from the packages directory!

## Debugging in Another Project

Install the built package in the consuming project, then watch and rebuild it here:

```bash
# In this repo
npx nx run button:build

# In the consuming project
npm install ../react-component-library/dist/packages/Button

# In this repo; keep running while developing
npx nx watch --projects=button -- nx run button:build
```

## Publishing

Each component is built as a standalone package ready for npm publishing:

```bash
npm run build
cd dist/packages/Button
npm publish
```
