import { directory, packed } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('robots', () => {
    test('the AI crawler policy decides which bots robots.txt names', async () => {
        // Given - the same site welcoming AI crawlers, then blocking them
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .exec('robots.mjs');

        // Then - one generic rule hiding the declared paths, plus a full disallow per AI crawler when blocked, and the canonical sitemap
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            {
                "welcome": {
                    "rules": [
                        {
                            "allow": "/",
                            "disallow": [
                                "/api/",
                                "/go/"
                            ],
                            "userAgent": "*"
                        }
                    ],
                    "sitemap": "https://site.test/sitemap.xml"
                },
                "blocked": {
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
                }
            }
        `);
    });
});
