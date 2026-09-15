import { describe, expect, test } from 'vitest';

import { article } from '../model/page.fixtures.js';
import { site } from '../model/site.fixtures.js';
import { projectSitemap } from './sitemap.js';

describe('sitemap projection', () => {
    test('one entry per existing locale, shared alternates, honest lastModified', () => {
        // Given - one bilingual article
        const entries = projectSitemap(site, [article]);

        // Then - two entries pointing at the same alternates cluster
        expect(entries).toHaveLength(2);
        expect(entries[0]?.url).toBe('https://site.test/articles/1-hello');
        expect(entries[1]?.url).toBe('https://site.test/fr/articles/1-hello');
        expect(entries[0]?.alternates.languages['x-default']).toBe(
            'https://site.test/articles/1-hello',
        );
        expect(entries[0]?.lastModified).toStrictEqual(new Date('2026-01-02'));
    });
});
