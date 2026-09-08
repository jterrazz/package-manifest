# Agent brief — `@jterrazz/manifest`

The manifest declares, the projections derive, the audit verifies. A site's presence declared once, projected into every machine-facing surface, checked against the live site. Three entries: `.` (model + projections), `./next` (App Router adapter), `./testing` (`audit.website`, run through `specification.website()`). This file **routes**; it does not restate what the corpus already says.

## Where knowledge lives (route here first)

The corpus is `docs/` + `README.md`, mapped by `docs/README.md`. Do not duplicate it — link to it.

| Working on…                                       | Read                      |
| ------------------------------------------------- | ------------------------- |
| the three entries, the model/projections boundary | `docs/01-architecture.md` |
| wiring, the commands, where a new file goes       | `docs/02-developing.md`   |
| the unit tests, the audit rule pack               | `docs/03-testing.md`      |
| the release, which version ships                  | `docs/04-operating.md`    |
| the four projections in detail                    | `docs/05-projections.md`  |

Domain knowledge (SEO, GEO, structured data, content reach) ships as agent
skills in `skills/`, alongside `jterrazz-manifest` (wiring this package) —
they route into the corpus and never restate it.

`CLAUDE.md` at the root is a symlink to this file: one brief, two names, no
second copy.

## Setup

```bash
npm install
```

## Commands

| Task  | Command      |
| ----- | ------------ |
| Build | `make build` |
| Lint  | `make lint`  |
| Test  | `make test`  |
