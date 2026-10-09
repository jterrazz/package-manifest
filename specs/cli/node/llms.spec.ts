import { directory, packed } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('llms', () => {
    test('llms.txt indexes the articles and the software under the identity, and lists the optional channels declared', async () => {
        // Given - a page of every kind, an article in French only and one in no locale, then a site with no feed, no GitHub profile and no page
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .exec('llms.mjs');

        // Then - the articles and the experiments in their sections, each at a locale it exists in, the other kinds and the unpublished article left out, and the feed and GitHub lines only when declared
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            # Ada Example

            > Notes on software.

            Ada Example (problem solver) builds small apps and tools, and writes notes on software, AI agents, and owning your own stack. Articles are available in English and French (French under /fr/).

            ## Articles

            - [Hello](https://site.test/articles/1-hello): A bilingual article.
            - [Bonjour](https://site.test/fr/articles/2-bonjour): An article in French only.

            ## Experiments

            - [Tally](https://site.test/apps/tally): A small app.

            ## Optional

            - [Photography](https://site.test/photographs): Photography portfolio
            - [RSS feed](https://site.test/feed.xml): Article feed
            - [GitHub](https://github.com/ada): Open-source work
            --- no feed, no GitHub profile, no page ---
            # Ada Example

            > Notes on software.

            Ada Example (problem solver) builds small apps and tools, and writes notes on software, AI agents, and owning your own stack. Articles are available in English and French (French under /fr/).

            ## Optional

            - [Photography](https://site.test/photographs): Photography portfolio
        `);
    });
});
