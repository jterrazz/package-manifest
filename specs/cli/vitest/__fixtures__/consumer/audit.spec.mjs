import { specification } from '@jterrazz/test';
import { audit } from '@jterrazz/manifest/testing';
import { afterAll, expect, test } from 'vitest';

import { site } from './manifest.config.mjs';

export const { cleanup, website } = await specification.website({
    server: { command: 'node server.mjs', ready: '/' },
});

afterAll(cleanup);

audit.website(website, site, { expect, test });
