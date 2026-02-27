// В этом файле НУЖЕН defineConfig
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE = 'https://egehim.ru';

export default defineConfig({
    site: SITE,
    output: 'static',

    // Подсветка кода в Markdown
    markdown: {
        syntaxHighlight: 'prism',
    },

    // Настройка Vite для поддержки алиасов
    vite: {
        build: {
            cssCodeSplit: false, // один общий CSS-файл вместо чанков
        },
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
                'src': path.resolve(__dirname, './src'),
            },
        },
    },

    // Здесь можно подключать интеграции (RSS, sitemap, tailwind и т. д.)
    integrations: [mdx()],
});