import { directory, packed } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('identity', () => {
    test('the site projects one WebSite published by one Person, under stable ids', async () => {
        // Given - a site whose identity declares a contact, a portrait and topics, and one that declares none of them
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .exec('identity.mjs');

        // Then - person() names its kind, the graph links the two nodes by id, and the optional fields appear exactly when declared
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            {
                "person()": {
                    "kind": "person",
                    "headline": "Writer",
                    "name": "Bo Bare",
                    "occupation": "Writer",
                    "profiles": []
                },
                "personId": "https://site.test/#person",
                "websiteId": "https://site.test/#website",
                "authorRef": {
                    "@id": "https://site.test/#person",
                    "@type": "Person",
                    "name": "Ada Example",
                    "url": "https://site.test"
                },
                "graph": {
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@id": "https://site.test/#website",
                            "@type": "WebSite",
                            "description": "Notes on software.",
                            "inLanguage": [
                                "en",
                                "fr"
                            ],
                            "name": "Ada Example",
                            "publisher": {
                                "@id": "https://site.test/#person"
                            },
                            "url": "https://site.test"
                        },
                        {
                            "@id": "https://site.test/#person",
                            "@type": "Person",
                            "description": "Notes on software.",
                            "email": "mailto:hi@site.test",
                            "image": "https://site.test/portrait.png",
                            "jobTitle": "Engineer",
                            "knowsAbout": [
                                "TypeScript",
                                "Search"
                            ],
                            "name": "Ada Example",
                            "sameAs": [
                                "https://github.com/ada",
                                "https://www.linkedin.com/in/ada"
                            ],
                            "url": "https://site.test"
                        }
                    ]
                },
                "person with no contact, portrait nor topics": {
                    "@id": "https://site.test/#person",
                    "@type": "Person",
                    "description": "Notes on software.",
                    "jobTitle": "Writer",
                    "name": "Bo Bare",
                    "sameAs": [],
                    "url": "https://site.test"
                }
            }
        `);
    });
});
