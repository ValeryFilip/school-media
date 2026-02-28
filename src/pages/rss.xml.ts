// src/pages/rss.xml.ts — нативный @astrojs/rss
export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import config from '../config';
import { slugify } from '../lib/slugify';

export async function GET(context: { site: URL | undefined }) {
  const posts = await getCollection('articles', ({ data }) => data.visible !== false);
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const siteUrl = (context.site?.href || config.siteUrl || '').replace(/\/$/, '');

  return rss({
    title: config.siteName,
    description: config.description,
    site: context.site ?? new URL(config.siteUrl),
    items: posts.map((post) => {
      const categorySlug = slugify(String(post.data.category || ''));
      const url = `${siteUrl}/academy/${categorySlug}/${post.slug}/`;
      const descHtml = [
        post.data.image ? `<p><img src="${siteUrl}${post.data.image}" alt="${post.data.title}" /></p>` : '',
        post.data.description ? `<p>${post.data.description}</p>` : '',
      ].filter(Boolean).join('');

      return {
        title: post.data.title,
        link: url,
        pubDate: post.data.date,
        description: descHtml || undefined,
        author: post.data.author,
        categories: [post.data.category, ...(post.data.tags ?? [])].filter(Boolean),
        enclosure: post.data.image
          ? { url: `${siteUrl}${post.data.image}`, length: 0, type: 'image/jpeg' }
          : undefined,
        customData: post.data.readingTime
          ? `<readingTime><![CDATA[${post.data.readingTime}]]></readingTime>`
          : undefined,
      };
    }),
    customData: '<language>ru-RU</language>',
  });
}
