/** The person behind the site — one canonical identity, referenced everywhere. */
export type Person = {
    /** Contact email, published in the identity graph. */
    contact?: string;
    /** What the person says they do — for humans (titles, cards). */
    headline: string;
    kind: 'person';
    name: string;
    /** What the person factually does — for machines (schema jobTitle). */
    occupation: string;
    /** Square portrait path, the identity image. */
    portrait?: string;
    /** Every public profile URL (GitHub, LinkedIn, …) — consolidates identity. */
    profiles: string[];
    /** Topics the person demonstrably knows. */
    topics?: string[];
};

/** Locale configuration — what exists, what leads, how URLs carry it. */
export type Languages = {
    /** Every locale the site genuinely serves. */
    all: string[];
    /** The fallback locale — x-default resolves here. */
    main: string;
    /** Whether the main locale is path-prefixed (`/en/...`). Default false. */
    prefixMain?: boolean;
};

/** The image a link to the site shows when shared — the audit's `sharing/card-reachable` rule reads it as the homepage's og:image. */
export type SharingCard = {
    /** Card image path, under the address. */
    image: string;
};

/** What crawlers may reach — projected as robots.txt. */
export type Discovery = {
    /** AI crawlers policy: 'welcome' leaves them unblocked (GEO), 'blocked' shuts them out. */
    aiCrawlers: 'blocked' | 'welcome';
    /** Path prefixes hidden from all crawlers (`/api/`, redirect endpoints…). */
    hidden: string[];
};

/** The standards-as-products the site publishes. */
export type Channels = {
    /** RSS feed of the articles. */
    feed: boolean;
    /** Llms.txt markdown index for AI consumption. */
    llms: boolean;
};

/** The site's editorial voice. */
export type Voice = {
    /** The default description — identity graph, llms.txt summary. */
    description: string;
};

/** The images the site publishes. */
export type Images = {
    /** The license URL every published image is under, unless it says otherwise. */
    license: string;
};

export type SiteDefinition = {
    /** THE canonical origin — one host, no trailing slash. Everything derives from it. */
    address: string;
    channels: Channels;
    discovery: Discovery;
    identity: Person;
    /** The default image license — declared once, read by `projectImageObject`. */
    images?: Images;
    languages: Languages;
    sharing: { card: SharingCard };
    voice: Voice;
};

/** Declare the canonical person identity. */
export function person(options: Omit<Person, 'kind'>): Person {
    return { kind: 'person', ...options };
}

/** Declare the site — the one source every projection reads. */
export function defineSite(definition: SiteDefinition): SiteDefinition {
    return definition;
}
