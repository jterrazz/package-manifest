import type { WebsiteSpecification } from '@jterrazz/test';
import { expect, test } from 'vitest';

import type { SiteDefinition } from './index.js';

type Rule = (website: WebsiteSpecification, site: SiteDefinition) => void;

function isRecord(value: unknown): value is Record<string, unknown> {
    // Stryker disable next-line ConditionalExpression: a JSON primitive read by a key gives undefined, so it is dropped as no Person either way
    return typeof value === 'object' && value !== null;
}

// invariant: `Array.isArray` narrows an `unknown` to `any[]`; this keeps the elements `unknown`.
function isList(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

function jsonLdNodes(blocks: unknown): Record<string, unknown>[] {
    return [blocks]
        .flat()
        .filter(isRecord)
        .flatMap((block) => {
            const graph = block['@graph'];
            return isList(graph) ? graph.filter(isRecord) : [block];
        });
}

// Stryker disable next-line StringLiteral: `''` and `'/'` both visit the base URL, the homepage
const HOMEPAGE = '/';

const canonicalHost: Rule = (website, site) => {
    test('manifest/canonical-host — the homepage canonical points at the declared address', async () => {
        // Given - the rendered homepage
        const result = await website.visit(HOMEPAGE);

        // Then - it answers 200, its canonical the one declared origin
        expect({ canonical: result.canonical, status: result.status }).toStrictEqual({
            canonical: `${site.address}/`,
            status: 200,
        });
    });
};

const hreflangSelfAndDefault: Rule = (website, site) => {
    test('manifest/hreflang-self-and-default — the homepage declares every locale and x-default', async () => {
        // Given - the rendered homepage
        const result = await website.visit(HOMEPAGE);

        // Then - no declared locale lacks its alternate, and x-default is the main address
        expect({
            missing: site.languages.all.filter((locale) => result.alternates[locale] === undefined),
            xDefault: result.alternates['x-default'],
        }).toStrictEqual({ missing: [], xDefault: `${site.address}/` });
    });
};

const singlePerson: Rule = (website, site) => {
    test('identity/single-person — exactly one Person entity, with the canonical @id', async () => {
        // Given - the rendered homepage's structured data
        const result = await website.visit(HOMEPAGE);

        // Then - one Person node, carrying the stable id and the declared name
        const persons = jsonLdNodes(result.jsonLd.value)
            .filter((node) => node['@type'] === 'Person')
            .map((node) => ({ id: node['@id'], name: node.name }));
        expect(persons).toStrictEqual([
            { id: `${site.address}/#person`, name: site.identity.name },
        ]);
    });
};

const robotsServesSitemap: Rule = (website, site) => {
    test('discovery/robots-serves-sitemap — robots.txt allows, hides, and names the sitemap', async () => {
        // Given - the robots surface
        const result = await website.fetch('/robots.txt');

        // Then - it answers 200, names the canonical sitemap, and no declared hidden path lacks its Disallow
        const robots = result.body.text;
        expect({
            namesSitemap: robots.includes(`Sitemap: ${site.address}/sitemap.xml`),
            status: result.status,
            unhidden: site.discovery.hidden.filter((path) => !robots.includes(`Disallow: ${path}`)),
        }).toStrictEqual({ namesSitemap: true, status: 200, unhidden: [] });
    });
};

const aiCrawlersPolicy: Rule = (website, site) => {
    test('discovery/ai-crawlers-policy — the declared AI policy is what robots.txt says', async () => {
        // Given - the robots surface
        const result = await website.fetch('/robots.txt');

        // Then - 'welcome' means no AI bot is named; 'blocked' names them
        expect({ namesGPTBot: result.body.text.includes('GPTBot') }).toStrictEqual({
            namesGPTBot: site.discovery.aiCrawlers === 'blocked',
        });
    });
};

const llmsIndex: Rule = (website, site) => {
    test('channels/llms-index — llms.txt exists exactly when declared', async () => {
        // Given - the llms surface
        const result = await website.fetch('/llms.txt');

        // Then - present and headed by the identity, or absent
        expect({
            headed: result.body.text.includes(`# ${site.identity.name}`),
            status: result.status,
        }).toStrictEqual({ headed: site.channels.llms, status: site.channels.llms ? 200 : 404 });
    });
};

const feed: Rule = (website, site) => {
    test('channels/feed — the feed exists exactly when declared', async () => {
        // Given - the feed surface
        const result = await website.fetch('/feed.xml');

        // Then - present, or absent
        expect(result.status).toBe(site.channels.feed ? 200 : 404);
    });
};

const cardReachable: Rule = (website, site) => {
    test('sharing/card-reachable — the sharing card image answers and is declared on the page', async () => {
        // Given - the rendered homepage and the card asset
        const result = await website.visit(HOMEPAGE);
        const image = await website.fetch(site.sharing.card.image);

        // Then - the OG image is the declared card, and the asset answers 200
        expect({ image: image.status, ogImage: result.meta('og:image') }).toStrictEqual({
            image: 200,
            ogImage: `${site.address}${site.sharing.card.image}`,
        });
    });
};

const titlePattern: Rule = (website, site) => {
    test('voice/title-pattern — the homepage title leads with the identity', async () => {
        // Given - the rendered homepage
        const result = await website.visit(HOMEPAGE);

        // Then - the person's name is in the title
        expect(result.title.text).toContain(site.identity.name);
    });
};

const consoleSilence: Rule = (website) => {
    test('quality/console-silence — the homepage renders without console errors', async () => {
        // Given - the rendered homepage
        const result = await website.visit(HOMEPAGE);

        // Then - the error stream is empty
        expect(result.errors.text).toBe('');
    });
};

const RULES: Rule[] = [
    canonicalHost,
    hreflangSelfAndDefault,
    singlePerson,
    robotsServesSitemap,
    aiCrawlersPolicy,
    llmsIndex,
    feed,
    cardReachable,
    titlePattern,
    consoleSilence,
];

/** The manifest audit: one vitest test per rule, verifying a rendered site against its declaration. */
export const audit = {
    website(website: WebsiteSpecification, site: SiteDefinition): void {
        for (const rule of RULES) {
            rule(website, site);
        }
    },
};
