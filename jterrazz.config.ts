import { test } from '@jterrazz/test/config';
import { defineConfig } from '@jterrazz/typescript/config';

export default defineConfig({
    kind: 'library',
    platform: 'node',
    presets: [test()],
    test: {
        production: {
            allow: {
                '@jterrazz/test':
                    'the ./testing entry is a rule pack a consumer runs in its own website specs, built on its specification handle',
                vitest: 'the ./testing entry registers each audit rule as a vitest test of the consumer suite that calls it',
            },
        },
    },
});
