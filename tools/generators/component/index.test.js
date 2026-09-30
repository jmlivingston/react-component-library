import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { describe, expect, it } from "vitest";
import componentGenerator from "./index.js";

describe("component generator", () => {
  it("creates a complete package with matching names", () => {
    const tree = createTreeWithEmptyWorkspace();
    tree.write(
      "package.json",
      JSON.stringify({ name: "@react-component-library/root" }),
    );
    componentGenerator(tree, { name: "MyThing" });

    expect(
      tree
        .listChanges()
        .map(({ path }) => path)
        .filter((path) => path.startsWith("packages/MyThing/"))
        .sort(),
    ).toEqual(
      [
        "packages/MyThing/.storybook/main.mjs",
        "packages/MyThing/package.json",
        "packages/MyThing/project.json",
        "packages/MyThing/src/MyThing.jsx",
        "packages/MyThing/src/MyThing.scss",
        "packages/MyThing/src/MyThing.stories.jsx",
        "packages/MyThing/src/MyThing.test.jsx",
        "packages/MyThing/src/index.js",
        "packages/MyThing/vite.config.mjs",
      ].sort(),
    );
    expect(
      JSON.parse(tree.read("packages/MyThing/package.json", "utf-8")).name,
    ).toBe("@react-component-library/my-thing");
    expect(
      JSON.parse(tree.read("packages/MyThing/project.json", "utf-8")),
    ).toMatchObject({
      name: "myThing",
      sourceRoot: "packages/MyThing/src",
    });
    expect(tree.read("packages/MyThing/src/MyThing.jsx", "utf-8")).toContain(
      'className="my-thing"',
    );
  });

  it("rejects invalid or existing component names", () => {
    const tree = createTreeWithEmptyWorkspace();
    expect(() => componentGenerator(tree, { name: "bad-name" })).toThrow(
      /PascalCase/,
    );
    componentGenerator(tree, { name: "MyThing" });
    expect(() => componentGenerator(tree, { name: "MyThing" })).toThrow(
      /already exists/,
    );
  });
});
