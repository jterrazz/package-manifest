import { specification } from '@jterrazz/test';
import { afterAll } from 'vitest';

export const { cleanup, cli } = await specification.cli('node', {
    defaults: { NO_COLOR: '1', TZ: 'UTC' },
});

afterAll(cleanup);
