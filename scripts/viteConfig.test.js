import { join } from 'path';
import { pathToFileURL } from 'url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { componentPackage, createRepo, removeRepos, storybookPackage } from './testRepo.js';
import { createComponentViteConfig } from './viteConfig.js';

afterEach(() => {
  removeRepos();
  vi.unstubAllEnvs();
});

function createLibraryRepo() {
  return createRepo({
    Button: componentPackage('Button', 'button', '@react-component-library/button'),
    MyThing: {
      ...componentPackage('MyThing', 'myThing', '@react-component-library/my-thing'),
      'package.json': {
        name: '@react-component-library/my-thing',
        peerDependencies: { '@react-component-library/button': '^0.0.1', react: '^19.0.0' },
      },
    },
    Storybook: storybookPackage(),
  });
}

function configFor(root, dir) {
  return createComponentViteConfig(pathToFileURL(join(root, 'packages', dir, 'vite.config.mjs')).href);
}

describe('createComponentViteConfig', () => {
  it('builds the package from its source entry into its dist directory', () => {
    const root = createLibraryRepo();
    const { build } = configFor(root, 'MyThing');

    expect(build.outDir).toBe(join(root, 'dist/packages/MyThing'));
    expect(build.lib.entry).toBe(join(root, 'packages/MyThing/src/index.js'));
  });

  it('keeps peer dependencies and their subpaths out of the bundle', () => {
    const root = createLibraryRepo();
    const isExternal = configFor(root, 'MyThing').build.rolldownOptions.external;

    expect(isExternal('react')).toBe(true);
    expect(isExternal('react/jsx-runtime')).toBe(true);
    expect(isExternal('@react-component-library/button')).toBe(true);
    expect(isExternal('reactive')).toBe(false);
    expect(isExternal('./MyThing.scss')).toBe(false);
  });

  it('aliases component packages to their source under Vitest', () => {
    const root = createLibraryRepo();
    expect(configFor(root, 'MyThing').resolve.alias).toEqual({
      '@react-component-library/button': join(root, 'packages/Button/src/index.js'),
      '@react-component-library/my-thing': join(root, 'packages/MyThing/src/index.js'),
    });
  });

  it('leaves resolution alone outside Vitest', () => {
    vi.stubEnv('VITEST', '');
    const root = createLibraryRepo();
    expect(configFor(root, 'MyThing').resolve).toBeUndefined();
  });
});
