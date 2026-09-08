# Testing

What proves a change to `@jterrazz/manifest`: module unit tests inside the
package, and the audit rule pack it ships for a consumer's own site.

| Question                               | Section           |
| -------------------------------------- | ----------------- |
| What proves the model and projections? | The unit tests    |
| What proves a consuming site conforms? | The audit         |
| How is the audit run?                  | Running the audit |

## The unit tests

A module's test is its sibling, `<file>.test.ts`, run with `vitest --run`
(`make test`, `package.json:33`): `src/core/model/urls.test.ts` proves the
URL policy (`urlFor`, `alternatesFor`), and
`src/core/projections/projections.test.ts` proves the four projections
against declared sites and pages. These run against the package alone — no
rendered page, no network.

## The audit

`src/testing/index.ts` ships `audit.website`, a rule pack proving a
CONSUMER's rendered or deployed site against its own `SiteDefinition`. It is
a closed namespace in the shape `specification` exposes: one method, no
options and no skip list — the manifest itself conditions which rules apply
(`channels/feed` runs exactly when a site declares it,
`src/testing/index.ts:96-102`). Ten named `vitest` tests, each reading like a
finding — rule, evidence, fix:

| Rule                                 | Proves                                                           |
| ------------------------------------ | ---------------------------------------------------------------- |
| `manifest/canonical-host`            | the homepage canonical points at the declared address            |
| `manifest/hreflang-self-and-default` | one alternate per declared locale, plus `x-default`              |
| `identity/single-person`             | exactly one `Person` node, at the stable `@id`                   |
| `discovery/robots-serves-sitemap`    | `robots.txt` allows, hides the declared paths, names the sitemap |
| `discovery/ai-crawlers-policy`       | the declared AI-crawler policy is what `robots.txt` says         |
| `channels/llms-index`                | `llms.txt` exists exactly when `channels.llms` is declared       |
| `channels/feed`                      | the feed exists exactly when `channels.feed` is declared         |
| `sharing/card-reachable`             | the sharing card is declared on the page and answers 200         |
| `voice/title-pattern`                | the homepage title carries the identity's name                   |
| `quality/console-silence`            | the homepage renders with no console error                       |

(`src/testing/index.ts:22-128`.)

## Running the audit

A consumer builds a `WebsiteSpecification` handle with `specification.website()`
from `@jterrazz/test`, then calls `audit.website(website, site)` against its
own `manifest.config.ts` declaration:

```ts
// specs/website/manifest/manifest.test.ts
import { audit } from '@jterrazz/manifest/testing';

audit.website(website, site); // website from specification.website() (@jterrazz/test)
```

`@jterrazz/test` is an optional peer (`package.json:44,49-51`) — a consumer
that never imports `@jterrazz/manifest/testing` never installs it. The
reference consumer running this audit today is `jterrazz-web`
(`skills/jterrazz-manifest/SKILL.md:31`).

## Related

- [01-architecture.md](01-architecture.md) — the audit entry among the three.
- [02-developing.md](02-developing.md) — where a new rule or a new sibling
  test goes.
