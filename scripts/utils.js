import { readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

/**
 * Get all component packages dynamically from the packages directory
 * Returns components with their original casing from the directory names
 */
export const getComponents = () => {
  const packagesDir = join(dirName, '../packages');
  return readdirSync(packagesDir).filter((dir) => {
    const fullPath = join(packagesDir, dir);
    // Filter out non-directories
    return statSync(fullPath).isDirectory() && !dir.startsWith('.');
  });
};

/**
 * Find a component by name (case-insensitive)
 * Returns the component name with correct casing or null if not found
 * @param {string} input - The user input component name
 * @returns {string|null} The correctly cased component name or null
 */
export const findComponent = (input) => {
  const components = getComponents();
  return components.find((component) => component.toLowerCase() === input.toLowerCase()) || null;
};
