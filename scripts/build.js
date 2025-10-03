#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { findComponent, getComponents } from './utils.js';

const main = async () => {
  const components = getComponents();
  let component = process.argv[2];

  if (!component) {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'component',
          message: 'Which component would you like to build?',
          choices: ['All', ...components],
        },
      ]);
      component = answer.component;
    } catch (error) {
      if (error.isTtyError || error.name === 'ExitPromptError') {
        // eslint-disable-next-line no-console
        console.log('\nBuild cancelled.');
        process.exit(0);
      }
      throw error;
    }
  }

  if (component.toLowerCase() === 'all') {
    // eslint-disable-next-line no-console
    console.log('Building all components...');
    const componentNames = components.map((c) => c.toLowerCase());
    execSync(`nx run-many -t build -p ${componentNames.join(' ')}`, {
      stdio: 'inherit',
    });
    execSync('nx run @react-component-library/storybook:build-storybook --output-dir=./lib', {
      stdio: 'inherit',
    });
  } else if (component.toLowerCase() === 'storybook') {
    // eslint-disable-next-line no-console
    console.log('Building Storybook...');
    execSync('nx run @react-component-library/storybook:build-storybook --output-dir=./lib', {
      stdio: 'inherit',
    });
  } else {
    const foundComponent = findComponent(component);
    if (foundComponent) {
      // eslint-disable-next-line no-console
      console.log(`Building ${foundComponent}...`);
      execSync(`nx run ${foundComponent.toLowerCase()}:build`, {
        stdio: 'inherit',
      });
    } else {
      // eslint-disable-next-line no-console
      console.error(`Unknown component: ${component}`);
      // eslint-disable-next-line no-console
      console.error(`Available components: ${components.join(', ')}, Storybook, All`);
      process.exit(1);
    }
  }
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
