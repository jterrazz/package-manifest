# Architecture

`@jterrazz/manifest` is a site's presence declared once and projected into
every machine-facing surface, with an audit that checks a live site against
the declaration. Three published entries carry that: the model and
projections, a Next.js adapter, and the audit rule pack.

| Question                                     | Section              |
| -------------------------------------------- | -------------------- |
| What does each entry ship?                   | The three entries    |
| Where does intent stop and a standard start? | Model vs projections |
| What does the Next.js adapter add?           | The Next.js adapter  |
| What does the audit entry ship?              | The audit entry      |

## The three entries

`package.json`'s `exports` map, built by `tsdown.config.ts:8-17`, ships three
ESM entries from three source roots:

| Entry       | Built from             | Ships                                 |
| ----------- | ---------------------- | ------------------------------------- |
| `.`         | `src/core/index.ts`    | the model and the projections         |
| `./next`    | `src/next/index.ts`    | the App Router adapter                |
| `./testing` | `src/testing/index.ts` | the audit rule pack (`audit.website`) |

`next`, `vitest` and `@jterrazz/test` are peer-provided and stay external to
the build (`tsdown.config.ts:15`) — a consumer that never imports `./next` or
`./testing` never installs them (`package.json:43-58`).

## Model vs projections

`src/core/index.ts:1-21` re-exports the two halves of the `.` entry in the
order they are layered:

- **The model** (`src/core/model/`) speaks the language of INTENT —
  `defineSite`, `person`, `page`, and the URL policy (`urlFor`,
  `alternatesFor`, `src/core/model/urls.ts`). It never imports a standard's
  vocabulary: no Open Graph, no schema.org, no sitemap shape
  (`src/core/model/site.ts:4-6`).
- **The projections** (`src/core/projections/`) speak the language of
  STANDARDS. Each file owns one surface and reads the model, never the other
  way: `json-ld.ts` (the identity graph, `personId`/`websiteId`/
  `projectIdentityGraph`), `sitemap.ts` (`projectSitemap`, one entry per page
  per existing locale, kind-driven priority and frequency), `robots.ts`
  (`projectRobots`, the AI-crawler allow/block list), `llms.ts`
  (`projectLlms`, the `llms.txt` markdown index).

Every page carries a `PageKind` (`article | collection | gallery | home |
profile | software`, `src/core/model/page.ts:7`), and `KIND_DEFAULTS`
(`src/core/model/page.ts:39-49`) is the one table that turns a kind into a
sitemap priority, a change frequency, and feed/llms membership — a page
declared is a page fully projected, with no per-page ceremony at the call
site.

The package never reads content itself: a consumer implements a
`PageProvider` (`src/core/model/page.ts:36`), a zero-argument function
enumerating that consumer's own pages.

## The Next.js adapter

`src/next/index.ts` is thin glue and takes no decision of its own — its
docstring says so directly (`src/next/index.ts:11-15`). `createSitemap`,
`createRobots` and `createLlms` each wrap a projection into the shape the App
Router file convention expects (`app/sitemap.ts`, `app/robots.ts`, a
`llms.txt` route handler), reading the site and its providers and calling
straight into `core`.

## The audit entry

`src/testing/index.ts` exports `audit.website`, a closed namespace in the
shape `specification` exposes from `@jterrazz/test`: one method, no options,
no skip list (`src/testing/index.ts:6-19`). It runs ten named `vitest` tests
against a rendered or deployed site, driven by a `WebsiteSpecification`
handle a consumer builds with `specification.website()`. What the ten rules
check, and how a consumer wires the handle, is
[03-testing.md](03-testing.md)'s.

## Related

- [02-developing.md](02-developing.md) — where a new file goes when it adds
  to one of these layers.
- [05-projections.md](05-projections.md) — what each of the four projections
  produces, surface by surface.
