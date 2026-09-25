# AGENTS.md

## Agent skills

### Domain docs

Single-context, kept in `docs/` rather than the repo root: wherever a skill says `CONTEXT.md`, use `docs/CONTEXT.md`; ADRs live in `docs/adr/`. See [docs/agents/domain.md](docs/agents/domain.md).

Glossary: @docs/CONTEXT.md

## Gotchas

- Tests: `npm test <all|scripts|package>` wraps `vitest run`; with no argument it opens an interactive menu, so agents should pass one (e.g. `npm test all`).
- Lint: `npm run lint <all|scripts|package>` wraps ESLint the same way (e.g. `npm run lint all`). `no-console` is an error in component code; `scripts/` may use `console`.
- Nx registers every `project.json` in the workspace, so test fixtures that contain one are generated under `os.tmpdir()` at runtime.
