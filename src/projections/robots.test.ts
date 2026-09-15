import { describe, expect, test } from 'vitest';

import { site } from '../model/site.fixtures.js';
import { projectRobots } from './robots.js';

describe('robots projection', () => {
    test('welcome policy hides only the declared paths and names the sitemap', () => {
        // Given - an AI-welcoming site
        const robots = projectRobots(site);

        // Then - one generic rule, the declared hidden paths, the canonical sitemap
        expect(robots.rules).toHaveLength(1);
        expect(robots.rules[0]?.disallow).toStrictEqual(['/api/', '/go/']);
        expect(robots.sitemap).toBe('https://site.test/sitemap.xml');
    });

    test('blocked policy names the AI crawlers', () => {
        // Given - the same site shutting AI crawlers out
        const robots = projectRobots({
            ...site,
            discovery: { ...site.discovery, aiCrawlers: 'blocked' },
        });

        // Then - each bot gets its own full disallow
        expect(robots.rules.some((rule) => rule.userAgent === 'GPTBot')).toBeTruthy();
    });
});
