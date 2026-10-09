import { directory, packed } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('next', () => {
    test('the App Router adapter serves the projections in the shapes Next.js reads', async () => {
        // Given - the adapter's three handlers, the pages handed by two providers
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .exec('next.mjs');

        // Then - the robots and sitemap routes return the projections, and the llms.txt route answers the index as cached plain text
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            {
                "robots": {
                    "rules": [
                        {
                            "allow": "/",
                            "disallow": [
                                "/api/",
                                "/go/"
                            ],
                            "userAgent": "*"
                        },
                        {
                            "disallow": [
                                "/"
                            ],
                            "userAgent": "anthropic-ai"
                        },
                        {
                            "disallow": [
                                "/"
                            ],
                            "userAgent": "ChatGPT-User"
                        },
                        {
                            "disallow": [
                                "/"
                            ],
                            "userAgent": "ClaudeBot"
                        },
                        {
                            "disallow": [
                                "/"
                            ],
                            "userAgent": "Google-Extended"
                        },
                        {
                            "disallow": [
                                "/"
                            ],
                            "userAgent": "GPTBot"
                        },
                        {
                            "disallow": [
                                "/"
                            ],
                            "userAgent": "OAI-SearchBot"
                        },
                        {
                            "disallow": [
                                "/"
                            ],
                            "userAgent": "PerplexityBot"
                        }
                    ],
                    "sitemap": "https://site.test/sitemap.xml"
                },
                "sitemap": [
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
                                "en": "https://site.test/apps/tally",
                                "x-default": "https://site.test/apps/tally"
                            }
                        },
                        "changeFrequency": "monthly",
                        "priority": 0.7,
                        "url": "https://site.test/apps/tally"
                    }
                ],
                "llms": {
                    "status": 200,
                    "headers": {
                        "cache-control": "public, max-age=3600",
                        "content-type": "text/plain; charset=utf-8"
                    },
                    "body": "# Ada Example\\n\\n> Notes on software.\\n\\nAda Example (problem solver) builds small apps and tools, and writes notes on software, AI agents, and owning your own stack. Articles are available in English and French (French under /fr/).\\n\\n## Articles\\n\\n- [Hello](https://site.test/articles/1-hello): A bilingual article.\\n\\n## Experiments\\n\\n- [Tally](https://site.test/apps/tally): A small app.\\n\\n## Optional\\n\\n- [Photography](https://site.test/photographs): Photography portfolio\\n- [RSS feed](https://site.test/feed.xml): Article feed\\n- [GitHub](https://github.com/ada): Open-source work\\n"
                }
            }
        `);
    });
});
