import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// Get all component packages (exclude Storybook)
const packagesDir = './packages';
const packages = readdirSync(packagesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory() && dirent.name !== 'Storybook')
  .map((dirent) => resolve(packagesDir, dirent.name, 'vite.config.js'));

// Generate package aliases for testing
const generateAliases = () => {
  const absolutePackagesDir = resolve(packagesDir);
  const dirs = readdirSync(absolutePackagesDir, { withFileTypes: true });

  return dirs.reduce((aliases, dirent) => {
    if (!dirent.isDirectory() || dirent.name === 'Storybook') {
      return aliases;
    }
    const packageJsonPath = resolve(absolutePackagesDir, dirent.name, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const indexPath = resolve(absolutePackagesDir, dirent.name, 'src');
    return {
      ...aliases,
      [packageJson.name]: indexPath,
    };
  }, {});
};

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    projects: packages,
  },
  resolve: {
    alias: generateAliases(),
  },
});
