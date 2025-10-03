#!/usr/bin/env node

import { readdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const distPackagesDir = 'dist/packages';
const action = process.argv[2]; // 'link' or 'unlink'

if (!['link', 'unlink'].includes(action)) {
  console.error('Usage: node scripts/link.js [link|unlink]');
  process.exit(1);
}

try {
  const packages = readdirSync(distPackagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== 'Storybook')
    .map((dirent) => dirent.name);

  if (packages.length === 0) {
    console.log('No packages found to link. Run "yarn build" first.');
    process.exit(0);
  }

  packages.forEach((pkg) => {
    const pkgPath = join(distPackagesDir, pkg);
    console.log(`${action === 'link' ? 'Linking' : 'Unlinking'} ${pkg}...`);
    execSync(`yarn ${action}`, { cwd: pkgPath, stdio: 'inherit' });
  });

  console.log(`\n✓ Successfully ${action}ed ${packages.length} package(s): ${packages.join(', ')}`);

  if (action === 'link') {
    console.log('\nTo use in another project, run:');
    packages.forEach((pkg) => {
      console.log(`  yarn link @react-component-library/${pkg.toLowerCase()}`);
    });
  } else {
    console.log('\nPackages unlinked. Remember to also unlink in your other project:');
    packages.forEach((pkg) => {
      console.log(`  yarn unlink @react-component-library/${pkg.toLowerCase()}`);
    });
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
