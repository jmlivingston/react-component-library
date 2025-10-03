#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { findComponent, getComponents } from './utils.js';

const main = async () => {
  const components = getComponents().filter((component) => component !== 'Storybook');
  const isWatch = process.argv.includes('--watch');
  const fixFlag = (process.argv.includes('--fix') || isWatch) ? ' --fix' : '';

  // Get component name from argv (skip node, script path, and flags)
  let component = process.argv.slice(2).find((arg) => !arg.startsWith('--'));

  if (!component) {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'component',
          message: 'Which component would you like to lint (styles)?',
          choices: ['All', ...components],
        },
      ]);
      component = answer.component;
    } catch (error) {
      if (error.isTtyError || error.name === 'ExitPromptError') {
        // eslint-disable-next-line no-console
        console.log('\nStylelint cancelled.');
        process.exit(0);
      }
      throw error;
    }
  }

  if (component.toLowerCase() === 'all') {
    const pattern = '"packages/*/src/**/*.scss"';
    if (isWatch) {
      // eslint-disable-next-line no-console
      console.log('Watching all component styles with auto-fix...');
      execSync(`chokidar ${pattern} -c "stylelint {path}${fixFlag}"`, { stdio: 'inherit' });
    } else {
      // eslint-disable-next-line no-console
      console.log(`Linting all component styles${fixFlag ? ' with --fix' : ''}...`);
      execSync(`stylelint ${pattern}${fixFlag}`, { stdio: 'inherit' });
    }
  } else {
    const foundComponent = findComponent(component);
    if (foundComponent && foundComponent !== 'Storybook') {
      const pattern = `"packages/${foundComponent}/src/**/*.scss"`;
      if (isWatch) {
        // eslint-disable-next-line no-console
        console.log(`Watching ${foundComponent} styles with auto-fix...`);
        execSync(`chokidar ${pattern} -c "stylelint {path}${fixFlag}"`, { stdio: 'inherit' });
      } else {
        // eslint-disable-next-line no-console
        console.log(`Linting ${foundComponent} styles${fixFlag ? ' with --fix' : ''}...`);
        execSync(`stylelint ${pattern}${fixFlag}`, { stdio: 'inherit' });
      }
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
