#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { findComponent, getComponents } from './utils.js';

const main = async () => {
  const components = getComponents().filter((component) => component !== 'Storybook');
  const watchFlag = process.argv.includes('--watch') ? ' --watch' : '';

  // Get component name from argv (skip node, script path, and flags)
  let component = process.argv.slice(2).find((arg) => !arg.startsWith('--'));

  if (!component) {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'component',
          message: 'Which component would you like to test?',
          choices: ['All', ...components],
        },
      ]);
      component = answer.component;
    } catch (error) {
      if (error.isTtyError || error.name === 'ExitPromptError') {
        // eslint-disable-next-line no-console
        console.log('\nTest cancelled.');
        process.exit(0);
      }
      throw error;
    }
  }

  if (component.toLowerCase() === 'all') {
    // eslint-disable-next-line no-console
    console.log(`Testing all components${watchFlag ? ' in watch mode' : ''}...`);
    execSync(`vitest run${watchFlag}`, { stdio: 'inherit' });
  } else {
    const foundComponent = findComponent(component);
    if (foundComponent && foundComponent !== 'Storybook') {
      // eslint-disable-next-line no-console
      console.log(`Testing ${foundComponent}${watchFlag ? ' in watch mode' : ''}...`);
      execSync(`vitest run packages/${foundComponent}${watchFlag}`, {
        stdio: 'inherit',
      });
    } else {
      // eslint-disable-next-line no-console
      console.error(`Unknown component: ${component}`);
      // eslint-disable-next-line no-console
      console.error(`Available components: ${components.join(', ')}, All`);
      process.exit(1);
    }
  }
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
