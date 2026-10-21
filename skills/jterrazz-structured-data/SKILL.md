---
name: jterrazz-structured-data
description: 'JSON-LD structured data (schema.org): choosing types, required properties, validation, rich results. Use when the user mentions "schema", "structured data", "JSON-LD", "rich results", "rich snippets", or when adding machine-readable markup to pages. For the broader SEO audit see jterrazz-seo; for AI citation formatting see jterrazz-geo.'
---

# Structured data: JSON-LD

Schema tells engines _what an entity is_, unambiguously. Wrong or dishonest markup is worse than none: Google issues manual actions for schema that doesn't match visible content.

## Rules

- **JSON-LD only** (never microdata/RDFa), in a `<script type="application/ld+json">` in head or body.
- **Mirror visible content.** Never mark up ratings, FAQs, or facts that aren't on the page.
- Absolute URLs, ISO 8601 dates (`2026-07-20`), fully qualified `@id`s.
- Multiple entities on one page: bundle in a single `@graph` and cross-reference via `@id` (e.g. an article's `author` pointing at the site-wide `Person`).
- Stable `@id` scheme (`https://site.com/#person`, `https://site.com/#website`, `https://site.com/article-slug#article`) so entities link across pages.

## Which schema for which page

| Page                  | Types                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Home (personal site)  | `WebSite` + `Person` (or `Organization` for a company)                                       |
| Article / blog post   | `Article` or `BlogPosting` + `BreadcrumbList`, `author` pointing at `Person`                 |
| Product / app landing | `SoftwareApplication` (or `MobileApplication`) with `offers`, `aggregateRating` only if real |
| FAQ section           | `FAQPage` (only if Q&A is visibly on the page)                                               |
| How-to / tutorial     | `HowTo` with steps                                                                           |
| About / profile       | `ProfilePage` wrapping the `Person`                                                          |
| Local business        | `LocalBusiness` with NAP + `geo` + hours                                                     |

Property details per type: [§ Properties per type](#properties-per-type).

## Validation (non-negotiable, in this order)

1. **Google Rich Results Test** (search.google.com/test/rich-results): renders JavaScript, shows rich-result eligibility.
2. **validator.schema.org**: catches spec violations beyond Google's subset.
3. **Search Console, under Enhancements**: ongoing monitoring after deploy.

## Detection caveat

An agent's web-fetch tool may drop `<script>` tags, so **it cannot audit schema**; raw HTTP (`curl`) returns the served HTML, so JSON-LD in the server-rendered page is readable there, while JSON-LD injected by client-side JS needs a real browser. Check the raw HTML, the source that generates it (in Next.js: the JSON-LD builder + component), a real browser, or the Rich Results Test. Reference implementation: `jterrazz-web`'s `src/infrastructure/seo/json-ld.ts` (typed builders, unit-tested) rendered via a dedicated script component.

## Common mistakes

- Missing required properties (each rich result has its own required set; check the reference file).
- Relative URLs, non-ISO dates, `@id` collisions.
- `Person`/`Organization` inconsistencies across pages (different names/`sameAs` sets): pick one canonical entity definition and reuse it.
- Marking up the whole site as `FAQPage` hoping for real estate; eligibility is per-page and policed.

## Properties per type

Companion to `jterrazz-structured-data`. "Required" = required for the rich result / core meaning; "recommended" = strengthens the entity. Only include properties you can populate truthfully from visible content.

### Person

```json
{
    "@type": "Person",
    "@id": "https://site.com/#person",
    "name": "Ada Lovelace",
    "url": "https://site.com",
    "image": "https://site.com/portrait.jpg",
    "jobTitle": "Software engineer",
    "sameAs": ["https://github.com/ada", "https://x.com/ada", "https://linkedin.com/in/ada"]
}
```

`sameAs` is the identity-consolidation lever: list every canonical profile, keep the set identical everywhere the Person appears.

### WebSite

Required: `name`, `url`. Recommended: `description`, `inLanguage`, `publisher`/`author` pointing at the `@id` of the Person/Organization. Add `potentialAction` (SearchAction) only if the site has real search.

### Organization

Required: `name`, `url`. Recommended: `logo` (ImageObject), `sameAs`, `contactPoint`. Use instead of Person when the brand isn't an individual.

### Article / BlogPosting

Required: `headline` (≤110 chars), `image`, `datePublished`.
Recommended: `dateModified` (only when genuinely updated), `author` pointing at a Person with `url`, `publisher`, `description`, `inLanguage`, `mainEntityOfPage`.
Use `BlogPosting` for blog content, `Article` for editorial/news-like pieces.

### BreadcrumbList

`itemListElement` of `ListItem`s with `position`, `name`, `item` (absolute URL). Last item may omit `item`.

### SoftwareApplication / MobileApplication

Required: `name`, `offers` (with `price` and `priceCurrency`, `"price": "0"` for free) **or** `aggregateRating` for the rich result.
Recommended: `applicationCategory`, `operatingSystem` (`"iOS"`, `"iOS, Android"`), `screenshot`, `downloadUrl`/`installUrl` (App Store / Play Store URLs), `author`.
`aggregateRating` only with real review data (store ratings qualify; keep them fresh).

### FAQPage

`mainEntity`: array of `Question` (`name`) each with an `acceptedAnswer` holding an `Answer` (`text`). Every Q&A must be visible on the page. Google now shows FAQ rich results only for well-known authoritative sites: implement for the entity clarity, not the SERP real estate.

### HowTo

Required: `name`, `step` (array of `HowToStep` with `text`, optionally `name`, `image`, `url` anchors).
Recommended: `totalTime` (ISO 8601 duration, `PT30M`), `tool`, `supply`.

### ProfilePage

`mainEntity` points at the `Person` `@id`. It signals "this page is about this person", useful for about pages and author pages.

### LocalBusiness

Required: `name`, `address` (PostalAddress). Recommended: `geo` (GeoCoordinates), `openingHoursSpecification`, `telephone`, `priceRange`, `image`. NAP (name, address, phone) must match Google Business Profile exactly.

### ImageObject (photography pages)

`contentUrl`, `creator` (the Person), `creditText`, `copyrightNotice`, `license`. Google surfaces `creator`/`credit`/`license` in image search ("Licensable" badge).

### @graph composition example

```json
{
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": "https://site.com/#website",
            "name": "Ada Lovelace",
            "url": "https://site.com",
            "publisher": { "@id": "https://site.com/#person" }
        },

        { "@type": "Person", "@id": "https://site.com/#person", "name": "Ada Lovelace" },

        {
            "@type": "BlogPosting",
            "headline": "Notes on the Analytical Engine",
            "author": { "@id": "https://site.com/#person" },
            "mainEntityOfPage": "https://site.com/articles/slug"
        }
    ]
}
```

## Related skills

- **jterrazz-seo**: schema is layer 4 of the audit; crawlability and indexation come first.
- **jterrazz-geo**: entity clarity feeds AI attribution; `sameAs` links (GitHub, X, LinkedIn) consolidate identity.
