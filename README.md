# @jterrazz/manifest

Your site's presence, declared once. The manifest declares — identity, pages, discovery — the projections derive every surface from it (metadata, identity JSON-LD, sitemap, robots.txt, llms.txt), and the audit (run through `specification.website()` from `@jterrazz/test`) verifies the live site against it.

## Install

```sh
npm install @jterrazz/manifest
```

## Declare

```ts
// manifest.config.ts
import { defineSite, person } from '@jterrazz/manifest';

export const site = defineSite({
    address: 'https://example.com',
    languages: { all: ['en', 'fr'], main: 'en' },
    identity: person({ name: '…', headline: '…', occupation: '…', profiles: [] }),
    voice: { brand: '…', description: '…', titlePattern: '%s | …' },
    sharing: { card: { image: '/og.png', caption: '…', width: 1200, height: 630 } },
    discovery: { hidden: ['/api/'], aiCrawlers: 'welcome' },
    channels: { feed: true, llms: true },
});
```

## Project (Next.js)

```ts
// app/sitemap.ts
export default createSitemap(site, [articlesProvider, pagesProvider]);
// app/robots.ts
export default createRobots(site);
// app/llms.txt/route.ts
export const GET = createLlms(site, [articlesProvider]);
```

## Verify

```ts
// specs/website/manifest/manifest.test.ts
import { audit } from '@jterrazz/manifest/testing';
audit.website(website, site); // website from specification.website() (@jterrazz/test)
```

The model speaks the language of intent; the projections speak the language of standards. The domain knowledge (SEO, GEO, structured data, content) ships as agent skills in [`skills/`](skills/).

## Documentation

The full corpus lives in [`docs/`](docs/):

- [Architecture](docs/01-architecture.md) — the three entries, the model/projections boundary, the audit entry.
- [Developing](docs/02-developing.md) — install and wiring, the commands, where a new file goes.
- [Testing](docs/03-testing.md) — the unit tests and the ten-rule audit pack.
- [Operating](docs/04-operating.md) — what publishes it, and which version ships.
- [Projections](docs/05-projections.md) — URL policy, identity JSON-LD, sitemap, robots, llms.txt.

MIT © [Jean-Baptiste Terrazzoni](https://github.com/jterrazz)
