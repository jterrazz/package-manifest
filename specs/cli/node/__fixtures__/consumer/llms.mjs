import { projectLlms } from '@jterrazz/manifest';

import { pages, site } from './site.mjs';

const quiet = {
    ...site,
    channels: { ...site.channels, feed: false },
    identity: { ...site.identity, profiles: ['https://www.linkedin.com/in/ada'] },
};

process.stdout.write(`${projectLlms(site, pages)}--- no feed, no GitHub profile, no page ---\n${projectLlms(quiet, [])}`);
