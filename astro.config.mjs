// В этом файле НУЖЕН defineConfig
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import path from 'path';
import { fileURLToPath } from 'url';

import sitemap from '@astrojs/sitemap';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    // Обязательно для sitemap: полный URL с https:// (иначе интеграция не сможет строить URL и возможен undefined в astro:build:done)
    site: 'https://egehim.ru',

    // Статический режим. При output: 'server' (SSR) sitemap получает undefined вместо списка страниц и падает на .reduce()
    output: 'static',

    // Подсветка кода в Markdown
    markdown: {
        syntaxHighlight: 'prism',
    },

    // Настройка Vite для поддержки алиасов
    vite: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
                'src': path.resolve(__dirname, './src'),
            },
        },
    },

    // Здесь можно подключать интеграции (RSS, sitemap, tailwind и т. д.)
    integrations: [mdx(), sitemap()],
});