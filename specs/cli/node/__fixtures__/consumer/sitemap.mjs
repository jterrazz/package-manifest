import { projectSitemap } from '@jterrazz/manifest';

import { pages, site } from './site.mjs';

process.stdout.write(`${JSON.stringify(projectSitemap(site, pages), null, 4)}\n`);
