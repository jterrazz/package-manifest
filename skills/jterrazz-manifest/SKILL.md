---
name: jterrazz-manifest
description: Wire a site into @jterrazz/manifest — defineSite/person/page model, projections (identity JSON-LD, sitemap, robots, llms.txt), Next adapter one-liners, and the audit rule pack run via specification.website(). Use when adding SEO surfaces to a site, creating manifest.config.ts, writing page providers, or running/debugging the manifest audit.
---

# @jterrazz/manifest — the manifest declares, the projections derive, the audit verifies

The site's presence is declared ONCE in `manifest.config.ts` (`defineSite`, `person`) and projected into every machine-facing surface. Never hand-roll a sitemap, robots.txt, llms.txt, or identity JSON-LD in a consuming site — wire the projection.

## Wiring a Next.js site

- `manifest.config.ts` at the repo root exports `site = defineSite({ address, languages, identity, voice, sharing, discovery, channels })`.
- Routes become one-liners: `app/sitemap.ts` → `export default createSitemap(site, providers)`; `app/robots.ts` → `createRobots(site)`; `app/llms.txt/route.ts` → `export const GET = createLlms(site, providers)` (all from `@jterrazz/manifest/next`).
- The identity `@graph` renders once from the root layout: `projectIdentityGraph(site)`; authored content references the Person via `projectAuthorRef(site)`.
- **Providers are the only bridge to content**: the app maps its repositories to `page({ kind, path, locales, … })` declarations — the package never reads content itself. Kinds (`home | article | collection | software | gallery | profile`) drive every surface default.

## The audit

```ts
// specs/website/manifest/manifest.test.ts
import { audit } from '@jterrazz/manifest/testing';
audit.website(website, site); // website from specification.website() (@jterrazz/test)
```

A closed namespace in the shape of `specification` — one method per subject, no options, no skip list: the manifest itself conditions the rules (`channels/feed` runs exactly when declared). Ten named rules (manifest/canonical-host, hreflang, identity/single-person, discovery, channels, sharing, voice, quality/console-silence) run against the built or deployed site. A failure reads as a finding: rule, evidence, fix.

## Boundaries

- Model = language of intent; projections = language of standards; never leak protocol vocabulary into `manifest.config.ts`.
- Judgment stays in the domain skills (jterrazz-seo, jterrazz-geo, jterrazz-structured-data, jterrazz-content-reach — same repo); the package codifies only what is mechanically checkable.
- Reference consumer: `jterrazz-web`.
