# Projections

The four surfaces `src/projections/` derives from one `SiteDefinition`
and its `PageDefinition`s — what each one produces, and the one rule that
keeps them from drifting apart: URLs are built in exactly one place.

| Question                            | Section          |
| ----------------------------------- | ---------------- |
| Where does every URL come from?     | URL policy       |
| What does the identity graph carry? | Identity JSON-LD |
| What does the sitemap carry?        | Sitemap          |
| What does robots.txt carry?         | Robots           |
| What does llms.txt carry?           | Llms.txt         |

## URL policy

`src/model/urls.ts` is the one place a URL is built. `urlFor` applies
the locale prefix (skipping it for the main locale unless
`languages.prefixMain` says otherwise, `urls.ts:11-14`); `alternatesFor`
turns a page's declared locales into one hreflang entry per locale plus
`x-default`, added only when the page genuinely exists in the main locale
(`urls.ts:20-29`). Every projection below calls into this file rather than
building a URL itself.

## Identity JSON-LD

`src/projections/json-ld.ts` projects one `Person` and one `WebSite`
node, each at a stable `@id` (`${address}/#person`,
`${address}/#website`, `json-ld.ts:9-15`):

- `projectAuthorRef` — the small reference authored content uses to credit
  the Person (`json-ld.ts:18-25`).
- `projectPerson` — the full canonical entity: contact, portrait and topics
  are included only when the site declares them (`json-ld.ts:28-42`).
- `projectWebSite` — the `WebSite` node, published by the Person
  (`json-ld.ts:45-55`).
- `projectIdentityGraph` — the `@graph` of both, rendered once from the root
  layout (`json-ld.ts:58-63`).

## Sitemap

`src/projections/sitemap.ts`'s `projectSitemap` emits one entry per page
per existing locale. `changeFrequency` and `priority` come from
`KIND_DEFAULTS` (`src/model/page.ts:39-49`), and `lastModified` is
included only when a page states a `dates.modified` — the projection never
fabricates a date (`sitemap.ts:18-32`).

## Robots

`src/projections/robots.ts`'s `projectRobots` always allows `/` while
disallowing the site's declared `discovery.hidden` paths, and names the
sitemap. When `discovery.aiCrawlers` is `'blocked'`, it adds an explicit
disallow rule for each crawler in the closed list `AI_CRAWLERS`
(`robots.ts:10-18`, `anthropic-ai`, `ChatGPT-User`, `ClaudeBot`,
`Google-Extended`, `GPTBot`, `OAI-SearchBot`, `PerplexityBot`); `'welcome'`
leaves the generic allow untouched (`robots.ts:25-35`).

## Llms.txt

`src/projections/llms.ts`'s `projectLlms` builds the markdown index
defined at [llmstxt.org](https://llmstxt.org): the identity and voice
description first, then an "Articles" section and an "Experiments" section
for the page kinds `KIND_DEFAULTS` marks `llms: true` (`article` and
`software`, `page.ts:43,48`), and a closed "Optional" section — a
photography link, the RSS feed when `channels.feed` is declared, and a
GitHub link derived from the identity's profiles (`llms.ts:10-43`).

## Related

- [01-architecture.md](01-architecture.md) — how the projections layer sits
  above the model.
- [03-testing.md](03-testing.md) — the audit rules that verify these
  surfaces on a live site.
