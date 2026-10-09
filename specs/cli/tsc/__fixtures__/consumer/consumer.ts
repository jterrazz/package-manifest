import type { WebsiteSpecification } from '@jterrazz/test';
import { defineSite, page, person, projectIdentityGraph, projectSitemap } from '@jterrazz/manifest';
import type { PageProvider, SiteDefinition, SitemapEntry } from '@jterrazz/manifest';
import { createLlms, createRobots, createSitemap } from '@jterrazz/manifest/next';
import { audit } from '@jterrazz/manifest/testing';

const site: SiteDefinition = defineSite({
    address: 'https://site.test',
    channels: { feed: false, llms: true },
    discovery: { aiCrawlers: 'blocked', hidden: [] },
    identity: person({ headline: 'Writer', name: 'Ada', occupation: 'Writer', profiles: [] }),
    languages: { all: ['en'], main: 'en' },
    sharing: { card: { caption: 'Ada', height: 630, image: '/card.png', width: 1200 } },
    voice: { brand: 'Ada', description: 'Notes.', titlePattern: '%s | Ada' },
});

const pages: PageProvider = () => [
    page({ description: 'Home.', kind: 'home', locales: ['en'], path: '', title: 'Home' }),
];

const entries: SitemapEntry[] = projectSitemap(site, pages());
const graphId: string = projectIdentityGraph(site)['@graph'][1]['@id'];
const llms: () => Response = createLlms(site, [pages]);
createRobots(site);
createSitemap(site, [pages]);

// @ts-expect-error a page declares one of the six kinds
page({ description: 'x', kind: 'post', locales: ['en'], path: '/x', title: 'x' });

// @ts-expect-error the AI crawler policy is 'welcome' or 'blocked'
defineSite({ ...site, discovery: { aiCrawlers: 'allowed', hidden: [] } });

// @ts-expect-error person() derives its kind
person({ headline: 'x', kind: 'person', name: 'x', occupation: 'x', profiles: [] });

export function auditOf(website: WebsiteSpecification): void {
    audit.website(website, site);
}

export { entries, graphId, llms };
