export {
    type Channels,
    defineSite,
    type Discovery,
    type Images,
    type Languages,
    person,
    type Person,
    type SharingCard,
    type SiteDefinition,
    type Voice,
} from './model/site.js';
export {
    KIND_DEFAULTS,
    page,
    type PageDates,
    type PageDefinition,
    type PageKind,
    type PageProvider,
} from './model/page.js';
export { alternatesFor, urlFor } from './model/urls.js';

export {
    type IdentityGraph,
    type ImageObjectNode,
    type ImageObjectOptions,
    personId,
    type PersonNode,
    type PersonRef,
    projectAuthorRef,
    projectIdentityGraph,
    projectImageObject,
    projectPerson,
    projectWebSite,
    websiteId,
    type WebSiteNode,
} from './projections/json-ld.js';
export { projectLlms } from './projections/llms.js';
export { projectRobots, type RobotsProjection } from './projections/robots.js';
export { projectSitemap, type SitemapEntry } from './projections/sitemap.js';
