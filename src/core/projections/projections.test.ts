import { describe, expect, test } from 'vitest';

import { page } from '../model/page.js';
import { defineSite, person } from '../model/site.js';
import { projectIdentityGraph } from './json-ld.js';
import { projectLlms } from './llms.js';
import { projectRobots } from './robots.js';
import { projectSitemap } from './sitemap.js';

const site = defineSite({
    address: 'https://site.test',
    channels: { feed: true, llms: true },
    discovery: { aiCrawlers: 'welcome', hidden: ['/api/', '/go/'] },
    identity: person({
        contact: 'hi@site.test',
        headline: 'Problem solver',
        name: 'Test Person',
        occupation: 'Engineer',
        profiles: ['https://github.com/test'],
    }),
    languages: { all: ['en', 'fr'], main: 'en' },
    sharing: { card: { caption: 'Test', height: 630, image: '/card.png', width: 1200 } },
    voice: { brand: 'T', description: 'A test site.', titlePattern: '%s | T' },
});

const article = page({
    dates: { modified: '2026-01-02', published: '2026-01-01' },
    description: 'An article.',
    kind: 'article',
    locales: ['en', 'fr'],
    path: '/articles/1-hello',
    title: 'Hello',
});

describe('robots projection', () => {
    test('welcome policy hides only the declared paths and names the sitemap', () => {
        // Given - an AI-welcoming site
        const robots = projectRobots(site);

        // Then - one generic rule, the declared hidden paths, the canonical sitemap
        expect(robots.rules).toHaveLength(1);
        expect(robots.rules[0].disallow).toEqual(['/api/', '/go/']);
        expect(robots.sitemap).toBe('https://site.test/sitemap.xml');
    });

    test('blocked policy names the AI crawlers', () => {
        // Given - the same site shutting AI crawlers out
        const robots = projectRobots({
            ...site,
            discovery: { ...site.discovery, aiCrawlers: 'blocked' },
        });

        // Then - each bot gets its own full disallow
        expect(robots.rules.some((rule) => rule.userAgent === 'GPTBot')).toBe(true);
    });
});

describe('sitemap projection', () => {
    test('one entry per existing locale, shared alternates, honest lastModified', () => {
        // Given - one bilingual article
        const entries = projectSitemap(site, [article]);

        // Then - two entries pointing at the same alternates cluster
        expect(entries).toHaveLength(2);
        expect(entries[0].url).toBe('https://site.test/articles/1-hello');
        expect(entries[1].url).toBe('https://site.test/fr/articles/1-hello');
        expect(entries[0].alternates.languages['x-default']).toBe(
            'https://site.test/articles/1-hello',
        );
        expect(entries[0].lastModified).toEqual(new Date('2026-01-02'));
    });
});

describe('identity graph projection', () => {
    test('one WebSite and one Person, linked by stable ids', () => {
        // Given - the site identity
        const [websiteNode, personNode] = projectIdentityGraph(site)['@graph'] as unknown as [
            Record<string, unknown>,
            Record<string, unknown>,
        ];

        // Then - the person publishes the site under the canonical ids
        expect(websiteNode['@id']).toBe('https://site.test/#website');
        expect(personNode['@id']).toBe('https://site.test/#person');
        expect(websiteNode['publisher']).toEqual({ '@id': 'https://site.test/#person' });
        expect(personNode['email']).toBe('mailto:hi@site.test');
    });
});

describe('llms projection', () => {
    test('articles opt in, the identity heads the index', () => {
        // Given - one article and the site identity
        const llms = projectLlms(site, [article]);

        // Then - markdown index headed by the person, listing the article
        expect(llms).toContain('# Test Person');
        expect(llms).toContain('- [Hello](https://site.test/articles/1-hello): An article.');
    });
});
