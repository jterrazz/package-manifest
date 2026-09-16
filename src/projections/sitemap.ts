import { KIND_DEFAULTS } from '../model/page.js';
import type { PageDefinition } from '../model/page.js';
import type { SiteDefinition } from '../model/site.js';
import { alternatesFor, urlFor } from '../model/urls.js';

/**
 * Sitemap projection — one entry per page per existing locale, kind-driven
 * priorities, honest lastModified (absent rather than fabricated).
 */

export type SitemapEntry = {
    alternates: { languages: Record<string, string> };
    changeFrequency: 'monthly' | 'weekly';
    lastModified?: Date;
    priority: number;
    url: string;
};

export function projectSitemap(site: SiteDefinition, pages: PageDefinition[]): SitemapEntry[] {
    return pages.flatMap((page) => {
        const defaults = KIND_DEFAULTS[page.kind];
        const alternates = { languages: alternatesFor(site, page) };
        const modified = page.dates?.modified;

        return page.locales.map((locale) => ({
            alternates,
            changeFrequency: defaults.changeFrequency,
            ...(modified === undefined ? {} : { lastModified: new Date(modified) }),
            priority: defaults.priority,
            url: urlFor(site, page.path, locale),
        }));
    });
}
