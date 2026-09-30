import { join } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { findComponentPackage, listComponentPackages, listComponentStylesheetAliases } from './packageInfo.js';
import { componentPackage, createRepo, removeRepos, storybookPackage } from './testRepo.js';

afterEach(removeRepos);

describe('listComponentPackages', () => {
  it('lists component packages with their identities and excludes Storybook', () => {
    const root = createRepo({
      Button: componentPackage('Button', 'button', '@react-component-library/button'),
      MyThing: componentPackage('MyThing', 'myThing', '@react-component-library/my-thing'),
      Storybook: storybookPackage(),
    });

    expect(listComponentPackages({ root })).toEqual([
      {
        dir: 'Button',
        projectName: 'button',
        npmName: '@react-component-library/button',
        sourceEntry: join(root, 'packages/Button/src/index.js'),
        distDir: join(root, 'dist/packages/Button'),
      },
      {
        dir: 'MyThing',
        projectName: 'myThing',
        npmName: '@react-component-library/my-thing',
        sourceEntry: join(root, 'packages/MyThing/src/index.js'),
        distDir: join(root, 'dist/packages/MyThing'),
      },
    ]);
  });

  it('fails naming the package when package.json is missing', () => {
    const root = createRepo({
      Button: {
        'project.json': componentPackage('Button', 'button', 'x')['project.json'],
      },
    });

    expect(() => listComponentPackages({ root })).toThrow(/Button.*package\.json/);
  });

  it('fails naming the package when project.json is invalid', () => {
    const root = createRepo({
      Button: {
        ...componentPackage('Button', 'button', 'x'),
        'project.json': '{ not json',
      },
    });

    expect(() => listComponentPackages({ root })).toThrow(/Button.*project\.json/);
  });
});

describe('findComponentPackage', () => {
  function createMyThingRepo() {
    return createRepo({
      MyThing: componentPackage('MyThing', 'myThing', '@react-component-library/my-thing'),
      Storybook: storybookPackage(),
    });
  }

  it.each(['MyThing', 'mything', 'MYTHING', 'myThing', 'my-thing', 'My-Thing', '@react-component-library/my-thing'])(
    'finds the package by %s',
    (input) => {
      const root = createMyThingRepo();
      expect(findComponentPackage(input, { root })?.dir).toBe('MyThing');
    },
  );

  it('returns null for an unknown name', () => {
    const root = createMyThingRepo();
    expect(findComponentPackage('XyzAbc', { root })).toBeNull();
  });

  it('does not find Storybook', () => {
    const root = createMyThingRepo();
    expect(findComponentPackage('Storybook', { root })).toBeNull();
  });
});

describe('listComponentStylesheetAliases', () => {
  it('maps each package style export to its source stylesheet', () => {
    const root = createRepo({
      Button: componentPackage('Button', 'button', '@react-component-library/button'),
      Css: {
        ...componentPackage('Css', 'css', '@react-component-library/css'),
        'package.json': {
          name: '@react-component-library/css',
          exports: { '.': './styles.css' },
        },
        'src/styles.css': ':root {}',
        'src/foo.css': '.foo {}',
      },
      Storybook: storybookPackage(),
    });

    expect(listComponentStylesheetAliases({ root })).toEqual({
      '@react-component-library/button/style.css': join(root, 'packages/Button/src/Button.css'),
      '@react-component-library/css/style.css': join(root, 'packages/Css/src/styles.css'),
      '@react-component-library/css/styles.css': join(root, 'packages/Css/src/styles.css'),
      '@react-component-library/css/foo.css': join(root, 'packages/Css/src/foo.css'),
    });
  });
});
