import type { SiteDefinition } from '../model/site.js';

const AI_CRAWLERS = [
    'anthropic-ai',
    'ChatGPT-User',
    'ClaudeBot',
    'Google-Extended',
    'GPTBot',
    'OAI-SearchBot',
    'PerplexityBot',
];

export type RobotsProjection = {
    rules: { allow?: string; disallow?: string[]; userAgent: string }[];
    sitemap: string;
};

export function projectRobots(site: SiteDefinition): RobotsProjection {
    const rules: RobotsProjection['rules'] = [
        { allow: '/', disallow: site.discovery.hidden, userAgent: '*' },
    ];
    if (site.discovery.aiCrawlers === 'blocked') {
        for (const bot of AI_CRAWLERS) {
            rules.push({ disallow: ['/'], userAgent: bot });
        }
    }
    return { rules, sitemap: `${site.address}/sitemap.xml` };
}
