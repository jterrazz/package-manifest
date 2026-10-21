import type { WebsiteSpecification } from '@jterrazz/test';

type Served = { html: string; status: number };

// hazard: a site whose redirects loop never settles here; the test's timeout ends it, as a browser's redirect limit would.
export async function served(website: WebsiteSpecification, path: string): Promise<Served> {
    let result = await website.fetch(path);
    while (result.location !== undefined) {
        const { pathname, search } = new URL(result.location, 'http://served.test');
        // Stryker disable next-line StringLiteral: the query reaches only a server that routes on it, and the fixture's routes on the path
        result = await website.fetch(`${pathname}${search}`);
    }
    return { html: result.body.text, status: result.status };
}

function named(match: RegExpMatchArray): Record<string, string | undefined> {
    return match.groups ?? {};
}

const ENTITIES: Record<string, string> = { amp: '&', apos: "'", gt: '>', lt: '<', quot: '"' };

function decoded(text: string): string {
    return text.replaceAll(
        /&(?:#x(?<hex>[\da-f]+)|#(?<decimal>\d+)|(?<name>[a-z]+));/giu,
        (entity: string, hex?: string, decimal?: string, name?: string) => {
            if (hex !== undefined) {
                return String.fromCodePoint(Number.parseInt(hex, 16));
            }
            if (decimal !== undefined) {
                return String.fromCodePoint(Number(decimal));
            }
            return ENTITIES[String(name)] ?? entity;
        },
    );
}

function attributesOf(source = ''): Record<string, string> {
    return Object.fromEntries(
        [
            ...source.matchAll(
                /(?<key>[\w-]+)\s*=\s*(?:"(?<double>[^"]*)"|'(?<single>[^']*)'|(?<bare>\S+))/gu,
            ),
        ]
            .map(named)
            .map(({ bare, double, key, single }): [string, string] => [
                String(key).toLowerCase(),
                decoded(double ?? single ?? String(bare)),
            ]),
    );
}

// invariant: the markup is read as a crawler that runs no script reads it: each tag as the server wrote it.
function tags(html: string, name: string): Record<string, string>[] {
    return [...html.matchAll(new RegExp(`<${name}\\b(?<attributes>[^>]*)>`, 'giu'))]
        .map(named)
        .map(({ attributes }) => attributesOf(attributes));
}

// invariant: a browser reads an absolute href normalised (`https://site.test` as `https://site.test/`); a relative one stays as written, since the origin a browser would resolve it against is the server's, which no declared address is.
function normalised(href = ''): string {
    return URL.parse(href)?.href ?? href;
}

// invariant: a link lives in the head; an anchor carrying the same attributes (a language switcher's) declares nothing.
function links(html: string): Record<string, string>[] {
    return tags(html, 'link').map((link) => ({ ...link, href: normalised(link.href) }));
}

function elements(
    html: string,
    name: string,
): { attributes: Record<string, string>; text: string }[] {
    return [
        ...html.matchAll(
            new RegExp(`<${name}\\b(?<attributes>[^>]*)>(?<text>[\\s\\S]*?)</${name}>`, 'giu'),
        ),
    ]
        .map(named)
        .map(({ attributes, text }) => ({
            attributes: attributesOf(attributes),
            text: String(text),
        }));
}

/** What a served page declares, read off its markup: the head's links, metas and title, and its JSON-LD blocks. */
export const markup = {
    alternate(html: string, language: string): string | undefined {
        return links(html).findLast(
            (link) => link.rel === 'alternate' && link.hreflang === language,
        )?.href;
    },
    canonical(html: string): null | string {
        // Stryker disable next-line OptionalChaining: a page declaring no canonical fails its rule either way
        return links(html).find((link) => link.rel === 'canonical')?.href ?? null;
    },
    jsonLd(html: string): unknown[] {
        return elements(html, 'script')
            .filter(({ attributes }) => attributes.type === 'application/ld+json')
            .map(({ text }): unknown => JSON.parse(text));
    },
    meta(html: string, name: string): string | undefined {
        // Stryker disable next-line StringLiteral: only a meta carries a name or property naming a meta, so reading every tag finds the same one
        const found = tags(html, 'meta').find(
            (meta) => meta.name === name || meta.property === name,
        );
        // Stryker disable next-line OptionalChaining: a page declaring no such meta fails its rule either way
        return found?.content;
    },
    title(html: string): string {
        const [title] = elements(html, 'title');
        // Stryker disable next-line OptionalChaining: a page with no title fails its rule either way
        return decoded(title?.text ?? '')
            .replaceAll(/\s+/gu, ' ')
            .trim();
    },
};
