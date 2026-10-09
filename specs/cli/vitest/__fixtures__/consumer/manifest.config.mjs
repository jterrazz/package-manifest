import { defineSite, person } from '@jterrazz/manifest';

const served = (process.env.SITE ?? 'healthy,channels').split(',');
const declared = !served.includes('quiet');

export const site = defineSite({
    address: 'https://site.test',
    channels: { feed: declared, llms: declared },
    discovery: { aiCrawlers: served.includes('welcoming') ? 'welcome' : 'blocked', hidden: ['/api/', '/go/'] },
    identity: person({ headline: 'Problem solver', name: 'Ada Example', occupation: 'Engineer', profiles: [] }),
    languages: { all: ['en', 'fr'], main: 'en' },
    sharing: { card: { caption: 'Ada', height: 630, image: '/card.png', width: 1200 } },
    voice: { brand: 'Ada', description: 'Notes on software.', titlePattern: '%s | Ada' },
});
