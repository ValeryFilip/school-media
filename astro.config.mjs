// В этом файле НУЖЕН defineConfig
import { defineConfig } from 'astro/config';

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
        // Например: require('@astrojs/sitemap')(),
    ],
});
