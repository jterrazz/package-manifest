import { defineSpecConfig, unit } from '@jterrazz/test/vitest';
import type { ViteUserConfig } from 'vitest/config';

const config: ViteUserConfig = defineSpecConfig({
    test: {
        projects: [unit()],
    },
});

export default config;
