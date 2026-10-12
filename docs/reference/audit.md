# Audit

`@jterrazz/manifest/testing` ships `audit.website(website, site)`: eleven vitest tests that verify a rendered or deployed site against its own declaration. A consumer calls it in a website spec, with the handle `specification.website()` of `@jterrazz/test` returns:

```ts
// specs/website/manifest/manifest.spec.ts
import { audit } from '@jterrazz/manifest/testing';

import { site } from '../../../manifest.config.js';
import { website } from '../website.specification.js';

audit.website(website, site);
```

There are no options and no skip list: the declaration conditions the rules — `channels/feed` asks for a feed exactly when `channels.feed` is declared. Each rule is a test named after what it guards, so a failure reads as a finding: the rule, then what the site answered.

| Rule                                 | Passes when                                                                                                                                                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `manifest/canonical-host`            | the homepage answers 200 and its canonical is `<address>/`                                                                                                                                                 |
| `manifest/hreflang-self-and-default` | the homepage declares an alternate per declared locale, and `x-default` at `<address>/`                                                                                                                    |
| `identity/single-person`             | the homepage's JSON-LD holds exactly one `Person`, at `<address>/#person`, with the declared name                                                                                                          |
| `discovery/robots-serves-sitemap`    | `robots.txt` answers 200, names `<address>/sitemap.xml` and disallows each hidden path                                                                                                                     |
| `discovery/ai-crawlers-policy`       | `robots.txt` names `GPTBot` exactly when the policy is `blocked`                                                                                                                                           |
| `channels/llms-index`                | `llms.txt` answers 200 and opens on `# <name>` when declared, 404 when not                                                                                                                                 |
| `channels/feed`                      | `/feed.xml` answers 200 when declared, 404 when not                                                                                                                                                        |
| `sharing/card-reachable`             | the homepage's `og:image` is the declared card, and the card answers 200                                                                                                                                   |
| `identity/named-in-title`            | the homepage title holds the identity's name                                                                                                                                                               |
| `images/credit-licensed`             | every `ImageObject` in the JSON-LD of the homepage and of each page the sitemap lists that carries `creator`, `creditText`, `copyrightNotice` or `license` also carries `license` and `acquireLicensePage` |
| `quality/console-silence`            | the homepage renders with no console error                                                                                                                                                                 |

`images/credit-licensed` is the one rule that leaves the homepage: images live on gallery and article pages, so it visits each page `/sitemap.xml` lists (its `<loc>` entries; a nested sitemap index is not followed) and names the page beside each offending image. A site serving no sitemap is audited on its homepage alone, and an image on a page the sitemap omits is not seen.

The rules are written against `@jterrazz/test` 17's result accessors, its peer range: the `.visit()` rules render the homepage in Playwright's Chromium, an optional peer of `@jterrazz/test` the consumer installs.

## Related

- [Projections](projections.md) — what the surfaces the rules read hold, when a site projects them.
- [Test](../guides/test.md) — how this package proves the rules pass and fail.
