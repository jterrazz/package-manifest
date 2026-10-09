export type PageKind = 'article' | 'collection' | 'gallery' | 'home' | 'profile' | 'software';

export type PageDates = {
    modified?: string;
    published?: string;
};

export type PageDefinition = {
    dates?: PageDates;
    description: string;
    /** Cover image path or absolute URL, when the page has one. */
    image?: string;
    kind: PageKind;
    /** The locales this page genuinely exists in — drives exact hreflang. */
    locales: string[];
    /** Path without locale prefix (`/articles/24-worldbuilding`). */
    path: string;
    title: string;
};

/** Declare a page. */
export function page(definition: PageDefinition): PageDefinition {
    return definition;
}

/** The port a site implements: every page of its own content sources, listed. */
export type PageProvider = () => PageDefinition[];

/** Per-kind projection defaults — one place, no per-page ceremony. */
export const KIND_DEFAULTS: Record<
    PageKind,
    { changeFrequency: 'monthly' | 'weekly'; feed: boolean; llms: boolean; priority: number }
> = {
    article: { changeFrequency: 'monthly', feed: true, llms: true, priority: 0.8 },
    collection: { changeFrequency: 'weekly', feed: false, llms: false, priority: 0.9 },
    gallery: { changeFrequency: 'monthly', feed: false, llms: false, priority: 0.6 },
    home: { changeFrequency: 'weekly', feed: false, llms: false, priority: 1 },
    profile: { changeFrequency: 'monthly', feed: false, llms: false, priority: 0.5 },
    software: { changeFrequency: 'monthly', feed: false, llms: true, priority: 0.7 },
};
