import { readdirSync, readFileSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get all component packages dynamically from the packages directory
 * Returns components with their original casing from the directory names
 */
export function getComponents() {
  const packagesDir = join(__dirname, '../packages');
  return readdirSync(packagesDir).filter((dir) => {
    const fullPath = join(packagesDir, dir);
    // Filter out non-directories
    return statSync(fullPath).isDirectory() && !dir.startsWith('.');
  });
}

/**
 * Find a component by name (case-insensitive)
 * Returns the component name with correct casing or null if not found
 * @param {string} input - The user input component name
 * @returns {string|null} The correctly cased component name or null
 */
export function findComponent(input) {
  const components = getComponents();
  return components.find((component) => component.toLowerCase() === input.toLowerCase()) || null;
}

/**
 * Generate resolve aliases mapping each package's published name to its source entry point
 * Lets consumers (Storybook, Vitest) resolve sibling packages without a prior build/link
 * @param {string} [excludeName] - Directory name to exclude from aliasing (e.g. "Storybook")
 * @returns {Object<string, string>} Map of package name -> absolute path to its src/index.js
 */
export function generatePackageAliases(excludeName = 'Storybook') {
  const packagesDir = join(__dirname, '../packages');
  const packages = readdirSync(packagesDir, { withFileTypes: true }).filter(
    (dirent) => dirent.isDirectory() && dirent.name !== excludeName,
  );

  const aliases = {};

  for (const pkg of packages) {
    const packageJsonPath = join(packagesDir, pkg.name, 'package.json');
    const projectJsonPath = join(packagesDir, pkg.name, 'project.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const projectJson = JSON.parse(readFileSync(projectJsonPath, 'utf-8'));
    aliases[packageJson.name] = join(__dirname, '..', projectJson.sourceRoot, 'index.js');
  }

  return aliases;
}
