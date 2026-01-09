// В этом файле НУЖЕН defineConfig
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    // Ваш публичный URL (для sitemap, og:url и т. д.)
    site: 'https://egehim.ru',

    // Статический режим для генерации статических файлов
    output: 'static',

    // Подсветка кода в Markdown
    markdown: {
        syntaxHighlight: 'prism',
    },

    // Настройка Vite для поддержки алиаса ~/
    vite: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
            },
        },
    },

    // Здесь можно подключать интеграции (RSS, sitemap, tailwind и т. д.)
    integrations: [
        mdx(), // Поддержка MDX (Markdown + JSX)
    ],
});
