import { defineSite, page, person } from '@jterrazz/manifest';

export const site = defineSite({
    address: 'https://site.test',
    channels: { feed: true, llms: true },
    discovery: { aiCrawlers: 'welcome', hidden: ['/api/', '/go/'] },
    identity: person({
        contact: 'hi@site.test',
        headline: 'Problem Solver',
        name: 'Ada Example',
        occupation: 'Engineer',
        portrait: '/portrait.png',
        profiles: ['https://github.com/ada', 'https://www.linkedin.com/in/ada'],
        topics: ['TypeScript', 'Search'],
    }),
    languages: { all: ['en', 'fr'], main: 'en' },
    sharing: { card: { caption: 'Ada', height: 630, image: '/card.png', width: 1200 } },
    voice: { brand: 'Ada', description: 'Notes on software.', titlePattern: '%s | Ada' },
});

export const pages = [
    page({ description: 'The home page.', kind: 'home', locales: ['en', 'fr'], path: '', title: 'Home' }),
    page({
        dates: { modified: '2026-01-02', published: '2026-01-01' },
        description: 'A bilingual article.',
        kind: 'article',
        locales: ['en', 'fr'],
        path: '/articles/1-hello',
        title: 'Hello',
    }),
    page({
        dates: { published: '2026-02-01' },
        description: 'An article in French only.',
        kind: 'article',
        locales: ['fr'],
        path: '/articles/2-bonjour',
        title: 'Bonjour',
    }),
    page({ description: 'Every article.', kind: 'collection', locales: ['en'], path: '/articles', title: 'Articles' }),
    page({ description: 'Photographs.', kind: 'gallery', locales: ['en'], path: '/photographs', title: 'Photographs' }),
    page({ description: 'Who I am.', kind: 'profile', locales: ['en'], path: '/about', title: 'About' }),
    page({ description: 'A small app.', kind: 'software', locales: ['en'], path: '/apps/tally', title: 'Tally' }),
    page({ description: 'Not published in any locale.', kind: 'article', locales: [], path: '/articles/3-draft', title: 'Draft' }),
];
