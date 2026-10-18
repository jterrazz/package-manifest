# @jterrazz/manifest

Your site's presence, declared once. The manifest declares identity, pages and discovery; the projections derive every machine-facing surface from it (identity JSON-LD, image JSON-LD, sitemap, robots.txt, llms.txt), and the audit (run through `specification.website()` from `@jterrazz/test`) verifies the live site against it.

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
    identity: person({
        name: 'Ada Lovelace',
        headline: 'Engineer',
        occupation: 'Software engineer',
        profiles: [],
    }),
    voice: { description: 'Notes on engines and numbers.' },
    sharing: { card: { image: '/og.png' } },
    discovery: { hidden: ['/api/'], aiCrawlers: 'welcome' },
    channels: { feed: true, llms: true },
});
```

## Project

The projections are plain functions of the declaration and of the pages a site lists (`projectIdentityGraph`, `projectSitemap`, `projectRobots`, `projectLlms`), for any framework. On Next.js, `@jterrazz/manifest/next` turns each route into one line:

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
// specs/website/manifest/manifest.spec.ts
import { audit } from '@jterrazz/manifest/testing';
audit.website(website, site); // website from specification.website() (@jterrazz/test 17)
```

The model speaks the language of intent; the projections speak the language of standards. The domain knowledge (SEO, GEO, structured data, content) ships as agent skills in [`skills/`](skills/).

## Documentation

The manual lives in [`docs/`](docs/README.md):

- [Architecture](docs/concepts/architecture.md): the three entries, the model and the projections, the audit entry.
- [Develop](docs/guides/develop.md): the declaration, the gestures, where a new file goes.
- [Test](docs/guides/test.md): the specs from the tarball and the audit spec.
- [Release](docs/guides/release.md): what publishes the package, and its peer range.
- [Projections](docs/reference/projections.md): URL policy, identity and image JSON-LD, sitemap, robots, llms.txt.
- [Audit](docs/reference/audit.md): the eleven rules of `audit.website`.

MIT © [Jean-Baptiste Terrazzoni](https://github.com/jterrazz)
