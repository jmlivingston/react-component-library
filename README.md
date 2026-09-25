# React Component Library

A monorepo component library built with React, Vite, Storybook, and NX.

## Getting Started

### Installation

```bash
npm install
```

## Available Scripts

### Build

Build components and/or Storybook static site.

**Interactive Mode:**

```bash
npm run build
```

This will present an interactive prompt where you can select:

- **All** - Builds all components (Button, Card) and Storybook
- **Button** - Builds only the Button component
- **Card** - Builds only the Card component
- **Storybook** - Builds the static Storybook site

**Direct Mode:**

> Note: Not case sensitive.

```bash
npm run build All          # Build all components and Storybook
npm run build Button       # Build only Button
npm run build button       # Build only button
npm run build Storybook    # Build only Storybook static site
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
npm run start
```

This will present an interactive prompt where you can select:

- **All** - Runs Storybook with all components
- **Button** - Runs Storybook for Button only (port 4000)
- **Card** - Runs Storybook for Card only (port 4000)

**Direct Mode:**

> Note: Not case sensitive.

```bash
npm run start All      # All components (port 4000)
npm run start Button   # Button only (port 4000)
npm run start button   # Button only (port 4000)
npm run start Card     # Card only (port 4000)
```

### Test

Run the Vitest suites.

**Interactive Mode:**

```bash
npm test
```

This will present an interactive prompt where you can select:

- **All** - Runs every test suite (all components and scripts)
- **Button** - Runs the Button tests only
- **Card** - Runs the Card tests only
- **Scripts** - Runs the build script tests only

**Direct Mode:**

> Note: Not case sensitive.

```bash
npm test all       # Everything
npm test button    # Button only
npm test scripts   # Build scripts only
```

### Lint

Run ESLint with the recommended JavaScript, React and React Hooks rules. `console` calls are errors in component code.

**Interactive Mode:**

```bash
npm run lint
```

**Direct Mode:**

> Note: Not case sensitive.

```bash
npm run lint all       # Everything
npm run lint button    # Button only
npm run lint scripts   # Build scripts only
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
│   │   └── vite.config.mjs
│   ├── Card/             # Card component
│   │   ├── .storybook/   # Card-specific Storybook config
│   │   ├── src/
│   │   ├── package.json
│   │   ├── project.json
│   │   └── vite.config.mjs
│   └── Storybook/        # Centralized Storybook
│       ├── .storybook/   # Main Storybook config
│       ├── package.json
│       └── project.json
├── scripts/              # Build and utility scripts
│   ├── packageCommands.js
│   └── packageInfo.js
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

## Local Development with npm run link

To test components in another project locally:

**1. Build and link all packages:**

```bash
npm run build
npm run link-all
```

**2. In your other project, link the packages you need:**

```bash
npm run link @react-component-library/button
npm run link @react-component-library/card
npm run link @react-component-library/foo
```

**3. After making changes, rebuild to see updates:**

```bash
npm run build
```

**4. When done, unlink:**

```bash
# In your other project
npm run unlink @react-component-library/button

# In this project
npm run unlink-all
```

## Publishing

Each component is built as a standalone package ready for npm publishing:

```bash
npm run build <component>
cd dist/packages/<ComponentName>
npm publish  # or npm run publish
```
