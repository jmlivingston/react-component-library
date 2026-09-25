import { afterEach, describe, expect, it } from 'vitest';
import { buildTarget, lintTarget, storybookTarget, testTarget } from './packageCommands.js';
import { componentPackage, createRepo, removeRepos, storybookPackage } from './testRepo.js';

afterEach(removeRepos);

function createLibraryRepo() {
  return createRepo({
    Button: componentPackage('Button', 'button', '@react-component-library/button'),
    MyThing: componentPackage('MyThing', 'myThing', '@react-component-library/my-thing'),
    Storybook: storybookPackage(),
  });
}

describe('buildTarget', () => {
  it('offers All, each component package, then Storybook', () => {
    const root = createLibraryRepo();
    expect(buildTarget.choices({ root })).toEqual(['All', 'Button', 'MyThing', 'Storybook']);
  });

  it('builds every component package, then Storybook, for All', () => {
    const root = createLibraryRepo();
    expect(buildTarget.plan('all', { root })).toEqual({
      message: 'Building all components...',
      commands: ['nx run-many -t build -p button myThing', 'nx run @react-component-library/storybook:build-storybook'],
    });
  });

  it('builds only Storybook for storybook in any casing', () => {
    const root = createLibraryRepo();
    expect(buildTarget.plan('STORYBOOK', { root })).toEqual({
      message: 'Building Storybook...',
      commands: ['nx run @react-component-library/storybook:build-storybook'],
    });
  });

  it.each(['MyThing', 'my-thing'])('builds the component package named %s', (input) => {
    const root = createLibraryRepo();
    expect(buildTarget.plan(input, { root })).toEqual({
      message: 'Building MyThing...',
      commands: ['nx run myThing:build'],
    });
  });

  it('reports an unknown name with the available choices', () => {
    const root = createLibraryRepo();
    expect(buildTarget.plan('XyzAbc', { root })).toEqual({
      unknown: true,
      choices: ['All', 'Button', 'MyThing', 'Storybook'],
    });
  });
});

describe('storybookTarget', () => {
  it('offers All and each component package', () => {
    const root = createLibraryRepo();
    expect(storybookTarget.choices({ root })).toEqual(['All', 'Button', 'MyThing']);
  });

  it('starts the Storybook package on port 4000 for All', () => {
    const root = createLibraryRepo();
    expect(storybookTarget.plan('All', { root })).toEqual({
      message: 'Starting Storybook with all components on port 4000...',
      commands: ['nx run @react-component-library/storybook:storybook -- --port 4000'],
    });
  });

  it("starts a component package's own Storybook on port 4000", () => {
    const root = createLibraryRepo();
    expect(storybookTarget.plan('my-thing', { root })).toEqual({
      message: 'Starting Storybook for MyThing on port 4000...',
      commands: ['nx run myThing:storybook -- --port 4000'],
    });
  });

  it('reports storybook as unknown', () => {
    const root = createLibraryRepo();
    expect(storybookTarget.plan('storybook', { root })).toEqual({
      unknown: true,
      choices: ['All', 'Button', 'MyThing'],
    });
  });
});

describe('testTarget', () => {
  it('offers All, each component package, then Scripts', () => {
    const root = createLibraryRepo();
    expect(testTarget.choices({ root })).toEqual(['All', 'Button', 'MyThing', 'Scripts']);
  });

  it('runs every Vitest project for All', () => {
    const root = createLibraryRepo();
    expect(testTarget.plan('ALL', { root })).toEqual({
      message: 'Testing everything...',
      commands: ['vitest run'],
    });
  });

  it('runs only the scripts tests for scripts in any casing', () => {
    const root = createLibraryRepo();
    expect(testTarget.plan('scripts', { root })).toEqual({
      message: 'Testing scripts...',
      commands: ['vitest run --project scripts'],
    });
  });

  it.each(['MyThing', 'my-thing'])('runs the Vitest project of the component package named %s', (input) => {
    const root = createLibraryRepo();
    expect(testTarget.plan(input, { root })).toEqual({
      message: 'Testing MyThing...',
      commands: ['vitest run --project @react-component-library/my-thing'],
    });
  });

  it('reports storybook as unknown', () => {
    const root = createLibraryRepo();
    expect(testTarget.plan('storybook', { root })).toEqual({
      unknown: true,
      choices: ['All', 'Button', 'MyThing', 'Scripts'],
    });
  });
});

describe('lintTarget', () => {
  const eslint = 'eslint --cache --cache-location node_modules/.cache/eslint/';

  it('offers All, each component package, then Scripts', () => {
    const root = createLibraryRepo();
    expect(lintTarget.choices({ root })).toEqual(['All', 'Button', 'MyThing', 'Scripts']);
  });

  it('lints the whole repo for All', () => {
    const root = createLibraryRepo();
    expect(lintTarget.plan('all', { root })).toEqual({
      message: 'Linting everything...',
      commands: [`${eslint} .`],
    });
  });

  it('lints only scripts/ for scripts in any casing', () => {
    const root = createLibraryRepo();
    expect(lintTarget.plan('SCRIPTS', { root })).toEqual({
      message: 'Linting scripts...',
      commands: [`${eslint} scripts`],
    });
  });

  it.each(['MyThing', 'my-thing'])('lints the folder of the component package named %s', (input) => {
    const root = createLibraryRepo();
    expect(lintTarget.plan(input, { root })).toEqual({
      message: 'Linting MyThing...',
      commands: [`${eslint} packages/MyThing`],
    });
  });

  it('reports storybook as unknown', () => {
    const root = createLibraryRepo();
    expect(lintTarget.plan('storybook', { root })).toEqual({
      unknown: true,
      choices: ['All', 'Button', 'MyThing', 'Scripts'],
    });
  });
});
