import { describe, expect, test } from 'vitest';

import { article } from '../model/page.fixtures.js';
import { site } from '../model/site.fixtures.js';
import { projectLlms } from './llms.js';

describe('llms projection', () => {
    test('articles opt in, the identity heads the index', () => {
        // Given - one article and the site identity
        const llms = projectLlms(site, [article]);

        // Then - markdown index headed by the person, listing the article
        expect(llms).toContain('# Test Person');
        expect(llms).toContain('- [Hello](https://site.test/articles/1-hello): An article.');
    });
});
