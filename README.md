# React Component Library

A monorepo component library built with React, Vite, Storybook, and NX.

## Getting Started

### Installation

```bash
yarn install
```

## Available Scripts

### Build

Build components and/or Storybook static site.

**Interactive Mode:**

```bash
yarn build
```

This will present an interactive prompt where you can select:

- **All** - Builds all components (Button, Card) and Storybook
- **Button** - Builds only the Button component
- **Card** - Builds only the Card component
- **Storybook** - Builds the static Storybook site

**Direct Mode:**

> Note: Component names not case sensitive.

```bash
yarn build All          # Build all components and Storybook
yarn build Button       # Build only Button
yarn build button       # Build only button
yarn build Storybook    # Build only Storybook static site
```

**Build Output:**

- Components: `packages/<ComponentName>/lib/`
- Storybook: `dist/packages/Storybook/`

Each component package includes:

- `index.js` (CommonJS)
- `index.mjs` (ES Modules)
- `<component>.css` (Styles)
- `package.json` (Package metadata)

### Storybook (Debugging)

Run Storybook development server to view and interact with components.

**Interactive Mode:**

```bash
yarn storybook
```

This will present an interactive prompt where you can select:

- **All** - Runs Storybook with all components
- **Button** - Runs Storybook for Button only (port 6006)
- **Card** - Runs Storybook for Card only (port 6006)

**Direct Mode:**

> Note: Component names not case sensitive.

```bash
yarn storybook All      # All components (port 6006)
yarn storybook Button   # Button only (port 6006)
yarn storybook button   # Button only (port 6006)
yarn storybook Card     # Card only (port 6006)
```

### Linting

Lint JavaScript/JSX files with ESLint or SCSS files with Stylelint.

> Note: Component names not case sensitive.

**ESLint:**

```bash
yarn lint              # Interactive prompt to select component/scripts/all
yarn lint All          # Lint all components and scripts
yarn lint Button       # Lint Button component only
yarn lint Scripts      # Lint scripts only
yarn lint --fix        # Auto-fix issues
yarn lint-watch        # Watch mode - auto-fixes files as you edit them
```

**Stylelint:**

```bash
yarn lint:styles        # Interactive prompt to select component/all
yarn lint:styles All    # Lint all component styles
yarn lint:styles Button # Lint Button component styles only
yarn lint:styles --fix  # Auto-fix issues
yarn lint-watch:styles  # Watch mode - auto-fixes styles as you edit them
```

### Testing

Run tests with Vitest.

```bash
yarn test              # Interactive prompt to select component/all
yarn test All          # Run all tests
yarn test Button       # Run Button tests only
yarn test-watch        # Watch mode - runs tests as you edit
yarn test-watch Button # Watch mode for specific component
```

### Other Commands

```bash
yarn format           # Format all files with Prettier
yarn clear-cache      # Clear NX cache
yarn clear-build      # Remove all build outputs (packages/*/lib)
yarn create-package   # Create a new component package from template
yarn sync-peer-deps   # Sync peerDependencies versions from root package.json
```

## Project Structure

```
react-component-library/
├── packages/
│   ├── Button/           # Button component
│   │   ├── .storybook/   # Button-specific Storybook config
│   │   ├── src/
│   │   ├── lib/          # Build output (generated)
│   │   ├── package.json
│   │   ├── project.json
│   │   └── vite.config.js
│   ├── Card/             # Card component
│   │   ├── .storybook/   # Card-specific Storybook config
│   │   ├── src/
│   │   ├── lib/          # Build output (generated)
│   │   ├── package.json
│   │   ├── project.json
│   │   └── vite.config.js
│   └── Storybook/        # Centralized Storybook
│       ├── .storybook/   # Main Storybook config
│       ├── package.json
│       └── project.json
├── scripts/              # Build and utility scripts
│   ├── build.js
│   ├── storybook.js
│   └── utils.js
├── dist/                 # Storybook build output (generated)
└── package.json
```

## Features

- ✅ **Automatic JSX Runtime** - No need to import React in component files
- ✅ **NX Monorepo** - Efficient build caching and task orchestration
- ✅ **Vite** - Fast builds and HMR
- ✅ **Storybook** - Component documentation and development
- ✅ **Interactive CLI** - Built with inquirer for better DX
- ✅ **Dynamic Package Discovery** - Automatically detects new components
- ✅ **Multiple Build Formats** - ESM and CommonJS outputs

## Adding New Components

1. Create a new directory in `packages/`
2. Add component files and configuration (use Button or Card as a template)
3. The build and storybook scripts will automatically detect the new component

No need to update any scripts - they dynamically read from the packages directory!

## Local Development with yarn link

To test components in another project locally:

**1. Build and link all packages:**

```bash
yarn build
yarn link-all
```

**2. In your other project, link the packages you need:**

```bash
yarn link @react-component-library/button
yarn link @react-component-library/card
```

**3. After making changes, rebuild to see updates:**

```bash
yarn build
```

**4. When done, unlink:**

```bash
# In your other project
yarn unlink @react-component-library/button

# In this project
yarn unlink-all
```

## Publishing

Each component is built as a standalone package ready for npm publishing:

```bash
yarn build <component>
cd packages/<ComponentName>/lib
npm publish  # or yarn publish
```
