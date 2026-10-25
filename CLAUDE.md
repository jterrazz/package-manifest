# Agent brief: `@jterrazz/manifest`

The manifest declares, the projections derive, the audit verifies: a site's presence declared once, projected into every machine-facing surface, checked against the live site. Two entries: `.` (model and projections), `./testing` (`audit.website`, run through `specification.website()`). This file **routes**; it does not restate what the corpus already says.

## Where knowledge lives (route here first)

The corpus is `docs/` + `README.md`, mapped by `docs/README.md`. Decisions this package alone took are in `docs/decisions/`. Do not duplicate it; link to it.

| Working on                                               | Read                            |
| -------------------------------------------------------- | ------------------------------- |
| the two entries, the model and projections boundary      | `docs/concepts/architecture.md` |
| the declaration, the gestures, where a new file goes     | `docs/guides/develop.md`        |
| the specs from the tarball, the audit spec, the mutation | `docs/guides/test.md`           |
| the release, and the peer range                          | `docs/guides/release.md`        |
| what each projection produces                            | `docs/reference/projections.md` |
| the ten audit rules                                      | `docs/reference/audit.md`       |

Domain knowledge (SEO, GEO, structured data, content reach) ships as agent skills in `skills/`, beside `jterrazz-manifest` (wiring this package). They route into the corpus and never restate it.

## Setup and commands

The gestures (`make install`, which is `npm ci` and never a plain `npm install` that can rewrite the lockfile, then `make build`, `make lint`, `make fix`, `make test`, `make mutation`, `make check`) and what each runs are [Develop § The gestures](docs/guides/develop.md#the-gestures)'s.

## Standing rule

A new or changed export reaches `README.md`, the relevant `docs/` page and the `skills/jterrazz-manifest/` skill in the same change. None of the three is generated, so nothing else catches a stale one ([Develop § What a change owes](docs/guides/develop.md#what-a-change-owes)).

`CLAUDE.md` at the root is a symlink to this file: one brief, two names, no second copy.
