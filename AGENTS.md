# AGENTS.md

## Agent skills

### Domain docs

Single-context, kept in `docs/` rather than the repo root: wherever a skill says `CONTEXT.md`, use `docs/CONTEXT.md`; ADRs live in `docs/adr/`. See [docs/agents/domain.md](docs/agents/domain.md).

Glossary: @docs/CONTEXT.md

## Gotchas

- Tests: `npm test [project]` runs matching Nx test targets; with no argument it runs all targets (e.g., `npm test button`).
- Lint: `npm run lint [project]` runs matching Nx lint targets; with no argument it runs all targets (e.g., `npm run lint button`). `no-console` is an error in component code; `scripts/` may use `console`.
- Nx registers every `project.json` in the workspace, so test fixtures that contain one are generated under `os.tmpdir()` at runtime.
