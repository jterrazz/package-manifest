import type { WebsiteSpecification } from '@jterrazz/test';
import {
    defineSite,
    KIND_DEFAULTS,
    page,
    person,
    projectAuthorRef,
    projectIdentityGraph,
    projectImageObject,
    projectLlms,
    projectPerson,
    projectRobots,
    projectSitemap,
    projectWebSite,
} from '@jterrazz/manifest';
import type {
    Channels,
    Discovery,
    IdentityGraph,
    ImageObjectNode,
    ImageObjectOptions,
    Images,
    Languages,
    PageDates,
    PageDefinition,
    PageKind,
    PageProvider,
    Person,
    PersonNode,
    PersonRef,
    RobotsProjection,
    SharingCard,
    SiteDefinition,
    SitemapEntry,
    Voice,
    WebSiteNode,
} from '@jterrazz/manifest';
import { audit } from '@jterrazz/manifest/testing';
import type { AuditAssertion, AuditRunner } from '@jterrazz/manifest/testing';
import { expect, test } from 'vitest';

const channels: Channels = { feed: false, llms: true };
const discovery: Discovery = { aiCrawlers: 'blocked', hidden: [] };
const identity: Person = person({ headline: 'Writer', name: 'Ada', occupation: 'Writer', profiles: [] });
const languages: Languages = { all: ['en'], main: 'en' };
const card: SharingCard = { image: '/card.png' };
const images: Images = { license: 'https://site.test/license' };
const voice: Voice = { description: 'Notes.' };

const site: SiteDefinition = defineSite({
    address: 'https://site.test',
    channels,
    discovery,
    identity,
    images,
    languages,
    sharing: { card },
    voice,
});

const kind: PageKind = 'home';
const dates: PageDates = { modified: '2026-01-01' };
const home: PageDefinition = page({ dates, description: 'Home.', kind, locales: ['en'], path: '', title: 'Home' });
const pages: PageProvider = () => [home];

const entries: SitemapEntry[] = projectSitemap(site, pages());
const homePriority: number = KIND_DEFAULTS[kind].priority;
const graph: IdentityGraph = projectIdentityGraph(site);
const graphId: string = graph['@graph'][1]['@id'];
const author: PersonRef = projectAuthorRef(site);
const personNode: PersonNode = projectPerson(site);
const websiteNode: WebSiteNode = projectWebSite(site);
const photo: ImageObjectOptions = { acquireLicensePage: 'https://stock.test/@ada', contentUrl: 'https://site.test/1.jpg', description: 'x' };
const image: ImageObjectNode = projectImageObject(site, photo);
const robots: RobotsProjection = projectRobots(site);
const llms: string = projectLlms(site, [home]);

// @ts-expect-error a page declares one of the six kinds
page({ description: 'x', kind: 'post', locales: ['en'], path: '/x', title: 'x' });

// @ts-expect-error the AI crawler policy is 'welcome' or 'blocked'
defineSite({ ...site, discovery: { aiCrawlers: 'allowed', hidden: [] } });

// @ts-expect-error person() derives its kind
person({ headline: 'x', kind: 'person', name: 'x', occupation: 'x', profiles: [] });

// invariant: vitest's own `expect` and `test` are a runner the audit accepts.
const runner: AuditRunner = { expect, test };
const assertion: AuditAssertion = expect(1);

export function auditOf(website: WebsiteSpecification): void {
    audit.website(website, site, runner);
}

export function auditUnregistered(website: WebsiteSpecification): void {
    // @ts-expect-error the audit registers its rules with a runner the consumer hands in
    audit.website(website, site);
}

export { assertion, author, entries, graphId, homePriority, image, llms, personNode, robots, websiteNode };
