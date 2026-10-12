---
name: jterrazz-manifest
description: Wire a site into @jterrazz/manifest — defineSite/person/page model, projections (identity JSON-LD, image JSON-LD, sitemap, robots, llms.txt), Next adapter one-liners, and the audit rule pack run via specification.website(). Use when adding SEO surfaces to a site, creating manifest.config.ts, writing page providers, or running/debugging the manifest audit.
---

# @jterrazz/manifest — the manifest declares, the projections derive, the audit verifies

The site's presence is declared ONCE in `manifest.config.ts` (`defineSite`, `person`) and projected into every machine-facing surface. Never hand-roll a sitemap, robots.txt, llms.txt, or identity JSON-LD in a consuming site — wire the projection.

## Wiring a site

- `manifest.config.ts` at the repo root exports `site = defineSite({ address, languages, identity, voice, sharing, discovery, channels })`.
- Any framework calls the projections in its own routes: `projectSitemap(site, pages)`, `projectRobots(site)`, `projectLlms(site, pages)` (jterrazz-web, on Astro, does).
- On Next.js, routes become one-liners: `app/sitemap.ts` → `export default createSitemap(site, providers)`; `app/robots.ts` → `createRobots(site)`; `app/llms.txt/route.ts` → `export const GET = createLlms(site, providers)` (all from `@jterrazz/manifest/next`).
- The identity `@graph` renders once from the root layout: `projectIdentityGraph(site)`; authored content references the Person via `projectAuthorRef(site)`.
- Credited images: declare `images: { license }` once on `defineSite`, then `projectImageObject(site, { contentUrl, description, acquireLicensePage })` per image — Google recommends `license` and `acquireLicensePage` on a credited image, Search Console warns when they are missing, and the package requires them.
- **Providers are the only bridge to content**: the app maps its repositories to `page({ kind, path, locales, … })` declarations — the package never reads content itself. Kinds (`home | article | collection | software | gallery | profile`) drive every surface default.

## The audit

```ts
// specs/website/manifest/manifest.spec.ts
import { audit } from '@jterrazz/manifest/testing';
audit.website(website, site); // website from specification.website() (@jterrazz/test 17)
```

A closed namespace in the shape of `specification` — one method per subject, no options, no skip list: the manifest itself conditions the rules (`channels/feed` runs exactly when declared). Eleven named rules (manifest/canonical-host, hreflang, identity/single-person, identity/named-in-title, discovery, channels, sharing, images/credit-licensed, quality/console-silence) run against the built or deployed site. A failure reads as a finding: the rule, then what the site answered. The rules and what each checks: `docs/reference/audit.md`.

## Boundaries

- Model = language of intent; projections = language of standards; never leak protocol vocabulary into `manifest.config.ts`.
- Judgment stays in the domain skills (jterrazz-seo, jterrazz-geo, jterrazz-structured-data, jterrazz-content-reach — same repo); the package codifies only what is mechanically checkable.
- Reference consumer: `jterrazz-web` (Astro: the projections in its own routes, the audit in its own website specs).
