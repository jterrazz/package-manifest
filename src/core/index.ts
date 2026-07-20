// The model — the language of intent
export {
    type Channels,
    defineSite,
    type Discovery,
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

// The projections — the language of standards
export {
    personId,
    projectAuthorRef,
    projectIdentityGraph,
    projectPerson,
    projectWebSite,
    websiteId,
} from './projections/json-ld.js';
export { projectLlms } from './projections/llms.js';
export { projectRobots, type RobotsProjection } from './projections/robots.js';
export { projectSitemap, type SitemapEntry } from './projections/sitemap.js';
