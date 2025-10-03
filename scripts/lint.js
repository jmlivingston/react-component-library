#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { findComponent, getComponents } from './utils.js';

const main = async () => {
  const components = getComponents().filter((component) => component !== 'Storybook');
  let component = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
  const isWatch = process.argv.includes('--watch');
  const fixFlag = (process.argv.includes('--fix') || isWatch) ? ' --fix' : '';

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
    const pattern = '"packages/*/src/**/*.{js,jsx}" "scripts/**/*.js"';
    if (isWatch) {
      // eslint-disable-next-line no-console
      console.log('Watching all components and scripts with auto-fix...');
      execSync(`chokidar ${pattern} -c "eslint {path}${fixFlag}"`, { stdio: 'inherit' });
    } else {
      // eslint-disable-next-line no-console
      console.log(`Linting all components and scripts${fixFlag ? ' with --fix' : ''}...`);
      execSync(`eslint ${pattern}${fixFlag}`, { stdio: 'inherit' });
    }
  } else if (component.toLowerCase() === 'scripts') {
    const pattern = '"scripts/**/*.js"';
    if (isWatch) {
      // eslint-disable-next-line no-console
      console.log('Watching scripts with auto-fix...');
      execSync(`chokidar ${pattern} -c "eslint {path}${fixFlag}"`, { stdio: 'inherit' });
    } else {
      // eslint-disable-next-line no-console
      console.log(`Linting scripts${fixFlag ? ' with --fix' : ''}...`);
      execSync(`eslint ${pattern}${fixFlag}`, { stdio: 'inherit' });
    }
  } else {
    const foundComponent = findComponent(component);
    if (foundComponent && foundComponent !== 'Storybook') {
      const pattern = `"packages/${foundComponent}/src/**/*.{js,jsx}"`;
      if (isWatch) {
        // eslint-disable-next-line no-console
        console.log(`Watching ${foundComponent} with auto-fix...`);
        execSync(`chokidar ${pattern} -c "eslint {path}${fixFlag}"`, { stdio: 'inherit' });
      } else {
        // eslint-disable-next-line no-console
        console.log(`Linting ${foundComponent}${fixFlag ? ' with --fix' : ''}...`);
        execSync(`eslint ${pattern}${fixFlag}`, { stdio: 'inherit' });
      }
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
