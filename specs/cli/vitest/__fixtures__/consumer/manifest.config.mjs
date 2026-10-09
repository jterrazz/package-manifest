import { defineSite, person } from '@jterrazz/manifest';

export const site = defineSite({
    address: 'https://site.test',
    channels: { feed: true, llms: true },
    discovery: { aiCrawlers: process.env.SITE?.startsWith('welcoming') ? 'welcome' : 'blocked', hidden: ['/api/', '/go/'] },
    identity: person({ headline: 'Problem solver', name: 'Ada Example', occupation: 'Engineer', profiles: [] }),
    languages: { all: ['en', 'fr'], main: 'en' },
    sharing: { card: { caption: 'Ada', height: 630, image: '/card.png', width: 1200 } },
    voice: { brand: 'Ada', description: 'Notes on software.', titlePattern: '%s | Ada' },
});
