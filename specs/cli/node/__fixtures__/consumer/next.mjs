import { createLlms, createRobots, createSitemap } from '@jterrazz/manifest/next';

import { pages, site } from './site.mjs';

const response = createLlms(site, [() => pages.slice(0, 2), () => pages.slice(6)])();

const report = {
    robots: createRobots({ ...site, discovery: { ...site.discovery, aiCrawlers: 'blocked' } })(),
    sitemap: createSitemap(site, [() => pages.slice(1, 2), () => pages.slice(6)])(),
    llms: {
        status: response.status,
        headers: Object.fromEntries(response.headers),
        body: await response.text(),
    },
};
process.stdout.write(`${JSON.stringify(report, null, 4)}\n`);
