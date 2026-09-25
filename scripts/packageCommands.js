import { select } from '@inquirer/prompts';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { findComponentPackage, getStorybook, listComponentPackages } from './packageInfo.js';
import { STORYBOOK_PORT } from './storybookConfig.js';

export const buildTarget = {
  promptMessage: 'Which component would you like to build?',
  cancelMessage: 'Build cancelled.',
  choices({ root } = {}) {
    return ['All', ...listComponentPackages({ root }).map((pkg) => pkg.dir), 'Storybook'];
  },
  plan(input, { root } = {}) {
    const buildStorybook = () => `nx run ${getStorybook({ root }).projectName}:build-storybook`;

    if (input.toLowerCase() === 'all') {
      const projectNames = listComponentPackages({ root }).map((pkg) => pkg.projectName);
      return {
        message: 'Building all components...',
        commands: [`nx run-many -t build -p ${projectNames.join(' ')}`, buildStorybook()],
      };
    }
    if (input.toLowerCase() === 'storybook') {
      return { message: 'Building Storybook...', commands: [buildStorybook()] };
    }
    const pkg = findComponentPackage(input, { root });
    if (pkg) {
      return { message: `Building ${pkg.dir}...`, commands: [`nx run ${pkg.projectName}:build`] };
    }
    return { unknown: true, choices: buildTarget.choices({ root }) };
  },
};

export const storybookTarget = {
  promptMessage: "Which component's Storybook would you like to run?",
  cancelMessage: 'Storybook cancelled.',
  choices({ root } = {}) {
    return ['All', ...listComponentPackages({ root }).map((pkg) => pkg.dir)];
  },
  plan(input, { root } = {}) {
    if (input.toLowerCase() === 'all') {
      return {
        message: `Starting Storybook with all components on port ${STORYBOOK_PORT}...`,
        commands: [`nx run ${getStorybook({ root }).projectName}:storybook -- --port ${STORYBOOK_PORT}`],
      };
    }
    const pkg = findComponentPackage(input, { root });
    if (pkg) {
      return {
        message: `Starting Storybook for ${pkg.dir} on port ${STORYBOOK_PORT}...`,
        commands: [`nx run ${pkg.projectName}:storybook -- --port ${STORYBOOK_PORT}`],
      };
    }
    return { unknown: true, choices: storybookTarget.choices({ root }) };
  },
};

export const testTarget = {
  promptMessage: 'Which tests would you like to run?',
  cancelMessage: 'Tests cancelled.',
  choices({ root } = {}) {
    return ['All', ...listComponentPackages({ root }).map((pkg) => pkg.dir), 'Scripts'];
  },
  plan(input, { root } = {}) {
    if (input.toLowerCase() === 'all') {
      return { message: 'Testing everything...', commands: ['vitest run'] };
    }
    if (input.toLowerCase() === 'scripts') {
      return { message: 'Testing scripts...', commands: ['vitest run --project scripts'] };
    }
    const pkg = findComponentPackage(input, { root });
    if (pkg) {
      // Vitest names each package's project after its npm name.
      return { message: `Testing ${pkg.dir}...`, commands: [`vitest run --project ${pkg.npmName}`] };
    }
    return { unknown: true, choices: testTarget.choices({ root }) };
  },
};

const ESLINT = 'eslint --cache --cache-location node_modules/.cache/eslint/';

export const lintTarget = {
  promptMessage: 'What would you like to lint?',
  cancelMessage: 'Lint cancelled.',
  choices({ root } = {}) {
    return ['All', ...listComponentPackages({ root }).map((pkg) => pkg.dir), 'Scripts'];
  },
  plan(input, { root } = {}) {
    if (input.toLowerCase() === 'all') {
      return { message: 'Linting everything...', commands: [`${ESLINT} .`] };
    }
    if (input.toLowerCase() === 'scripts') {
      return { message: 'Linting scripts...', commands: [`${ESLINT} scripts`] };
    }
    const pkg = findComponentPackage(input, { root });
    if (pkg) {
      return { message: `Linting ${pkg.dir}...`, commands: [`${ESLINT} packages/${pkg.dir}`] };
    }
    return { unknown: true, choices: lintTarget.choices({ root }) };
  },
};

async function runTarget(target, input) {
  if (!input) {
    try {
      input = await select({
        message: target.promptMessage,
        choices: target.choices().map((choice) => ({ name: choice, value: choice })),
      });
    } catch (error) {
      if (error.isTtyError || error.name === 'ExitPromptError') {
        console.log(`\n${target.cancelMessage}`);
        process.exit(0);
      }
      throw error;
    }
  }

  const plan = target.plan(input);
  if (plan.unknown) {
    console.error(`Unknown component: ${input}`);
    console.error(`Available components: ${plan.choices.join(', ')}`);
    process.exit(1);
  }

  console.log(plan.message);
  for (const command of plan.commands) {
    try {
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      // Nx has already printed the failure; pass its exit code through.
      process.exit(error.status ?? 1);
    }
  }
}

const targets = { build: buildTarget, storybook: storybookTarget, test: testTarget, lint: lintTarget };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [targetName, input] = process.argv.slice(2);
  if (!targets[targetName]) {
    console.error(`Usage: node scripts/packageCommands.js <${Object.keys(targets).join('|')}> [package]`);
    process.exit(1);
  }
  runTarget(targets[targetName], input).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
