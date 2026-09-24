#!/usr/bin/env node

import { select } from '@inquirer/prompts';
import { execSync } from 'child_process';
import { findComponent, getComponents } from './utils.js';

async function main() {
  const components = getComponents();
  let component = process.argv[2];

  if (!component) {
    try {
      component = await select({
        message: 'Which component would you like to build?',
        choices: ['All', ...components].map((choice) => ({
          name: choice,
          value: choice,
        })),
      });
    } catch (error) {
      if (error.isTtyError || error.name === 'ExitPromptError') {
        console.log('\nBuild cancelled.');
        process.exit(0);
      }
      throw error;
    }
  }

  if (component.toLowerCase() === 'all') {
    console.log('Building all components...');
    const componentNames = components.map((c) => c.toLowerCase());
    execSync(`nx run-many -t build -p ${componentNames.join(' ')}`, {
      stdio: 'inherit',
    });
    execSync('nx run @react-component-library/storybook:build-storybook', {
      stdio: 'inherit',
    });
  } else if (component.toLowerCase() === 'storybook') {
    console.log('Building Storybook...');
    execSync('nx run @react-component-library/storybook:build-storybook', {
      stdio: 'inherit',
    });
  } else {
    const foundComponent = findComponent(component);
    if (foundComponent) {
      console.log(`Building ${foundComponent}...`);
      execSync(`nx run ${foundComponent.toLowerCase()}:build`, {
        stdio: 'inherit',
      });
    } else {
      console.error(`Unknown component: ${component}`);
      console.error(`Available components: ${components.join(', ')}, Storybook, All`);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
