import { page } from './page.js';
import type { PageDefinition } from './page.js';

/** A bilingual article — the page kind every projection has something to say about. */
export const article: PageDefinition = page({
    dates: { modified: '2026-01-02', published: '2026-01-01' },
    description: 'An article.',
    kind: 'article',
    locales: ['en', 'fr'],
    path: '/articles/1-hello',
    title: 'Hello',
});
