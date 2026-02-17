import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SitemapStream, streamToPromise } from 'sitemap';
import config from '../config';
import { slugify } from '../lib/slugify';

export const prerender = true;

function siteBase(): string {
    // приоритет: astro.config.site (если настроен) → config.siteUrl
    // @ts-ignore Astro глобален на этапе билда
    const astroSite = typeof Astro !== 'undefined' && Astro?.site ? String(Astro.site) : '';
    const fallback = (config?.siteUrl || '').trim();
    const s = (astroSite || fallback || '').replace(/\/$/, '');
    if (!s) throw new Error('Sitemap: site URL не задан. Укажи `site` в astro.config.mjs или config.siteUrl');
    return s;
}

function toIsoSafe(d: unknown): string | undefined {
    if (!d) return undefined;
    const obj = d instanceof Date ? d : new Date(String(d));
    return isNaN(obj.getTime()) ? undefined : obj.toISOString();
}

export const GET: APIRoute = async () => {
    const base = siteBase();

    // Контент «Медиа» (только видимые статьи)
    const posts = await getCollection('articles', ({ data }) => {
        return data.visible !== false;
    });
    const categories = Array.from(new Set(posts.map(p => String(p.data.category || '').trim()).filter(Boolean)));
    const tags = Array.from(new Set(posts.flatMap(p => Array.isArray(p.data.tags) ? p.data.tags : []).filter(Boolean)));

    const smStream = new SitemapStream({ hostname: base });

    // 1) Статика: собрать все .astro страницы (без динамических [param])
    const pageFiles = Object.keys(import.meta.glob('./**/*.astro', { eager: true }));
    const toRoute = (p: string) => {
        // './neorganika.astro' -> '/neorganika/' ; './index.astro' -> '/' ; './media/index.astro' -> '/media/'
        let r = p.replace(/^\.\//, '').replace(/\.astro$/, '');
        if (r === 'index' || r.endsWith('/index')) r = r === 'index' ? '' : r.slice(0, -('/index'.length));
        if (!r.startsWith('/')) r = '/' + r;
        if (!r.endsWith('/')) r = r + '/';
        return r;
    };
    // URL, которые добавляем отдельно с другими priority/changefreq — не дублируем из статики
    const excludeFromStatic = ['/sitemap.xml/', '/rss.xml/', '/robots.txt/', '/media/', '/media/articles/', '/media/search/', '/thank-you/'];
    const staticRoutes = pageFiles
        .filter(p => !p.includes('['))
        .filter(p => !p.endsWith('404.astro'))
        .map(toRoute)
        .filter(r => !excludeFromStatic.includes(r));

    // 1) Статика
    for (const url of staticRoutes) {
        smStream.write({ url, changefreq: 'weekly', priority: url === '/' ? 1.0 : 0.7 });
    }

    // 2) Медиа: корневые страницы (по одному разу с нужными priority)
    smStream.write({ url: '/media/', changefreq: 'daily', priority: 0.9 });
    smStream.write({ url: '/media/articles/', changefreq: 'daily', priority: 0.8 });
    smStream.write({ url: '/media/search/', changefreq: 'weekly', priority: 0.5 });

    // 3) Медиа: категории и теги
    for (const cat of categories) {
        smStream.write({ url: `/media/category/${slugify(String(cat))}/`, changefreq: 'weekly', priority: 0.6 });
    }
    for (const tag of tags) {
        smStream.write({ url: `/media/tags/${slugify(String(tag))}/`, changefreq: 'weekly', priority: 0.5 });
    }

    // 4) Медиа: статьи
    for (const p of posts) {
        smStream.write({ url: `/media/articles/${p.slug}/`, changefreq: 'monthly', lastmod: toIsoSafe(p.data.date), priority: 0.7 });
    }

    smStream.end();
    const xml = (await streamToPromise(smStream)).toString();

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
};
