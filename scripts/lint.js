#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { findComponent, getComponents } from './utils.js';

const main = async () => {
  const components = getComponents().filter((component) => component !== 'Storybook');
  let component = process.argv[2];
  const fixFlag = process.argv.includes('--fix') ? ' --fix' : '';

  if (!component) {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'component',
          message: 'Which component would you like to lint?',
          choices: ['All', ...components, 'Scripts'],
        },
      ]);
      component = answer.component;
    } catch (error) {
      if (error.isTtyError || error.name === 'ExitPromptError') {
        // eslint-disable-next-line no-console
        console.log('\nLint cancelled.');
        process.exit(0);
      }
      throw error;
    }
  }

  if (component.toLowerCase() === 'all') {
    // eslint-disable-next-line no-console
    console.log(`Linting all components and scripts${fixFlag ? ' with --fix' : ''}...`);
    execSync(`eslint "packages/*/src/**/*.{js,jsx}" "scripts/**/*.js"${fixFlag}`, { stdio: 'inherit' });
  } else if (component.toLowerCase() === 'scripts') {
    // eslint-disable-next-line no-console
    console.log(`Linting scripts${fixFlag ? ' with --fix' : ''}...`);
    execSync(`eslint "scripts/**/*.js"${fixFlag}`, { stdio: 'inherit' });
  } else {
    const foundComponent = findComponent(component);
    if (foundComponent && foundComponent !== 'Storybook') {
      // eslint-disable-next-line no-console
      console.log(`Linting ${foundComponent}${fixFlag ? ' with --fix' : ''}...`);
      execSync(`eslint "packages/${foundComponent}/src/**/*.{js,jsx}"${fixFlag}`, {
        stdio: 'inherit',
      });
    } else {
      // eslint-disable-next-line no-console
      console.error(`Unknown component: ${component}`);
      // eslint-disable-next-line no-console
      console.error(`Available options: ${components.join(', ')}, Scripts, All`);
      process.exit(1);
    }
  }
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
