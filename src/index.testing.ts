import type { WebsiteSpecification } from '@jterrazz/test';

import { markup, served } from './audit/markup.js';
import type { SiteDefinition } from './index.js';

/** The matchers the rules assert with, a subset of what vitest's `expect` returns. */
export interface AuditAssertion {
    toBe: (expected: unknown) => void;
    toContain: (expected: unknown) => void;
    toStrictEqual: (expected: unknown) => void;
}

/**
 * The consumer's test runner, handed in rather than imported: vitest's `test` and `expect`.
 * invariant: the entry imports no test package at run time, so none is a peer, and a consumer's production tree holds none of them.
 */
export interface AuditRunner {
    expect: (actual: unknown) => AuditAssertion;
    test: (name: string, body: () => Promise<void>) => void;
}

type Rule = (website: WebsiteSpecification, site: SiteDefinition, runner: AuditRunner) => void;

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

// invariant: an ImageObject sits anywhere in the tree (a collection's items, an article's image), so the walk descends every value.
function imageObjects(value: unknown): Record<string, unknown>[] {
    if (!isRecord(value)) {
        // Stryker disable next-line ArrayDeclaration: a string standing in for a primitive reads no credit field, so the filter drops it
        return [];
    }
    // invariant: a list is a record too, so its values are its items.
    const found = Object.values(value).flatMap(imageObjects);
    return [value['@type']].flat().includes('ImageObject') ? [value, ...found] : found;
}

// invariant: Google makes an image eligible by one of these fields, so each of them asks for the license pair.
const ELIGIBLE_FIELDS = ['creator', 'creditText', 'copyrightNotice', 'license'];
const LICENSE_FIELDS = ['license', 'acquireLicensePage'];

function isPresent(value: unknown): boolean {
    return value !== undefined && value !== null;
}

// Stryker disable next-line StringLiteral: `''` and `'/'` both reach the base URL, the homepage
const HOMEPAGE = '/';

// invariant: the pages that can carry images are the ones the sitemap lists; a site serving none answers 404 with no `<loc>`, and is audited on its homepage alone.
async function auditedPages(website: WebsiteSpecification): Promise<string[]> {
    const sitemap = await website.fetch('/sitemap.xml');
    const listed = [...sitemap.body.text.matchAll(/<loc>(?<loc>[^<]+)<\/loc>/gu)].map(
        ({ groups }) => {
            // Stryker disable next-line OptionalChaining,StringLiteral: the pattern's one named group is in every match
            const { pathname, search } = new URL(groups?.loc ?? '');
            return `${pathname}${search}`;
        },
    );
    return [...new Set([HOMEPAGE, ...listed])];
}

const canonicalHost: Rule = (website, site, { expect, test }) => {
    test('manifest/canonical-host — the homepage canonical points at the declared address', async () => {
        // Given - the served homepage
        const { html, status } = await served(website, HOMEPAGE);

        // Then - it answers 200, its canonical the one declared origin
        expect({ canonical: markup.canonical(html), status }).toStrictEqual({
            canonical: `${site.address}/`,
            status: 200,
        });
    });
};

const hreflangSelfAndDefault: Rule = (website, site, { expect, test }) => {
    test('manifest/hreflang-self-and-default — the homepage declares every locale and x-default', async () => {
        // Given - the served homepage
        const { html } = await served(website, HOMEPAGE);

        // Then - no declared locale lacks its alternate, and x-default is the main address
        expect({
            missing: site.languages.all.filter(
                (locale) => markup.alternate(html, locale) === undefined,
            ),
            xDefault: markup.alternate(html, 'x-default'),
        }).toStrictEqual({ missing: [], xDefault: `${site.address}/` });
    });
};

const singlePerson: Rule = (website, site, { expect, test }) => {
    test('identity/single-person — exactly one Person entity, with the canonical @id', async () => {
        // Given - the served homepage's structured data
        const { html } = await served(website, HOMEPAGE);

        // Then - one Person node, carrying the stable id and the declared name
        const persons = jsonLdNodes(markup.jsonLd(html))
            .filter((node) => node['@type'] === 'Person')
            .map((node) => ({ id: node['@id'], name: node.name }));
        expect(persons).toStrictEqual([
            { id: `${site.address}/#person`, name: site.identity.name },
        ]);
    });
};

const robotsServesSitemap: Rule = (website, site, { expect, test }) => {
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

const aiCrawlersPolicy: Rule = (website, site, { expect, test }) => {
    test('discovery/ai-crawlers-policy — the declared AI policy is what robots.txt says', async () => {
        // Given - the robots surface
        const result = await website.fetch('/robots.txt');

        // Then - 'welcome' means no AI bot is named; 'blocked' names them
        expect({ namesGPTBot: result.body.text.includes('GPTBot') }).toStrictEqual({
            namesGPTBot: site.discovery.aiCrawlers === 'blocked',
        });
    });
};

const llmsIndex: Rule = (website, site, { expect, test }) => {
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

const feed: Rule = (website, site, { expect, test }) => {
    test('channels/feed — the feed exists exactly when declared', async () => {
        // Given - the feed surface
        const result = await website.fetch('/feed.xml');

        // Then - present, or absent
        expect(result.status).toBe(site.channels.feed ? 200 : 404);
    });
};

const cardReachable: Rule = (website, site, { expect, test }) => {
    test('sharing/card-reachable — the sharing card image answers and is declared on the page', async () => {
        // Given - the served homepage and the card asset
        const { html } = await served(website, HOMEPAGE);
        const image = await website.fetch(site.sharing.card.image);

        // Then - the OG image is the declared card, and the asset answers 200
        expect({ image: image.status, ogImage: markup.meta(html, 'og:image') }).toStrictEqual({
            image: 200,
            ogImage: `${site.address}${site.sharing.card.image}`,
        });
    });
};

const namedInTitle: Rule = (website, site, { expect, test }) => {
    test('identity/named-in-title — the homepage title names the identity', async () => {
        // Given - the served homepage
        const { html } = await served(website, HOMEPAGE);

        // Then - the person's name is in the title
        expect(markup.title(html)).toContain(site.identity.name);
    });
};

const consoleSilence: Rule = (website, _site, { expect, test }) => {
    test('quality/console-silence — the homepage renders without console errors', async () => {
        // Given - the rendered homepage
        const result = await website.visit(HOMEPAGE);

        // Then - the error stream is empty
        expect(result.errors.text).toBe('');
    });
};

const creditedImagesLicensed: Rule = (website, _site, { expect, test }) => {
    test('images/credit-licensed — an image crediting its creator carries its license and where to acquire it', async () => {
        // Given - the structured data of the homepage and of every page the sitemap lists
        const unlicensed = [];
        for (const page of await auditedPages(website)) {
            const { html } = await served(website, page);
            unlicensed.push(
                ...imageObjects(markup.jsonLd(html))
                    .filter((image) => ELIGIBLE_FIELDS.some((field) => isPresent(image[field])))
                    .map((image) => ({
                        contentUrl: image.contentUrl,
                        missing: LICENSE_FIELDS.filter((field) => !isPresent(image[field])),
                        page,
                    }))
                    .filter((image) => image.missing.length > 0),
            );
        }

        // Then - no ImageObject crediting a creator or naming a license lacks license or acquireLicensePage (Search Console: Image metadata)
        expect(unlicensed).toStrictEqual([]);
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
    namedInTitle,
    consoleSilence,
    creditedImagesLicensed,
];

/** The manifest audit: one test per rule, registered with the runner handed in, verifying a rendered site against its declaration. */
export const audit = {
    website(website: WebsiteSpecification, site: SiteDefinition, runner: AuditRunner): void {
        for (const rule of RULES) {
            rule(website, site, runner);
        }
    },
};
