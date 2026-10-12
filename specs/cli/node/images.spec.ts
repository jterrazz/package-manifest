import { directory, packed } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('images', () => {
    test('an image is credited to the Person and carries the license the site declares once', async () => {
        // Given - a site declaring one image license, one photo naming where its license is acquired, and a site declaring no license
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .exec('images.mjs');

        // Then - the ImageObject credits the Person and holds the default license and the acquire page (Search Console WNC-10030322), and a site without a license is refused by name
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(`
            {
                "image": {
                    "@type": "ImageObject",
                    "acquireLicensePage": "https://stock.test/@ada",
                    "contentUrl": "https://site.test/photos/1.jpg",
                    "copyrightNotice": "© Ada Example",
                    "creator": {
                        "@id": "https://site.test/#person",
                        "@type": "Person",
                        "name": "Ada Example",
                        "url": "https://site.test"
                    },
                    "creditText": "Ada Example",
                    "description": "A harbour at dusk",
                    "license": "https://site.test/license",
                    "name": "A harbour at dusk",
                    "thumbnailUrl": "https://site.test/photos/1.jpg"
                },
                "site without an image license": "projectImageObject needs a license: declare \`images: { license }\` on defineSite"
            }
        `);
    });
});
