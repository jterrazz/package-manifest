import type { SiteDefinition } from '../model/site.js';

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

/** What a page declares about one image it publishes. */
export type ImageObjectOptions = {
    /** Where a person acquires a license for the image — the photographer's profile or the stock page. */
    acquireLicensePage: string;
    /** Absolute URL of the image file. */
    contentUrl: string;
    description: string;
};

/** An image credited to the Person, with the license a search engine asks of a credited image. */
export type ImageObjectNode = {
    '@type': 'ImageObject';
    acquireLicensePage: string;
    contentUrl: string;
    copyrightNotice: string;
    creator: PersonRef;
    creditText: string;
    description: string;
    license: string;
    name: string;
    thumbnailUrl: string;
};

/** An ImageObject credited to the Person, under the site's declared image license. */
export function projectImageObject(
    site: SiteDefinition,
    options: ImageObjectOptions,
): ImageObjectNode {
    if (site.images === undefined) {
        throw new Error(
            'projectImageObject needs a license: declare `images: { license }` on defineSite',
        );
    }
    return {
        '@type': 'ImageObject',
        acquireLicensePage: options.acquireLicensePage,
        contentUrl: options.contentUrl,
        copyrightNotice: `© ${site.identity.name}`,
        creator: projectAuthorRef(site),
        creditText: site.identity.name,
        description: options.description,
        license: site.images.license,
        name: options.description,
        thumbnailUrl: options.contentUrl,
    };
}
