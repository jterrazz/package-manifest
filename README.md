# @jterrazz/reach

Define a site's reach once — identity, pages, discovery — and project it into every surface: metadata, identity JSON-LD, sitemap, robots.txt, llms.txt. A conformance suite (run through `specification.website()` from `@jterrazz/test`) keeps the projections honest against the real site.

## Install

```sh
npm install @jterrazz/reach
```

## Declare

```ts
// reach.config.ts
import { defineSite, person } from '@jterrazz/reach';

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
// specs/website/conformance/conformance.test.ts
import { conformance } from '@jterrazz/reach/testing';
conformance(website, site);
```

The model speaks the language of intent; the projections speak the language of standards. The domain knowledge (SEO, GEO, structured data, content) ships as agent skills in [`skills/`](skills/).

MIT © [Jean-Baptiste Terrazzoni](https://github.com/jterrazz)
