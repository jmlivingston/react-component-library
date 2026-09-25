# React Component Library

A monorepo of independently published React component packages, plus a Storybook that showcases them together.

## Language

**Package**:
Any directory under `packages/`.
_Avoid_: Project, module, workspace

**Component package**:
A Package that is published to npm as a library and holds a single React component (e.g. Button, Card).
_Avoid_: Component (when referring to the package), library

**Storybook**:
The one Package that is a showcase application for all Component packages; it is never published.
_Avoid_: Component, docs site
