import { generateFiles, names, OverwriteStrategy } from "@nx/devkit";
import { fileURLToPath } from "url";

export default function componentGenerator(tree, { name }) {
  if (typeof name !== "string" || !/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error(
      "Component name must be in PascalCase (e.g., Button, MyComponent)",
    );
  }

  const packageRoot = `packages/${name}`;
  if (tree.exists(`${packageRoot}/package.json`)) {
    throw new Error(`Component package ${name} already exists`);
  }

  generateFiles(
    tree,
    fileURLToPath(new URL("./files", import.meta.url)),
    packageRoot,
    { ...names(name), tmpl: "" },
    { overwriteStrategy: OverwriteStrategy.ThrowIfExisting },
  );
}
