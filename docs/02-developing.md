# Developing

How a change to `@jterrazz/manifest` is made: installing, wiring, the
commands, where an artefact goes, and which file a new piece of knowledge
opens.

| Question                               | Section               |
| -------------------------------------- | --------------------- |
| How do I set the project up?           | Install and wiring    |
| What do I run, and with what?          | Commands              |
| Where does a build or test tool write? | Artefacts             |
| Where does a new file go?              | Where a new file goes |

## Install and wiring

```bash
npm install
```

Three config files point at `@jterrazz/typescript`'s presets — the toolchain
is the one devDependency that carries a tool, and its own rules are that
package's, not repeated here:

- `tsconfig.json:2` extends `@jterrazz/typescript/tsconfig/library` — the
  preset a package published to a registry names, and the one line the file
  holds: it scopes its own `include` to the project's directory.
- `oxlint.config.ts:1-7` composes the `library` profile with `@jterrazz/test`'s
  `testing` fragment, which arms the convention plugin.
- `oxfmt.config.ts:1-5` applies the shipped `oxfmt` preset.

`vitest.config.ts:1-5` calls `defineSpecConfig()` from `@jterrazz/test/vitest`
— the test runner's own conventions are that package's.

Every one of them names the type of its default export, because the `library`
tsconfig carries `isolatedDeclarations`: a published package emits its
declarations file by file, so nothing exported may need inference to be
written down. The same rule reaches the source — an exported function
declares what it returns.

`oxlint.baseline.json` records the diagnostics the rulebook leaves standing
here, and the lint pass is judged by it: a count may fall, never rise, and an
entry that reaches zero is deleted rather than kept
([the ratchet](https://github.com/jterrazz/package-typescript/blob/main/docs/06-quality-checks.md)).

## Commands

The `Makefile` exposes the three gates every repository of the estate wires
the same way (`node_modules/.install` gates each on `npm ci`,
`Makefile:1-16`):

| Task               | Command      |
| ------------------ | ------------ |
| Build the entries  | `make build` |
| Lint and typecheck | `make lint`  |
| Run the test suite | `make test`  |

`package.json:29-34` names what each delegates to: `tsdown` for the build,
`typescript check` / `typescript fix` for lint, `vitest --run` for the tests.

`tsdown` is the one tool this package declares beside the toolchain
(`package.json:39`), and the exports map is why: `typescript bundle` builds
the single barrel `src/index.ts`, while three published entries need the
config `tsdown.config.ts` holds. `vitest` is declared for the same kind of
reason — it is `@jterrazz/test`'s peer, and a peer is the consumer's to
install.

## Artefacts

`.gitignore:6-7` ignores `.artifacts/` — every build, test and lint tool
writes there, one folder per tool, per the convention `@jterrazz/typescript`
gates. `dist` is ignored too (`.gitignore:4`), but it is the published
product, not an artefact: it is what `files` in `package.json:11-13` ships.

## Where a new file goes

- A new fact about a site's INTENT (a new thing a site can declare) goes in
  `src/model/`, and it stays free of any standard's vocabulary — no
  Open Graph, no schema.org, no sitemap shape leaking up
  (`src/model/site.ts:4-6`).
- A new STANDARD surface, or a change to how an existing one is produced,
  goes in `src/projections/`, one file per surface, reading the model
  and never the other way.
- A new App Router convenience goes in `src/next/index.ts`, wrapping a
  projection — it takes no decision itself
  (`src/next/index.ts:11-15`).
- A new mechanically-checkable invariant about a rendered site becomes a
  named test inside `audit.website` (`src/testing/index.ts`), following the
  existing shape: one `vitest` test per rule, named
  `<subject>/<rule>`, with a `// Given` / `// Then` comment pair
  (`src/testing/index.ts:22-29`).
- Everything that is judgment rather than a mechanical check — SEO, GEO,
  structured-data and content-reach knowledge — belongs in `skills/`, never
  in the package: the package codifies only what a test can verify
  (`AGENTS.md`, "Rules").
- A module's unit test is its sibling, `<file>.test.ts`
  (`src/model/urls.test.ts`, `src/projections/robots.test.ts`) — a test with
  no module of that name beside it is refused. What several tests stand on is
  declared once in a `<file>.fixtures.ts` beside the model it instantiates
  (`src/model/site.fixtures.ts`) — see [03-testing.md](03-testing.md) for what
  proves a change.

A change to the public surface (an export, an entry, a projection's shape)
also updates `README.md` and the `jterrazz-manifest` skill, which routes into
this corpus and never restates it.

## Related

- [01-architecture.md](01-architecture.md) — the layers a new file lands in.
- [03-testing.md](03-testing.md) — what proves the change.
