import { testing } from '@jterrazz/test/oxlint';
import { compose, defineConfig, library } from '@jterrazz/typescript/oxlint';

export default defineConfig(
    compose(library, testing, {
        overrides: [
            {
                // reason: `audit.website` is a rule pack of plain vitest tests,
                // published so a CONSUMER can run it against its own site —
                // `@jterrazz/test` and `vitest` are its sanctioned seam, not
                // prod leakage (both are optional peers of this package).
                files: ['src/testing/index.ts'],
                rules: { 'jterrazz/f2-no-test-imports-in-prod': 'off' },
            },
        ],
    }),
);
