import { defineSite, person } from './site.js';
import type { SiteDefinition } from './site.js';

/** The declared site every model and projection test reads from. */
export const site: SiteDefinition = defineSite({
    address: 'https://site.test',
    channels: { feed: true, llms: true },
    discovery: { aiCrawlers: 'welcome', hidden: ['/api/', '/go/'] },
    identity: person({
        contact: 'hi@site.test',
        headline: 'Problem solver',
        name: 'Test Person',
        occupation: 'Engineer',
        profiles: ['https://github.com/test'],
    }),
    languages: { all: ['en', 'fr'], main: 'en' },
    sharing: { card: { caption: 'Test', height: 630, image: '/card.png', width: 1200 } },
    voice: { brand: 'T', description: 'A test site.', titlePattern: '%s | T' },
});
