// В этом файле НУЖЕН defineConfig
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
    // Ваш публичный URL (для sitemap, og:url и т. д.)
    site: 'https://egehim.ru',

    // Статический режим для генерации статических файлов
    output: 'static',

    // Подсветка кода в Markdown
    markdown: {
        syntaxHighlight: 'prism',
    },

    // Здесь можно подключать интеграции (RSS, sitemap, tailwind и т. д.)
    integrations: [
        mdx(), // Поддержка MDX (Markdown + JSX)
    ],
});
