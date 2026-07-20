---
name: jterrazz-reach
description: Wire a site into @jterrazz/reach — defineSite/person/page model, projections (identity JSON-LD, sitemap, robots, llms.txt), Next adapter one-liners, and the conformance rule pack run via specification.website(). Use when adding SEO surfaces to a site, creating reach.config.ts, writing page providers, or running/debugging the reach conformance suite.
---

# @jterrazz/reach — define once, project everywhere

The site's reach is declared ONCE in `reach.config.ts` (`defineSite`, `person`) and projected into every surface. Never hand-roll a sitemap, robots.txt, llms.txt, or identity JSON-LD in a consuming site — wire the projection.

## Wiring a Next.js site

- `reach.config.ts` at the repo root exports `site = defineSite({ address, languages, identity, voice, sharing, discovery, channels })`.
- Routes become one-liners: `app/sitemap.ts` → `export default createSitemap(site, providers)`; `app/robots.ts` → `createRobots(site)`; `app/llms.txt/route.ts` → `export const GET = createLlms(site, providers)` (all from `@jterrazz/reach/next`).
- The identity `@graph` renders once from the root layout: `projectIdentityGraph(site)`; authored content references the Person via `projectAuthorRef(site)`.
- **Providers are the only bridge to content**: the app maps its repositories to `page({ kind, path, locales, … })` declarations — the package never reads content itself. Kinds (`home | article | collection | software | gallery | profile`) drive every surface default.

## The conformance suite

```ts
// specs/website/conformance/conformance.test.ts
import { conformance } from '@jterrazz/reach/testing';
conformance(website, site); // website from specification.website() (@jterrazz/test)
```

Ten named rules (reach/canonical-host, hreflang, identity/single-person, discovery, channels, sharing, voice, console-silence) run against the built or deployed site. A failure reads as a finding: rule, evidence, fix.

## Boundaries

- Model = language of intent; projections = language of standards; never leak protocol vocabulary into `reach.config.ts`.
- Judgment stays in the domain skills (jterrazz-seo, jterrazz-geo, jterrazz-structured-data, jterrazz-content-reach — same repo); the package codifies only what is mechanically checkable.
- Reference consumer: `jterrazz-web`.
