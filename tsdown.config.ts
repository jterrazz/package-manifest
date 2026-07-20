import { defineConfig } from 'tsdown';

/**
 * Three ESM entries mirroring the exports map: the core model+projections,
 * the Next.js adapter, and the testing rule pack. Peer-provided frameworks
 * (next, vitest, @jterrazz/test) stay external.
 */
export default defineConfig({
    dts: true,
    entry: {
        index: 'src/core/index.ts',
        next: 'src/next/index.ts',
        testing: 'src/testing/index.ts',
    },
    external: ['next', 'vitest', '@jterrazz/test'],
    format: ['esm'],
});
