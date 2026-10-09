# Architecture

`@jterrazz/manifest` is a site's presence declared once and projected into every machine-facing surface, with an audit that checks a live site against the declaration. Three published entries carry that: the model and its projections, a Next.js adapter, and the audit rule pack.

## The three entries

`package.json#exports` publishes three ESM entries, each built by `typescript build` from the source the entry grammar names:

| Entry       | Built from             | Ships                                                                 |
| ----------- | ---------------------- | --------------------------------------------------------------------- |
| `.`         | `src/index.ts`         | the model and the projections                                         |
| `./next`    | `src/index.next.ts`    | the App Router adapter                                                |
| `./testing` | `src/index.testing.ts` | the audit rule pack, `audit.website` ([Audit](../reference/audit.md)) |

`next`, `vitest` and `@jterrazz/test` are optional peers: the build leaves them external, and a consumer that never imports `./next` or `./testing` never installs them. `./next` reads only the types of `next`, so its built module imports nothing of it at run time.

## Model and projections

The `.` entry re-exports two layers, and the dependency runs one way:

- **The model** (`src/model/`) speaks the language of intent: `defineSite`, `person`, `page`, and the URL policy (`urlFor`, `alternatesFor`). It names no standard — no Open Graph, no schema.org, no sitemap shape — and holds only what a projection or an audit rule reads: a field nothing reads is not declared.
- **The projections** (`src/projections/`) speak the language of standards, one file per surface, each reading the model and never the other way: the identity graph (`json-ld.ts`), the sitemap (`sitemap.ts`), robots.txt (`robots.ts`) and llms.txt (`llms.ts`). What each produces is [Projections](../reference/projections.md)'s.

Every page carries a `PageKind` (`article`, `collection`, `gallery`, `home`, `profile`, `software`), and `KIND_DEFAULTS` is the one table that turns a kind into a sitemap priority and change frequency: a page declared is a page fully projected, with no per-page ceremony at the call site.

The package never reads content. A consumer implements `PageProvider`, a function listing the pages of its own content sources, and hands the providers to the projections.

## The Next.js adapter

`src/index.next.ts` takes no decision of its own: `createSitemap`, `createRobots` and `createLlms` each wrap a projection into the shape an App Router file expects — `app/sitemap.ts`, `app/robots.ts`, a `llms.txt` route handler. A site on another framework calls the projections itself, as `jterrazz-web` (Astro) does.

## The audit entry

`src/index.testing.ts` exports `audit`, a closed namespace in the shape of `@jterrazz/test`'s `specification`: one method, `audit.website(website, site)`, no options and no skip list — the declaration itself conditions the rules. It registers ten vitest tests in the consumer's own website spec, each driving the `WebsiteSpecification` handle the consumer built. This entry is the one place production code imports test packages, and `jterrazz.config.ts` allows exactly those two (`test.production.allow`), with the reason each is run.

## Related

- [Develop](../guides/develop.md) — where a new file goes when it adds to one of these layers.
- [Projections](../reference/projections.md) — what each projection produces.
- [Audit](../reference/audit.md) — the ten rules, and how a consumer runs them.
