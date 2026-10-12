# Projections

The five surfaces `src/projections/` derives from one `SiteDefinition` and its `PageDefinition`s, and the one rule that keeps them from drifting apart: a URL is built in exactly one place.

## URL policy

`src/model/urls.ts` builds every URL. `urlFor(site, path, locale)` prefixes the path with its locale, except for the main locale unless `languages.prefixMain` is `true`. `alternatesFor(site, page)` gives one hreflang entry per locale the page exists in, plus `x-default` pointing at the main locale's URL — only when the page exists in the main locale, so no alternate names a page that is not there. Every projection below calls into this file rather than building a URL itself.

## Identity JSON-LD

`src/projections/json-ld.ts` projects one `Person` and one `WebSite`, each at a stable `@id` — `personId(site)` is `<address>/#person`, `websiteId(site)` is `<address>/#website`:

| Function               | Produces                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `projectAuthorRef`     | the reference authored content credits the Person with: its id, type, name and the site's address      |
| `projectPerson`        | the full Person: `email` (as `mailto:`), `image` and `knowsAbout` only when the identity declares them |
| `projectWebSite`       | the WebSite, its languages, published by the Person's id                                               |
| `projectIdentityGraph` | the `@graph` of both, WebSite first, rendered once from the root layout                                |

## Image JSON-LD

`projectImageObject(site, { contentUrl, description, acquireLicensePage })` projects an `ImageObject` credited to the Person: `creator` is the author reference, `creditText` and `copyrightNotice` carry the identity's name, and `license` is the site's `images.license`, declared once on `defineSite`. `acquireLicensePage` is the one thing each image says for itself — where its license is acquired — because Google asks `license` and `acquireLicensePage` together of an image that credits its creator (Search Console alert WNC-10030322). A site that declares no `images` is refused by name when it projects an image: a credited image without a license is the finding the [audit](audit.md) reports.

## Sitemap

`projectSitemap(site, pages)` emits one entry per page per locale it exists in — a page declared in no locale emits none. Each entry carries the page's alternates (the same cluster for every locale of a page), the `changeFrequency` and `priority` of its kind from `KIND_DEFAULTS`, and `lastModified` only when the page declares `dates.modified`: the projection never makes a date up.

| Kind         | Priority | Change frequency |
| ------------ | -------- | ---------------- |
| `home`       | 1        | weekly           |
| `collection` | 0.9      | weekly           |
| `article`    | 0.8      | monthly          |
| `software`   | 0.7      | monthly          |
| `gallery`    | 0.6      | monthly          |
| `profile`    | 0.5      | monthly          |

## Robots

`projectRobots(site)` always opens on one rule for every agent, allowing `/` and disallowing the declared `discovery.hidden` paths, and names `<address>/sitemap.xml`. Under `discovery.aiCrawlers: 'blocked'` it adds a full disallow for each of seven crawlers — `anthropic-ai`, `ChatGPT-User`, `ClaudeBot`, `Google-Extended`, `GPTBot`, `OAI-SearchBot`, `PerplexityBot`; `'welcome'` names none of them.

## llms.txt

`projectLlms(site, pages)` writes the markdown index [llmstxt.org](https://llmstxt.org) defines: the identity's name as the title, the voice's description as the summary, then an `Articles` section for the `article` pages and an `Experiments` section for the `software` pages, each section only when it lists a page. A page is linked at the main locale when it exists there, else at its first locale, and left out when it exists in none. A closed `Optional` section ends it: a photography link, the RSS feed when `channels.feed` is declared, and a GitHub link for each identity profile on `github.com`.

The summary paragraph and the photography link are written for jterrazz.com: every site projecting llms.txt reads them as they are.

## Related

- [Architecture](../concepts/architecture.md) — how the projections sit above the model.
- [Audit](audit.md) — the rules that verify these surfaces on a live site.
