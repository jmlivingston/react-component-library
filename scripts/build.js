#!/usr/bin/env node

import { execSync } from "child_process";
import inquirer from "inquirer";
import { getComponents } from "./utils.js";

async function main() {
  const components = getComponents();
  let component = process.argv[2];

  if (!component) {
    try {
      const answer = await inquirer.prompt([
        {
          type: "list",
          name: "component",
          message: "Which component would you like to build?",
          choices: ["All", ...components],
        },
      ]);
      component = answer.component;
    } catch (error) {
      if (error.isTtyError || error.name === "ExitPromptError") {
        console.log("\nBuild cancelled.");
        process.exit(0);
      }
      throw error;
    }
  }

  if (component === "All") {
    console.log("Building all components...");
    execSync(`nx run-many -t build -p ${components.join(" ")}`, {
      stdio: "inherit",
    });
    execSync("nx run @react-component-library/storybook:build-storybook", {
      stdio: "inherit",
    });
  } else if (component === "Storybook") {
    console.log("Building Storybook...");
    execSync("nx run @react-component-library/storybook:build-storybook", {
      stdio: "inherit",
    });
  } else if (components.includes(component.toLowerCase())) {
    console.log(`Building ${component}...`);
    execSync(`nx run ${component.toLowerCase()}:build`, { stdio: "inherit" });
  } else {
    console.error(`Unknown component: ${component}`);
    console.error(
      `Available components: ${components.join(", ")}, Storybook, all`
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
