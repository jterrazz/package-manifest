import type { PageDefinition } from './page.js';
import type { SiteDefinition } from './site.js';

/** Absolute URL of a path in a locale. */
export function urlFor(site: SiteDefinition, path: string, locale: string): string {
    const prefixed =
        locale === site.languages.main && site.languages.prefixMain !== true
            ? path
            : `/${locale}${path}`;
    return `${site.address}${prefixed}`;
}

/** The hreflang alternates of a page: one per locale it exists in, and x-default where the main locale is one of them. */
export function alternatesFor(site: SiteDefinition, page: PageDefinition): Record<string, string> {
    const languages: Record<string, string> = {};
    for (const locale of page.locales) {
        languages[locale] = urlFor(site, page.path, locale);
    }
    if (page.locales.includes(site.languages.main)) {
        languages['x-default'] = urlFor(site, page.path, site.languages.main);
    }
    return languages;
}
