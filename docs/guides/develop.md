# Develop

How a change to this package is made: the declaration every config follows, the gestures, where a new file goes, and what a change owes. What the package is made of is [Architecture](../concepts/architecture.md).

## The declaration

`@jterrazz/typescript` supplies the whole toolchain (build, type-check, lint, format, unused code, mutation) from one devDependency, and `jterrazz.config.ts` says what this package is: a `library` on `node`, held to `@jterrazz/test`'s preset. Every other config follows from that line:

- `oxlint.config.ts`, `oxfmt.config.ts`, `tsconfig.json` and `vitest.config.ts` are the one-line derivations `typescript fix` writes and `typescript check` refuses to see edited;
- knip, the build and Stryker are configured by the commands that run them: no `knip.json`, no `tsdown.config.*`;
- the published entries are read off `package.json#exports`: `.` from `src/index.ts`, `./testing` from `src/index.testing.ts`.

The declaration holds one exception, `test.production.allow`: the `./testing` entry imports `vitest` and `@jterrazz/test`, since registering tests on a consumer's specification handle is what it ships ([Architecture § The audit entry](../concepts/architecture.md#the-audit-entry)). The allow covers the whole package, not that entry: `@jterrazz/test`'s production rule reads a package name, so nothing stops `src/model/` or `src/projections/` from importing `vitest` or `@jterrazz/test`. Keeping them to `src/index.testing.ts` is review's job, until the allow can be scoped to an entry.

## The gestures

| Gesture         | Runs                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `make install`  | `npm ci`, once per change of the lockfile                                                                 |
| `make build`    | `typescript build`: the two entries the manifest publishes, into `dist/`                                  |
| `make lint`     | `typescript check`: every pass, after a build, since the Publish (packaging) pass reads `dist/`           |
| `make fix`      | `typescript fix`: the derived files, the formatter, the fixable findings                                  |
| `make test`     | the specs, after a build, since they install the tarball `npm pack` writes from `dist/` ([Test](test.md)) |
| `make mutation` | `typescript mutation`: the zero-survivor verdict over the change ([Test § Mutation](test.md#mutation))    |
| `make check`    | `make lint`, `make test`, then `make mutation`: the gate before a commit                                  |

Build, test and lint output lands under `.artifacts/`, which `.gitignore` ignores whole; `dist/` is the published product, not an artefact.

## Where a new file goes

| Adding                                      | Goes in                                                                                                          |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| something a site can declare                | `src/model/`, free of any standard's vocabulary                                                                  |
| a new surface, or a change to how one reads | `src/projections/<surface>.ts`, reading the model and never the other way                                        |
| a mechanically checkable rule of a site     | a `Rule` of `src/index.testing.ts`, named `<subject>/<rule>`, listed in `RULES` ([Audit](../reference/audit.md)) |
| a reader the audit rules share              | `src/audit/`, reached from `src/index.testing.ts` alone                                                          |
| a public export                             | `src/index.ts`; a new subpath also needs its `package.json#exports` entry and its `src/index.<subpath>.ts`       |
| a behaviour a consumer relies on            | a spec under `specs/cli/`, driving the packed package from a consumer's project ([Test](test.md))                |

Judgement (SEO, GEO, structured data, content reach) belongs in `skills/`, never in the package: the package codifies only what a test can verify.

## What a change owes

A new or changed export reaches the root `README.md`, the page of this manual that owns it and the `skills/jterrazz-manifest/` skill in the same change: none of the three is generated, so nothing catches a stale one. A comment states the kind of thing the code cannot say (`invariant:`, `hazard:`, `outside:`, `value:`) or is not written; a public symbol keeps a one-line hover.

## Related

- [Architecture](../concepts/architecture.md): the layers these files implement.
- [Test](test.md): how a change to one of them is proven.
