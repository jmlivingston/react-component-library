# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This repo keeps its domain docs in `docs/`, not the repo root. Wherever a skill refers to `CONTEXT.md`, read and write `docs/CONTEXT.md` instead.

## Before exploring, read these

- **`docs/CONTEXT.md`**: the domain glossary.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.

If any of these don't exist, **proceed silently**. The `/domain-modeling` skill creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context:

```
/
├── AGENTS.md
└── docs/
    ├── CONTEXT.md
    ├── adr/
    │   └── 0001-example-decision.md
    └── agents/
        └── domain.md
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `docs/CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_
