// src/pages/rss.xml.ts
export const prerender = true;

import { getCollection } from 'astro:content';
import config from '../config.ts';

export async function GET() {
    // Загружаем и сортируем статьи
    const posts = await getCollection('articles');
    posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

    // Убираем слеш на конце, если он есть
    const siteUrl = config.siteUrl.replace(/\/$/, '');

    // Формируем <item> для каждой статьи
    const itemsXml = posts.map((post) => {
        const { slug, data } = post;
        const url = `${siteUrl}/articles/${slug}`;
        const pubDate = data.date.toUTCString();

        // Описание: картинка + текст
        const descHtml = `
      ${data.image ? `<p><img src="${siteUrl}${data.image}" alt="${data.title}" /></p>` : ''}
      <p>${data.description}</p>
    `;

        return `
    <item>
      <title><![CDATA[${data.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>

      <author><![CDATA[${data.author}]]></author>

      <!-- Основная категория -->
      <category><![CDATA[${data.category}]]></category>
      <!-- Дополнительные категории для тегов -->
      ${data.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n      ')}

      <!-- Время чтения как свой тег -->
      <readingTime><![CDATA[${data.readingTime}]]></readingTime>

      <!-- Enclosure для картинок (если есть) -->
      ${data.image ? `<enclosure url="${siteUrl}${data.image}" type="image/jpeg" length="0" />` : ''}

      <!-- Описание в CDATA, содержит HTML -->
      <description><![CDATA[${descHtml}]]></description>
    </item>`;
    }).join('');

    // Собираем финальный RSS
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${config.siteName}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${config.description}]]></description>
    <language>ru-RU</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;

    return new Response(rss, {
        status: 200,
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
        },
    });
}
