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
```bash
yarn build All          # Build all components and Storybook
yarn build Button       # Build only Button
yarn build Card         # Build only Card
yarn build Storybook    # Build only Storybook static site
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

Run Storybook development server to view and interact with components.

**Interactive Mode:**
```bash
yarn storybook
```
This will present an interactive prompt where you can select:
- **All** - Runs Storybook with all components
- **Button** - Runs Storybook for Button only (port 6006)
- **Card** - Runs Storybook for Card only (port 6007)

**Direct Mode:**
```bash
yarn storybook All      # All components (port 6006)
yarn storybook Button   # Button only (port 6006)
yarn storybook Card     # Card only (port 6007)
```

## Project Structure

```
react-component-library/
├── packages/
│   ├── Button/           # Button component
│   │   ├── .storybook/   # Button-specific Storybook config
│   │   ├── src/
│   │   ├── package.json
│   │   ├── project.json
│   │   └── vite.config.js
│   ├── Card/             # Card component
│   │   ├── .storybook/   # Card-specific Storybook config
│   │   ├── src/
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
├── dist/                 # Build output (generated)
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

## Publishing

Each component is built as a standalone package ready for npm publishing:

```bash
yarn build <component>
cd dist/packages/<ComponentName>
npm publish  # or yarn publish
```
