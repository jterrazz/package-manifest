import { alternatesFor, urlFor } from '@jterrazz/manifest';

import { pages, site } from './site.mjs';

const prefixed = { ...site, languages: { ...site.languages, prefixMain: true } };

const report = {
    'urlFor main': urlFor(site, '/articles', 'en'),
    'urlFor other': urlFor(site, '/articles', 'fr'),
    'urlFor main, prefixMain': urlFor(prefixed, '/articles', 'en'),
    'urlFor main, prefixMain false': urlFor({ ...site, languages: { ...site.languages, prefixMain: false } }, '/articles', 'en'),
    'alternatesFor both locales': alternatesFor(site, pages[1]),
    'alternatesFor other locale only': alternatesFor(site, pages[2]),
    'alternatesFor both locales, prefixMain': alternatesFor(prefixed, pages[1]),
};
process.stdout.write(`${JSON.stringify(report, null, 4)}\n`);
