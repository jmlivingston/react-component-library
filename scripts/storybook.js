#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { findComponent, getComponents } from './utils.js';

async function main() {
  const components = getComponents().filter((component) => component !== 'Storybook');
  let component = process.argv[2];

  if (!component) {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'component',
          message: "Which component's Storybook would you like to run?",
          choices: ['All', ...components],
        },
      ]);
      component = answer.component;
    } catch (error) {
      if (error.isTtyError || error.name === 'ExitPromptError') {
        console.log('\nStorybook cancelled.');
        process.exit(0);
      }
      throw error;
    }
  }

  if (component.toLowerCase() === 'all') {
    console.log('Starting Storybook with all components...');
    execSync('nx run Storybook:storybook', { stdio: 'inherit' });
  } else {
    const foundComponent = findComponent(component);
    if (foundComponent && foundComponent !== 'Storybook') {
      console.log(`Starting Storybook for ${foundComponent}...`);
      execSync(`nx run ${foundComponent.toLowerCase()}:storybook`, {
        stdio: 'inherit',
      });
    } else {
      console.error(`Unknown component: ${component}`);
      console.error(`Available components: ${components.join(', ')}, All`);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
