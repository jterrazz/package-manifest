import { projectRobots } from '@jterrazz/manifest';

import { site } from './site.mjs';

const blocked = { ...site, discovery: { ...site.discovery, aiCrawlers: 'blocked' } };

const report = { welcome: projectRobots(site), blocked: projectRobots(blocked) };
process.stdout.write(`${JSON.stringify(report, null, 4)}\n`);
