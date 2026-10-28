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
                    'the ./testing entry is a rule pack a consumer runs in its own website specs, typed (import type, erased from dist/) against its specification handle',
            },
        },
    },
});
