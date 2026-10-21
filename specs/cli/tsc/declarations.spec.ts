import { directory, packed } from '@jterrazz/test';
import { describe, expect, test } from 'vitest';

import { cli } from '../cli.specification.js';

describe('declarations', () => {
    test('a consumer naming every export compiles against the declarations of the two entries, and every call they must refuse is refused', async () => {
        // Given - a consumer module naming every export of the model and the audit, each refused call marked `@ts-expect-error`, with the compiler and the peers' types beside the packed package
        const result = await cli
            .fixture(directory('./__fixtures__/consumer/'))
            .link('@jterrazz/manifest', packed())
            .link('@jterrazz/test')
            .link('vitest')
            .link('typescript')
            .exec('node_modules/typescript/bin/tsc --project .');

        // Then - the compiler reports nothing: no unmarked line fails, and no marked one compiles
        expect(result.exitCode).toBe(0);
        expect(result.stdout.text).toBe('');
    });
});
