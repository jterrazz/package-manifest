import { directory, packed } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('audit', () => {
    test('a site that serves what its manifest declares passes every rule', async () => {
        // Given - a consumer's website spec running the audit against a site serving every declared surface, blocking the AI crawlers, its JSON-LD holding a null block and a null node beside its graph
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .link('@jterrazz/test')
            .link('vitest')
            .link('playwright')
            .exec('node_modules/vitest/vitest.mjs run');

        // Then - each of the ten rules passes
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            passed manifest/canonical-host — the homepage canonical points at the declared address
            passed manifest/hreflang-self-and-default — the homepage declares every locale and x-default
            passed identity/single-person — exactly one Person entity, with the canonical @id
            passed discovery/robots-serves-sitemap — robots.txt allows, hides, and names the sitemap
            passed discovery/ai-crawlers-policy — the declared AI policy is what robots.txt says
            passed channels/llms-index — llms.txt exists exactly when declared
            passed channels/feed — the feed exists exactly when declared
            passed sharing/card-reachable — the sharing card image answers and is declared on the page
            passed voice/title-pattern — the homepage title leads with the identity
            passed quality/console-silence — the homepage renders without console errors
        `);
    });

    test('a site that breaks every declared surface fails every rule, each naming what it found', async () => {
        // Given - the same audit against a site with the wrong canonical, one alternate of three, a second Person, a robots.txt hiding one path of two and naming neither the sitemap nor the AI crawlers its policy blocks, no llms.txt, no feed, no card, a title without the name and a console error
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .link('@jterrazz/test')
            .link('vitest')
            .link('playwright')
            .env({ SITE: 'broken' })
            .exec('node_modules/vitest/vitest.mjs run');

        // Then - each of the ten rules fails, with the evidence it read
        expect(result.exitCode).toBe(1);
        expect(result.stdout).toMatch(`
            failed manifest/canonical-host — the homepage canonical points at the declared address
                - Expected
                + Received

                  {
                -   "canonical": "https://site.test/",
                +   "canonical": "https://www.site.test/",
                    "status": 200,
                  }
            failed manifest/hreflang-self-and-default — the homepage declares every locale and x-default
                - Expected
                + Received

                  {
                -   "missing": [],
                -   "xDefault": "https://site.test/",
                +   "missing": [
                +     "fr",
                +   ],
                +   "xDefault": undefined,
                  }
            failed identity/single-person — exactly one Person entity, with the canonical @id
                - Expected
                + Received

                  [
                    {
                +     "id": "https://site.test/#me",
                +     "name": "Ada",
                +   },
                +   {
                      "id": "https://site.test/#person",
                      "name": "Ada Example",
                    },
                  ]
            failed discovery/robots-serves-sitemap — robots.txt allows, hides, and names the sitemap
                - Expected
                + Received

                  {
                -   "namesSitemap": true,
                +   "namesSitemap": false,
                    "status": 200,
                -   "unhidden": [],
                +   "unhidden": [
                +     "/go/",
                +   ],
                  }
            failed discovery/ai-crawlers-policy — the declared AI policy is what robots.txt says
                - Expected
                + Received

                  {
                -   "namesGPTBot": true,
                +   "namesGPTBot": false,
                  }
            failed channels/llms-index — llms.txt exists exactly when declared
                - Expected
                + Received

                  {
                -   "headed": true,
                -   "status": 200,
                +   "headed": false,
                +   "status": 404,
                  }
            failed channels/feed — the feed exists exactly when declared
                - Expected
                + Received

                - 200
                + 404
            failed sharing/card-reachable — the sharing card image answers and is declared on the page
                - Expected
                + Received

                  {
                -   "image": 200,
                -   "ogImage": "https://site.test/card.png",
                +   "image": 404,
                +   "ogImage": "https://site.test/cover.png",
                  }
            failed voice/title-pattern — the homepage title leads with the identity
                Expected: "Ada Example"
                Received: "Notes"
            failed quality/console-silence — the homepage renders without console errors
                - Expected
                + Received

                + hydration failed
        `);
    });

    test('a site welcoming the AI crawlers keeps its policy by naming none of them', async () => {
        // Given - the healthy site under a welcoming policy, its robots.txt naming no AI crawler
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .link('@jterrazz/test')
            .link('vitest')
            .link('playwright')
            .env({ SITE: 'welcoming,healthy' })
            .exec('node_modules/vitest/vitest.mjs run');

        // Then - every rule passes, the AI crawler policy among them
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            passed manifest/canonical-host — the homepage canonical points at the declared address
            passed manifest/hreflang-self-and-default — the homepage declares every locale and x-default
            passed identity/single-person — exactly one Person entity, with the canonical @id
            passed discovery/robots-serves-sitemap — robots.txt allows, hides, and names the sitemap
            passed discovery/ai-crawlers-policy — the declared AI policy is what robots.txt says
            passed channels/llms-index — llms.txt exists exactly when declared
            passed channels/feed — the feed exists exactly when declared
            passed sharing/card-reachable — the sharing card image answers and is declared on the page
            passed voice/title-pattern — the homepage title leads with the identity
            passed quality/console-silence — the homepage renders without console errors
        `);
    });
});
