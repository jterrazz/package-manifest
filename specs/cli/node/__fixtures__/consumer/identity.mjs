import { person, personId, projectAuthorRef, projectIdentityGraph, websiteId } from '@jterrazz/manifest';

import { site } from './site.mjs';

const bare = {
    ...site,
    identity: person({ headline: 'Writer', name: 'Bo Bare', occupation: 'Writer', profiles: [] }),
};

const report = {
    'person()': bare.identity,
    personId: personId(site),
    websiteId: websiteId(site),
    authorRef: projectAuthorRef(site),
    graph: projectIdentityGraph(site),
    'person with no contact, portrait nor topics': projectIdentityGraph(bare)['@graph'][1],
};
process.stdout.write(`${JSON.stringify(report, null, 4)}\n`);
