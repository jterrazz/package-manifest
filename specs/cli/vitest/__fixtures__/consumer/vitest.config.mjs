export default {
    test: {
        hookTimeout: 60_000,
        include: ['audit.spec.mjs'],
        reporters: ['./reporter.mjs'],
        testTimeout: 30_000,
    },
};
