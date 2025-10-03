#!/usr/bin/env node

import { execSync } from "child_process";
import inquirer from "inquirer";
import { getComponents } from "./utils.js";

async function main() {
  const components = getComponents().filter(
    (component) => component !== "Storybook"
  );
  let component = process.argv[2];

  if (!component) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "component",
        message: "Which component's Storybook would you like to run?",
        choices: ["All", ...components],
      },
    ]);
    component = answer.component;
  }

  if (component === "All") {
    console.log("Starting Storybook with all components...");
    execSync("nx run Storybook:storybook", { stdio: "inherit" });
  } else if (components.includes(component)) {
    console.log(`Starting Storybook for ${component}...`);
    execSync(`nx run ${component}:storybook`, { stdio: "inherit" });
  } else {
    console.error(`Unknown component: ${component}`);
    console.error(`Available components: ${components.join(", ")}, all`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
