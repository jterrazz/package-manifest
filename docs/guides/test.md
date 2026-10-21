# Test

What proves a change here is a specification of what a consumer meets: the package installed from the tarball `npm pack` writes, driven from a consumer's project by `node`. There is no module test.

```bash
make test       # builds, then runs every spec
make mutation   # the zero-survivor verdict over the change
```

## The specs

`specs/cli/` holds one runner, `cli.specification.ts`, which runs `node` with `TZ=UTC` and colour off. Each spec lays a consumer project from its folder's `__fixtures__/consumer/` in a fresh working directory and installs the packed package there with `.link('@jterrazz/manifest', packed())`, never the checkout's `src/` or its own `dist/`, so a file `files` leaves out or an entry the exports map forgets fails here as it would for a consumer. The specs pack `dist/`: `make test` builds first, but a spec run on its own straight after an edit tests the previous build, so run `make build` before it.

| Spec                       | Proves                                                                                                                                                                                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node/urls.spec.ts`        | the URL policy: a locale prefix only off the main locale or under `prefixMain`, and x-default only for a page that exists in the main locale                                                                                                                                 |
| `node/identity.spec.ts`    | the WebSite, the Person and the graph of both, their stable ids and the author reference, the optional Person fields present exactly when declared                                                                                                                           |
| `node/images.spec.ts`      | the ImageObject credited to the Person under the site's one declared license, and the refusal of a site declaring none                                                                                                                                                       |
| `node/sitemap.spec.ts`     | one entry per page per locale, every kind's priority and frequency, `lastModified` only from a declared modified date                                                                                                                                                        |
| `node/robots.spec.ts`      | the generic rule hiding the declared paths, and one full disallow per AI crawler under `blocked`                                                                                                                                                                             |
| `node/llms.spec.ts`        | the articles and the software under the identity, each at a locale it exists in, and the optional lines only when declared                                                                                                                                                   |
| `tsc/declarations.spec.ts` | a consumer naming every export of the two entries compiles against their `.d.ts`, and the calls they must refuse are refused (`@ts-expect-error`)                                                                                                                            |
| `vitest/audit.spec.ts`     | the audit, run by `vitest` in a consumer's website spec: every rule passes on a site serving its declaration, every rule fails on one breaking it (each failure's evidence pinned), and the AI crawler policy and both channels hold in both directions, declared on and off |

The audit spec is the one that starts a site: its consumer serves static pages from `server.mjs`, laying the folders `SITE` lists over each other, and answering a path with no extension by two redirects to its `.html` page: `healthy/` (with `channels/`, its llms.txt and feed, by default), `broken/` and `welcoming/`. `SITE` also picks what `manifest.config.mjs` declares: `welcoming` the welcoming AI crawler policy, `quiet` both channels off (no folder of its own). It reports each rule's outcome through `reporter.mjs`, one line per rule, and under a failed rule the whole diff (or message) of its first error. It links `vitest`, `@jterrazz/test` and `playwright` from this checkout, and its one `.visit()` rule drives Playwright's headless Chromium shell, which must be installed for the Playwright version the lockfile holds (`npx playwright install --only-shell chromium`).

## Re-recording a golden

A golden written in place is rewritten from the actual output by `TEST_UPDATE=1 npx vitest run <spec>`, after `make build`. Read the diff: the re-record is the new claim, and every changed line in it is a behaviour that changed.

## What earns a test

A behaviour a consumer relies on is specified through the packed package. A module test is kept only for a pure algorithm whose edges are cheaper at its own level, or for a failure no consumer's run can provoke honestly. The projections are pure, but every edge of theirs costs one line of a consumer script and one line of its golden, so the five module tests the package once had were promoted to the specs above.

## Mutation

`make mutation` runs `typescript mutation`: Stryker mutates the lines a change touched, rebuilds, and runs every spec against each mutant; the packed tarball carries the mutant. A mutant that a test runs and none detects fails the gate. Measure a whole branch with `npx typescript mutation --since <commit>`, or every line of the sources with `--mutate`:

```bash
npx typescript mutation --mutate "$(ls src/*.ts src/*/*.ts | sed 's/$/:1-400/' | paste -sd, -)"
```

## Related

- [Develop](develop.md): the gestures, and where a new file goes.
- [Audit](../reference/audit.md): the rules the audit spec runs.
