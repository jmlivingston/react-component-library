#!/usr/bin/env node

import { readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const packagesDir = 'packages';
const action = process.argv[2]; // 'link' or 'unlink'

if (!['link', 'unlink'].includes(action)) {
  // eslint-disable-next-line no-console
  console.error('Usage: node scripts/link.js [link|unlink]');
  process.exit(1);
}

try {
  const packages = readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== 'Storybook')
    .filter((dirent) => existsSync(join(packagesDir, dirent.name, 'lib')))
    .map((dirent) => dirent.name);

  if (packages.length === 0) {
    // eslint-disable-next-line no-console
    console.log('No built packages found to link. Run "yarn build" first.');
    process.exit(0);
  }

  packages.forEach((pkg) => {
    const pkgPath = join(packagesDir, pkg, 'lib');
    // eslint-disable-next-line no-console
    console.log(`${action === 'link' ? 'Linking' : 'Unlinking'} ${pkg}...`);
    execSync(`yarn ${action}`, { cwd: pkgPath, stdio: 'inherit' });
  });

  // eslint-disable-next-line no-console
  console.log(`\n✓ Successfully ${action}ed ${packages.length} package(s): ${packages.join(', ')}`);

  if (action === 'link') {
    // eslint-disable-next-line no-console
    console.log('\nTo use in another project, run:');
    packages.forEach((pkg) => {
      // eslint-disable-next-line no-console
      console.log(`  yarn link @react-component-library/${pkg.toLowerCase()}`);
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('\nPackages unlinked. Remember to also unlink in your other project:');
    packages.forEach((pkg) => {
      // eslint-disable-next-line no-console
      console.log(`  yarn unlink @react-component-library/${pkg.toLowerCase()}`);
    });
  }
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
