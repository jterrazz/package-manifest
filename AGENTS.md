# Agent brief — `@jterrazz/manifest`

The manifest declares, the projections derive, the audit verifies. A site's presence declared once, projected into every machine-facing surface, checked against the live site. Three entries: `.` (model + projections), `./next` (App Router adapter), `./testing` (`audit.website`, run through `specification.website()`).

## Layout

```
src/core/model/         # the language of intent: defineSite, person, page, url policy
src/core/projections/   # the language of standards: json-ld, sitemap, robots, llms
src/next/               # createSitemap / createRobots / createLlms
src/testing/            # conformance(website, site) — needs @jterrazz/test (peer)
skills/                 # the domain skills (seo, geo, structured-data, content-reach)
                        # + jterrazz-manifest (wiring this package)
```

## Rules

- Model never imports projections' vocabulary; protocol names (Open Graph, schema.org, robots) live in `src/core/projections/` only.
- The package never reads content — consumers implement `PageProvider`s.
- Module unit tests are siblings (`<file>.test.ts`); `make build lint test` must stay green.
- Domain knowledge (judgment) belongs in `skills/`; the package codifies only what is mechanically checkable. A new mechanical invariant goes into `src/testing/` as a named conformance rule.
