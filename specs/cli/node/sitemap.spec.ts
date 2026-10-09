import { directory, packed } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('sitemap', () => {
    test('every page is listed once per locale it exists in, with the priority and frequency of its kind', async () => {
        // Given - a page of every kind, an article in French only with no modified date, and one in no locale
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .exec('sitemap.mjs');

        // Then - each locale has its entry sharing one alternates cluster, lastModified only where a modified date is declared, and the page in no locale has none
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            [
                {
                    "alternates": {
                        "languages": {
                            "en": "https://site.test",
                            "fr": "https://site.test/fr",
                            "x-default": "https://site.test"
                        }
                    },
                    "changeFrequency": "weekly",
                    "priority": 1,
                    "url": "https://site.test"
                },
                {
                    "alternates": {
                        "languages": {
                            "en": "https://site.test",
                            "fr": "https://site.test/fr",
                            "x-default": "https://site.test"
                        }
                    },
                    "changeFrequency": "weekly",
                    "priority": 1,
                    "url": "https://site.test/fr"
                },
                {
                    "alternates": {
                        "languages": {
                            "en": "https://site.test/articles/1-hello",
                            "fr": "https://site.test/fr/articles/1-hello",
                            "x-default": "https://site.test/articles/1-hello"
                        }
                    },
                    "changeFrequency": "monthly",
                    "lastModified": "2026-01-02T00:00:00.000Z",
                    "priority": 0.8,
                    "url": "https://site.test/articles/1-hello"
                },
                {
                    "alternates": {
                        "languages": {
                            "en": "https://site.test/articles/1-hello",
                            "fr": "https://site.test/fr/articles/1-hello",
                            "x-default": "https://site.test/articles/1-hello"
                        }
                    },
                    "changeFrequency": "monthly",
                    "lastModified": "2026-01-02T00:00:00.000Z",
                    "priority": 0.8,
                    "url": "https://site.test/fr/articles/1-hello"
                },
                {
                    "alternates": {
                        "languages": {
                            "fr": "https://site.test/fr/articles/2-bonjour"
                        }
                    },
                    "changeFrequency": "monthly",
                    "priority": 0.8,
                    "url": "https://site.test/fr/articles/2-bonjour"
                },
                {
                    "alternates": {
                        "languages": {
                            "en": "https://site.test/articles",
                            "x-default": "https://site.test/articles"
                        }
                    },
                    "changeFrequency": "weekly",
                    "priority": 0.9,
                    "url": "https://site.test/articles"
                },
                {
                    "alternates": {
                        "languages": {
                            "en": "https://site.test/photographs",
                            "x-default": "https://site.test/photographs"
                        }
                    },
                    "changeFrequency": "monthly",
                    "priority": 0.6,
                    "url": "https://site.test/photographs"
                },
                {
                    "alternates": {
                        "languages": {
                            "en": "https://site.test/about",
                            "x-default": "https://site.test/about"
                        }
                    },
                    "changeFrequency": "monthly",
                    "priority": 0.5,
                    "url": "https://site.test/about"
                },
                {
                    "alternates": {
                        "languages": {
                            "en": "https://site.test/apps/tally",
                            "x-default": "https://site.test/apps/tally"
                        }
                    },
                    "changeFrequency": "monthly",
                    "priority": 0.7,
                    "url": "https://site.test/apps/tally"
                }
            ]
        `);
    });
});
