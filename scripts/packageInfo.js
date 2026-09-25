import { readdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function readManifest(root, dir, file) {
  try {
    return JSON.parse(readFileSync(join(root, 'packages', dir, file), 'utf-8'));
  } catch (error) {
    throw new Error(`Package "${dir}" has a missing or invalid ${file}: ${error.message}`);
  }
}

function readPackages(root) {
  return readdirSync(join(root, 'packages'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort()
    .map((dir) => {
      const packageJson = readManifest(root, dir, 'package.json');
      const projectJson = readManifest(root, dir, 'project.json');
      return {
        kind: projectJson.projectType,
        record: {
          dir,
          projectName: projectJson.name,
          npmName: packageJson.name,
          sourceEntry: join(root, projectJson.sourceRoot, 'index.js'),
          distDir: join(root, 'dist', 'packages', dir),
        },
      };
    });
}

export function listComponentPackages({ root = REPO_ROOT } = {}) {
  return readPackages(root)
    .filter((pkg) => pkg.kind !== 'application')
    .map((pkg) => pkg.record);
}

export function getStorybook({ root = REPO_ROOT } = {}) {
  const storybooks = readPackages(root).filter((pkg) => pkg.kind === 'application');
  if (storybooks.length !== 1) {
    const found = storybooks.map((pkg) => pkg.record.dir).join(', ') || 'none';
    throw new Error(`Expected exactly one Storybook package (projectType "application"), found ${found}`);
  }
  return storybooks[0].record;
}

export function findComponentPackage(input, { root = REPO_ROOT } = {}) {
  const wanted = input.toLowerCase();
  return (
    listComponentPackages({ root }).find(({ dir, projectName, npmName }) =>
      [dir, projectName, npmName, npmName.split('/').pop()].some((name) => name.toLowerCase() === wanted),
    ) ?? null
  );
}
