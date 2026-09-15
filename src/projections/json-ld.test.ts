import { describe, expect, test } from 'vitest';

import { site } from '../model/site.fixtures.js';
import { projectIdentityGraph, projectPerson, projectWebSite } from './json-ld.js';

describe('identity graph projection', () => {
    test('one WebSite and one Person, linked by stable ids', () => {
        // Given - the site identity, projected as its two entities
        const websiteNode = projectWebSite(site);
        const personNode = projectPerson(site);

        // Then - the person publishes the site under the canonical ids
        expect(projectIdentityGraph(site)['@graph']).toStrictEqual([websiteNode, personNode]);
        expect(websiteNode['@id']).toBe('https://site.test/#website');
        expect(personNode['@id']).toBe('https://site.test/#person');
        expect(websiteNode.publisher).toStrictEqual({ '@id': 'https://site.test/#person' });
        expect(personNode.email).toBe('mailto:hi@site.test');
    });
});
