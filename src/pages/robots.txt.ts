import type { APIRoute } from 'astro';
import config from '../config';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href || config.siteUrl || '').replace(/\/$/, '');
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${base ? `${base}/sitemap-index.xml` : ''}\n`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};


