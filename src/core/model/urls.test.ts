import { describe, expect, test } from 'vitest';

import { page } from './page.js';
import { defineSite, person } from './site.js';
import { alternatesFor, urlFor } from './urls.js';

const site = defineSite({
    address: 'https://site.test',
    channels: { feed: true, llms: true },
    discovery: { aiCrawlers: 'welcome', hidden: ['/api/'] },
    identity: person({ headline: 'Maker', name: 'Test', occupation: 'Engineer', profiles: [] }),
    languages: { all: ['en', 'fr'], main: 'en' },
    sharing: { card: { caption: 'Test', height: 630, image: '/card.png', width: 1200 } },
    voice: { brand: 'T', description: 'A test site.', titlePattern: '%s | T' },
});

describe('url policy', () => {
    test('the main locale is unprefixed, others carry their prefix', () => {
        // Given - the same path in both locales
        // Then - one address, locale in the path only when needed
        expect(urlFor(site, '/articles', 'en')).toBe('https://site.test/articles');
        expect(urlFor(site, '/articles', 'fr')).toBe('https://site.test/fr/articles');
    });

    test('alternates cover existing locales and x-default follows main', () => {
        // Given - a page existing in both locales
        const both = page({
            description: 'd',
            kind: 'article',
            locales: ['en', 'fr'],
            path: '/a',
            title: 't',
        });

        // Then - one alternate per locale plus x-default on the main one
        expect(alternatesFor(site, both)).toEqual({
            en: 'https://site.test/a',
            fr: 'https://site.test/fr/a',
            'x-default': 'https://site.test/a',
        });
    });

    test('x-default is omitted when the main locale does not exist', () => {
        // Given - a page existing only in french
        const frOnly = page({
            description: 'd',
            kind: 'article',
            locales: ['fr'],
            path: '/a',
            title: 't',
        });

        // Then - no x-default pointing at a page that is not there
        expect(alternatesFor(site, frOnly)).toEqual({ fr: 'https://site.test/fr/a' });
    });
});
