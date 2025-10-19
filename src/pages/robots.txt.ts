import type { APIRoute } from 'astro';
import config from '../config';

export const prerender = true;

export const GET: APIRoute = async () => {
  const site = (config.siteUrl || '').replace(/\/$/, '') || (globalThis as any).Astro?.site || '';
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${site ? site : ''}/sitemap.xml\n`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};


