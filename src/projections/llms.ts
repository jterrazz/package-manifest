import type { PageDefinition } from '../model/page.js';
import type { SiteDefinition } from '../model/site.js';
import { urlFor } from '../model/urls.js';

/** The llms.txt index of the site (https://llmstxt.org): its articles and software under the identity. */
export function projectLlms(site: SiteDefinition, pages: PageDefinition[]): string {
    const lines = (kind: PageDefinition['kind']): string[] =>
        pages
            .filter((page) => page.kind === kind)
            .flatMap((page) => {
                const locale = page.locales.includes(site.languages.main)
                    ? site.languages.main
                    : page.locales[0];
                return locale === undefined
                    ? []
                    : [
                          `- [${page.title}](${urlFor(site, page.path, locale)}): ${page.description}`,
                      ];
            });
    const articles = lines('article');
    const software = lines('software');

    const sections: string[] = [
        `# ${site.identity.name}`,
        '',
        `> ${site.voice.description}`,
        '',
        `${site.identity.name} (${site.identity.headline.toLowerCase()}) builds small apps and tools, and writes notes on software, AI agents, and owning your own stack. Articles are available in English and French (French under /fr/).`,
    ];
    if (articles.length > 0) {
        sections.push('', '## Articles', '', ...articles);
    }
    if (software.length > 0) {
        sections.push('', '## Experiments', '', ...software);
    }
    sections.push(
        '',
        '## Optional',
        '',
        `- [Photography](${site.address}/photographs): Photography portfolio`,
        ...(site.channels.feed ? [`- [RSS feed](${site.address}/feed.xml): Article feed`] : []),
        ...site.identity.profiles
            .filter((profile) => profile.includes('github.com'))
            .map((profile) => `- [GitHub](${profile}): Open-source work`),
        '',
    );
    return sections.join('\n');
}
