import { defineConfig } from 'tsdown';
import type { UserConfig } from 'tsdown';

/**
 * Three ESM entries mirroring the exports map: the model and its projections,
 * the Next.js adapter, and the testing rule pack. Peer-provided frameworks
 * (next, vitest, @jterrazz/test) stay external.
 */
const config: UserConfig = defineConfig({
    deps: { neverBundle: ['next', 'vitest', '@jterrazz/test'] },
    dts: true,
    // The exports map publishes `.js` / `.d.ts`; tsdown pins `.mjs` on the node platform.
    fixedExtension: false,
    entry: {
        index: 'src/index.ts',
        next: 'src/next/index.ts',
        testing: 'src/testing/index.ts',
    },
    format: ['esm'],
});

export default config;
