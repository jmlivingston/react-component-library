#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { listComponentPackages } from './packageInfo.js';

const action = process.argv[2]; // 'link' or 'unlink'

if (!['link', 'unlink'].includes(action)) {
  console.error('Usage: node scripts/link.js [link|unlink]');
  process.exit(1);
}

try {
  const allPackages = listComponentPackages();
  const packages = allPackages.filter((pkg) => existsSync(pkg.distDir));
  const unbuilt = allPackages.filter((pkg) => !packages.includes(pkg));

  if (packages.length === 0) {
    console.log('No packages found to link. Run "npm run build" first.');
    process.exit(0);
  }

  unbuilt.forEach((pkg) => console.log(`Skipping ${pkg.dir} (not built).`));

  packages.forEach((pkg) => {
    console.log(`${action === 'link' ? 'Linking' : 'Unlinking'} ${pkg.dir}...`);
    execSync(`npm run ${action}`, { cwd: pkg.distDir, stdio: 'inherit' });
  });

  console.log(
    `\n✓ Successfully ${action}ed ${packages.length} package(s): ${packages.map((pkg) => pkg.dir).join(', ')}`,
  );

  if (action === 'link') {
    console.log('\nTo use in another project, run:');
    packages.forEach((pkg) => {
      console.log(`  npm link ${pkg.npmName}`);
    });
  } else {
    console.log('\nPackages unlinked. Remember to also unlink in your other project:');
    packages.forEach((pkg) => {
      console.log(`  npm unlink ${pkg.npmName}`);
    });
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
