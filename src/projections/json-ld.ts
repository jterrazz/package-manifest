import { type SiteDefinition } from '../model/site.js';

/**
 * JSON-LD projection — the identity graph. One Person entity with a
 * stable `@id`, one WebSite publishing it, rendered once per page.
 * Standards vocabulary (schema.org) lives here, never in the model.
 */

/** The Person reference authored content points at — the id and what a citation shows. */
export type PersonRef = {
    '@id': string;
    '@type': 'Person';
    name: string;
    url: string;
};

/** The canonical Person entity — the reference, plus everything the identity declares. */
export type PersonNode = {
    '@id': string;
    '@type': 'Person';
    description: string;
    email?: string;
    image?: string;
    jobTitle: string;
    knowsAbout?: string[];
    name: string;
    sameAs: string[];
    url: string;
};

/** The WebSite entity the Person publishes. */
export type WebSiteNode = {
    '@id': string;
    '@type': 'WebSite';
    description: string;
    inLanguage: string[];
    name: string;
    publisher: { '@id': string };
    url: string;
};

/** The site-wide graph: the site, then the person publishing it. */
export type IdentityGraph = {
    '@context': 'https://schema.org';
    '@graph': [WebSiteNode, PersonNode];
};

export function personId(site: SiteDefinition): string {
    return `${site.address}/#person`;
}

export function websiteId(site: SiteDefinition): string {
    return `${site.address}/#website`;
}

/** The Person reference used by authored content (articles, images). */
export function projectAuthorRef(site: SiteDefinition): PersonRef {
    return {
        '@id': personId(site),
        '@type': 'Person',
        name: site.identity.name,
        url: site.address,
    };
}

/** The full canonical Person entity. */
export function projectPerson(site: SiteDefinition): PersonNode {
    const { identity } = site;
    return {
        '@id': personId(site),
        '@type': 'Person',
        description: site.voice.description,
        ...(identity.contact === undefined ? {} : { email: `mailto:${identity.contact}` }),
        ...(identity.portrait === undefined
            ? {}
            : { image: `${site.address}${identity.portrait}` }),
        jobTitle: identity.occupation,
        ...(identity.topics ? { knowsAbout: identity.topics } : {}),
        name: identity.name,
        sameAs: identity.profiles,
        url: site.address,
    };
}

/** The WebSite entity, published by the Person. */
export function projectWebSite(site: SiteDefinition): WebSiteNode {
    return {
        '@id': websiteId(site),
        '@type': 'WebSite',
        description: site.voice.description,
        inLanguage: site.languages.all,
        name: site.identity.name,
        publisher: { '@id': personId(site) },
        url: site.address,
    };
}

/** The site-wide identity graph — rendered once, in the root layout. */
export function projectIdentityGraph(site: SiteDefinition): IdentityGraph {
    return {
        '@context': 'https://schema.org',
        '@graph': [projectWebSite(site), projectPerson(site)],
    };
}
