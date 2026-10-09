import { directory, packed } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('urls', () => {
    test('the main locale is unprefixed unless declared so, and x-default follows the main locale only where the page exists in it', async () => {
        // Given - a bilingual site, a page in both locales and one in French only
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .exec('urls.mjs');

        // Then - one address per locale, the main one prefixed only under prefixMain, no x-default for a page missing in the main locale
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            {
                "urlFor main": "https://site.test/articles",
                "urlFor other": "https://site.test/fr/articles",
                "urlFor main, prefixMain": "https://site.test/en/articles",
                "urlFor main, prefixMain false": "https://site.test/articles",
                "alternatesFor both locales": {
                    "en": "https://site.test/articles/1-hello",
                    "fr": "https://site.test/fr/articles/1-hello",
                    "x-default": "https://site.test/articles/1-hello"
                },
                "alternatesFor other locale only": {
                    "fr": "https://site.test/fr/articles/2-bonjour"
                },
                "alternatesFor both locales, prefixMain": {
                    "en": "https://site.test/en/articles/1-hello",
                    "fr": "https://site.test/fr/articles/1-hello",
                    "x-default": "https://site.test/en/articles/1-hello"
                }
            }
        `);
    });
});
