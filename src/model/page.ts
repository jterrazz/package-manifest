export type PageKind = 'article' | 'collection' | 'gallery' | 'home' | 'profile' | 'software';

export type PageDates = {
    /** The last change, the sitemap's lastModified. */
    modified?: string;
};

export type PageDefinition = {
    dates?: PageDates;
    description: string;
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
    { changeFrequency: 'monthly' | 'weekly'; priority: number }
> = {
    article: { changeFrequency: 'monthly', priority: 0.8 },
    collection: { changeFrequency: 'weekly', priority: 0.9 },
    gallery: { changeFrequency: 'monthly', priority: 0.6 },
    home: { changeFrequency: 'weekly', priority: 1 },
    profile: { changeFrequency: 'monthly', priority: 0.5 },
    software: { changeFrequency: 'monthly', priority: 0.7 },
};
