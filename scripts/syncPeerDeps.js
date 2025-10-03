#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packagesDir = 'packages';
const rootPackageJson = JSON.parse(readFileSync('package.json', 'utf-8'));

// Get all component packages (exclude Storybook)
const componentPackages = readdirSync(packagesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory() && dirent.name !== 'Storybook')
  .map((dirent) => dirent.name);

// Build a map of component package names to their versions
const componentVersions = {};
componentPackages.forEach((pkg) => {
  const packageJsonPath = join(packagesDir, pkg, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  componentVersions[packageJson.name] = packageJson.version;
});

// Sync peerDependencies for each component
componentPackages.forEach((pkg) => {
  const packageJsonPath = join(packagesDir, pkg, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  if (!packageJson.peerDependencies) {
    return;
  }

  let updated = false;

  Object.keys(packageJson.peerDependencies).forEach((dep) => {
    // Check if it's a root dependency
    const rootVersion = rootPackageJson.dependencies?.[dep] || rootPackageJson.devDependencies?.[dep];
    if (rootVersion && packageJson.peerDependencies[dep] !== rootVersion) {
      console.log(`Updating ${pkg}: ${dep} from ${packageJson.peerDependencies[dep]} to ${rootVersion}`);
      packageJson.peerDependencies[dep] = rootVersion;
      updated = true;
    }

    // Check if it's a local component
    if (componentVersions[dep] && packageJson.peerDependencies[dep] !== `^${componentVersions[dep]}`) {
      console.log(
        `Updating ${pkg}: ${dep} from ${packageJson.peerDependencies[dep]} to ^${componentVersions[dep]}`
      );
      packageJson.peerDependencies[dep] = `^${componentVersions[dep]}`;
      updated = true;
    }
  });

  if (updated) {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
  }
});

console.log('\n✓ Peer dependencies synced successfully!');
