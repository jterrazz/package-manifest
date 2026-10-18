---
name: jterrazz-seo
description: Technical and on-page SEO for web projects: audit workflow, crawlability, indexation, Core Web Vitals, metadata, canonicals, hreflang, internal linking. Use when the user mentions "SEO", "SEO audit", "not ranking", "traffic dropped", "meta tags", "sitemap", "robots.txt", "canonical", "hreflang", "Core Web Vitals", "indexing", or wants more organic traffic. Even a vague "my SEO is bad" starts here with an audit. For AI/LLM search visibility see jterrazz-geo; for JSON-LD see jterrazz-structured-data; for content strategy and distribution see jterrazz-content-reach.
---

# SEO: technical & on-page

Diagnose before prescribing. An SEO problem is almost never one thing; audit in priority order and report evidence, not vibes.

## Priority order

Fix in this order, since each layer is worthless without the one above it:

1. **Crawlability**: can engines reach the pages? (robots.txt, sitemap, internal links, orphan pages)
2. **Indexation**: are the right pages indexed? (noindex, canonicals, redirect chains, soft 404s, duplicates)
3. **Technical foundations**: speed, mobile, HTTPS. Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1.
4. **On-page**: titles, descriptions, headings, content-keyword alignment.
5. **Content quality & authority**: depth, E-E-A-T, links. Last, not first.

## Audit workflow

1. **Context first.** Which pages/keywords matter most? Search Console access? Recent changes or migrations? Traffic baseline? Don't audit blind.
2. **Crawl the real site**, not the repo: check `robots.txt`, `/sitemap.xml`, a few key pages' rendered HTML. In the repo, verify what generates them.
3. **Report every finding as:** the issue, its impact (High/Med/Low), the evidence (how you found it), the fix (a specific action) and its priority.
4. **Close with:** overall health, top 3 to 5 priorities, quick wins (easy + immediate), long-term items.

## Measurement traps (report false findings and you lose trust)

- **Plain HTTP fetches strip `<script>` tags**: JSON-LD and JS-injected markup are invisible to `curl`/web-fetch. Never report "missing schema" from a fetch; verify with a browser (`document.querySelectorAll('script[type="application/ld+json"]')`) or Google's Rich Results Test.
- **Client-side-rendered content** may be absent from initial HTML. Check the SSR/SSG output before declaring content thin or missing.
- `site:domain.com` counts are approximate; use Search Console coverage for real indexation data.

## On-page essentials

| Element          | Rule                                                                             |
| ---------------- | -------------------------------------------------------------------------------- |
| Title            | Unique, primary keyword near the start, 50 to 60 chars, compelling               |
| Meta description | Unique, 150 to 160 chars, value proposition + reason to click                    |
| H1               | Exactly one, contains the keyword, logical H2/H3 hierarchy below                 |
| URL              | Short, lowercase, hyphenated, descriptive, stable                                |
| Content          | Keyword in first 100 words, satisfies the search intent, deeper than competitors |
| Images           | Descriptive filenames, alt text, modern formats, lazy-load below the fold        |
| Internal links   | Important pages get the most links; descriptive anchors; no broken links         |

Per-page: one clear primary keyword, no two pages targeting the same one (cannibalization). Site-wide: map each keyword to its page, cluster topics.

## i18n (multi-locale sites)

- Every page: **self-referencing hreflang + reciprocal pairs + `x-default`**. One missing return link drops the whole pair.
- Codes are ISO 639-1 (+ optional region): `en`, `en-GB`, never `en-UK`.
- Each locale **self-canonicals**. Cross-locale canonicals kill indexing of the other locales.
- Only ship locales you fully translate (title + meta + body, not just chrome). Thin locales drag the whole site down: better absent than machine-thin.
- Locale in the URL path (`/fr/`), never via IP/Accept-Language negotiation.

## Next.js App Router notes

- `app/sitemap.ts`, `app/robots.ts`, and the Metadata API are the canonical mechanisms; no third-party SEO packages.
- **Caveat:** `alternates.languages` does not auto-add the self-referencing hreflang for the current locale, so add it explicitly.
- Wire a site into `@jterrazz/manifest` (`package-manifest`) rather than hand-rolling these surfaces: `manifest.config.ts` is the single source of truth, the sitemap, robots.txt and llms.txt are projected from it (one-liner routes with `@jterrazz/manifest/next`), the identity JSON-LD is a projected `@graph`, and a website spec runs the `audit.website(website, site)` rule pack against the built site via `specification.website()` (`@jterrazz/test`). Reference consumer: `jterrazz-web`, on Astro.

## Deep checklists

Work top-down; each section maps to the priority order above.

### 1. Crawlability

#### robots.txt

- No unintentional blocks on important paths; `Disallow` only for API routes, internals, redirect endpoints.
- References the sitemap (`Sitemap: https://example.com/sitemap.xml`).

#### XML sitemap

- Accessible, valid XML, submitted to Search Console.
- Contains canonical URLs only (no redirects, no noindexed pages, no 404s).
- `lastModified` reflects real content changes; engines learn to ignore fake freshness.
- Multi-locale: `xmlns:xhtml` namespace, `<xhtml:link>` alternates for all locales **including self** and `x-default`, absolute URLs everywhere.

#### Architecture

- Every important page ≤ 3 clicks from the homepage.
- No orphan pages (in sitemap but linked from nowhere).
- Large sites: parameterized URLs and faceted navigation under control (crawl budget).

### 2. Indexation

- Search Console coverage: indexed count ≈ expected count; investigate gaps.
- No `noindex` on important pages (check both meta tag and `X-Robots-Tag` header).
- Canonicals: unique self-reference per page; consistent HTTPS, host, and trailing-slash form across canonical + sitemap + hreflang + internal links.
- No redirect chains or loops; internal links point at final URLs.
- Soft 404s (thin "not found"-ish pages returning 200) cleaned up.
- Duplicate/near-duplicate content consolidated with canonicals or merged.

### 3. Technical foundations

**Core Web Vitals**: LCP < 2.5s, INP < 200ms, CLS < 0.1 (field data from the CWV report beats lab data).

Speed levers, in usual impact order: TTFB (caching/CDN/SSG), image sizing + modern formats, JavaScript payload, font loading (no invisible-text flash), CSS delivery, caching headers.

**Mobile**: responsive (one URL), correct viewport, adequate tap targets, no horizontal scroll, desktop feature parity (mobile-first indexing).

**Security**: HTTPS site-wide, valid cert, no mixed content, a 301 from HTTP to HTTPS, HSTS optional.

### 4. On-page issues to hunt

- Duplicate or truncated titles/descriptions across pages (template bugs).
- Multiple H1s, skipped heading levels, headings used for styling.
- Thin pages: tag/category indexes with no unique value, doorway pages.
- Keyword cannibalization: two URLs ranking-flip for the same query.
- Broken internal links, generic anchors ("click here").

### 5. Content quality / E-E-A-T

- **Experience**: first-hand evidence: real examples, screenshots, numbers, lessons.
- **Expertise**: author identified with credentials; claims sourced.
- **Authoritativeness**: cited by others, consistent entity info (name, links, profiles).
- **Trust**: accurate, dated, contact/about pages, HTTPS, privacy policy.
- Decay: pages that lost traffic usually need a refresh (update facts, expand, re-date honestly) before any new content is written.

### Common issues by site type

| Site type            | Usual suspects                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Portfolio / personal | Missing Person/WebSite schema, weak internal linking from home to best work, no author entity consistency across profiles |
| SaaS / product       | Shallow product pages, blog disconnected from product pages, missing comparison/alternative pages                         |
| Content / blog       | Outdated posts never refreshed, cannibalization, no clustering, missing author pages                                      |
| Multi-locale         | Hreflang missing returns or self-refs, cross-locale canonicals, partially translated pages, no x-default                  |
| E-commerce           | Thin categories, duplicated descriptions, facet-generated duplicates, missing Product schema                              |

### Tools

Free and sufficient for most audits: Google Search Console, PageSpeed Insights, Rich Results Test (renders JS, so use it for schema), Bing Webmaster Tools. Paid, when scale demands: Screaming Frog, Ahrefs/Semrush.

## Related skills

- **jterrazz-geo**: citations in ChatGPT/Perplexity/AI Overviews, llms.txt, AI crawlers.
- **jterrazz-structured-data**: JSON-LD implementation and validation.
- **jterrazz-content-reach**: what to write and how to distribute it.
