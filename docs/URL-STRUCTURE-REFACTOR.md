# План переезда: /media/ → /academy/

## Целевая структура URL

| Было | Стало |
|------|--------|
| `/media/` | `/academy/` |
| `/media/category/КАТЕГОРИЯ` | `/academy/КАТЕГОРИЯ` |
| `/media/tags/ТЕГ` | `/academy/tags/ТЕГ` (оставить как есть — только замена префикса) |
| `/media/articles/СЛАГ` | `/academy/КАТЕГОРИЯ/СЛАГ` |
| `/media/articles` | `/academy/articles` |
| `/media/search` | `/academy/search` |

---

## 1. Структура файлов (страницы)

### 1.1 Переименование папки и маршрутов

- **Папка:** `src/pages/media/` → `src/pages/academy/`
- **Главная академии:** `src/pages/media/index.astro` → `src/pages/academy/index.astro`
- **Поиск:** `src/pages/media/search.astro` → `src/pages/academy/search.astro`
- **Банк статей:** `src/pages/media/articles/index.astro` → `src/pages/academy/articles/index.astro`
- **Теги:** `src/pages/media/tags/[tag].astro` → `src/pages/academy/tags/[tag].astro`

### 1.2 Категории: убрать сегмент `category`

- **Было:** `src/pages/media/category/[category].astro` → URL `/media/category/novosti`
- **Стало:** `src/pages/academy/[category].astro` → URL `/academy/novosti`
- Файл: перенести логику из `media/category/[category].astro` в `academy/[category].astro` (один динамический сегмент).

### 1.3 Статьи: домен/academy/КАТЕГОРИЯ/СЛАГ

- **Было:** `src/pages/media/articles/[slug].astro` → URL `/media/articles/statya-slug`
- **Стало:** `src/pages/academy/[category]/[slug].astro` → URL `/academy/novosti/statya-slug`
- Новый файл: `src/pages/academy/[category]/[slug].astro`.
- В `getStaticPaths()` возвращать `{ params: { category: slugify(post.data.category), slug: post.slug } }`.
- Удалить старый `media/articles/[slug].astro` после переноса.

**Важно:** порядок маршрутов в Astro — более специфичные выше. Должны существовать:
- `academy/articles/index.astro` (банк) — чтобы `/academy/articles` не попадал в `[category]`
- `academy/tags/[tag].astro`
- `academy/search.astro`
- `academy/[category]/[slug].astro` — статьи
- `academy/[category].astro` — страницы категорий

---

## 2. Замены по файлам (пошагово)

### 2.1 Layouts

| Файл | Что менять |
|------|------------|
| `src/layouts/MainLayout.astro` | `pathname.startsWith("/media")` → `pathname.startsWith("/academy")`; `"media"` (pageUtmSource) → `"academy"`; `<base href="/media/" />` → `<base href="/academy/" />`; класс `media-page` → можно оставить или переименовать в `academy-page`. |
| `src/layouts/ArticleLayoutNew.astro` | `pathname.startsWith("/media")` → `pathname.startsWith("/academy")`; `base = "/media"` → `base = "/academy"`; `articleUrl` / `articlePath`: с `/articles/${slug}` на `/${categorySlug}/${slug}` (category из fm); ссылка на категорию: `base/category/...` → `base/...` (т.е. `/${categorySlug}`); теги: `base/tags/...` остаётся, только base → `/academy`. CatBadge: `href={base}/category/${categorySlug}` → `href={base}/${categorySlug}`. |

### 2.2 Компоненты

| Файл | Что менять |
|------|------------|
| `src/components/SiteFooter.astro` | `href="/media"` → `href="/academy"`. Текст «Медиа» по желанию оставить или заменить на «Академия». |
| `src/components/Breadcrumbs.astro` | Все проверки и подстановки `/media` → `/academy`; переменная `inMedia` → `inAcademy` (опционально); `homeHref` с `/media/` → `/academy/`. |
| `src/components/UnifiedMenu.astro` | Все `href="/media..."` → `href="/academy..."`: `/media` → `/academy`, `/media/category/...` → `/academy/...` (без `category` в пути), `/media/articles` → `/academy/articles`. Контекст `context === "media"` оставить или переименовать в `"academy"` (и там, где передаётся в меню). |
| `src/components/cards/cardNew.astro` | `basePath = "/media"` → `basePath = "/academy"`. Ссылка на статью: вместо `${basePath}/articles/${post.slug}` делать `${basePath}/${slugify(post.data.category)}/${post.slug}`. Ссылка на категорию: `${basePath}/category/${slugify(category)}` → `${basePath}/${slugify(category)}`. |
| `src/components/cards/CardHorizontal.astro` | Аналогично: `basePath = "/academy"`; ссылка на статью: `${basePath}/${slugify(post.data.category)}/${post.slug}`; кнопка тега: сейчас ведёт на `basePath/category/${slugify(tag)}` — для тегов оставить `basePath/tags/${slugify(tag)}` (не category). |
| `src/components/mainpage/AdMediaBanner.astro` | `basePath = "/media"` → `basePath = "/academy"`. |
| `src/components/article/TableOfContents.astro` | В комментарии: `"/media/articles/slug"` → `"/academy/category-slug/slug"`. Логика не меняется (articlePath передаётся с страницы). |

### 2.3 Страницы (после переноса в academy/)

| Файл | Что менять |
|------|------------|
| `src/pages/academy/index.astro` (бывший media/index) | Все `url`, `href`, `basePath`: `/media` → `/academy`; ссылки на категории: `/media/category/${slugify(...)}` → `/academy/${slugify(...)}`; UTM: `media-page` / `media-lead` → `academy-page` / `academy-lead` (по желанию). |
| `src/pages/academy/articles/index.astro` | `pageUrl`: `/media/articles/` → `/academy/articles/`; `basePath="/media"` → `basePath="/academy"`. |
| `src/pages/academy/articles/[slug].astro` → удалить; логика в `academy/[category]/[slug].astro` | См. раздел 1.3. |
| `src/pages/academy/[category]/[slug].astro` (новый) | Взять логику из `media/articles/[slug].astro`. `pageUrl`: `${siteUrl}/academy/${slugify(fm.category)}/${slug}/`. Breadcrumbs: категория — `${siteUrl}/academy/${slugify(fm.category)}/`. `getStaticPaths`: `params: { category: slugify(post.data.category), slug: post.slug }`. Получение статьи: по `category` + `slug` (getCollection + find по slug и category). |
| `src/pages/academy/[category].astro` (из media/category/[category]) | `pageUrl`: `/media/category/${slug}` → `/academy/${slug}`; все `basePath="/media"` → `"/academy"`. Импорты путей поправить (на уровень выше убрать category). |
| `src/pages/academy/tags/[tag].astro` | `pageUrl`: `/media/tags/...` → `/academy/tags/...`; `basePath="/media"` → `"/academy"`. |
| `src/pages/academy/search.astro` | Форма: `action="search"` — при base `/academy/` получится `/academy/search`. В клиентском скрипте ссылка на статью: сейчас `articles/${p.slug}/`; нужно `categorySlug/${p.slug}/`. В indexData добавить поле `categorySlug` (slugify категории) и в рендере использовать `href = \`${p.categorySlug}/${p.slug}/\``. |

### 2.4 Прочие страницы

| Файл | Что менять |
|------|------------|
| `src/pages/404.astro` | `href="/media/"` → `href="/academy/"`; текст «В медиа» → «В академию» (по желанию). |

### 2.5 Утилиты и конфиг

| Файл | Что менять |
|------|------------|
| `src/lib/seoData.ts` | `inMedia` → по смыслу (или оставить имя); `homeHref`: `/media/` → `/academy/`. |

### 2.6 RSS и sitemap

| Файл | Что менять |
|------|------------|
| `src/pages/rss.xml.ts` | URL статей: `${siteUrl}/media/articles/${post.slug}/` → `${siteUrl}/academy/${slugify(post.data.category)}/${post.slug}/`. Нужен доступ к category (уже есть в post.data). |
| `scripts/generate-sitemap.js` | Фильтры: `\/media\/tags\/` → `\/academy\/tags\/`; `\/media\/search\/` → `\/academy\/search\/`. |

---

## 3. Контент (MDX): внутренние ссылки на статьи

Все внутренние ссылки вида `/media/articles/...` заменить на `/academy/КАТЕГОРИЯ_СЛАГ/СЛАГ_СТАТЬИ`.

Файлы и строки (grep по `/media/articles/`):

| Файл | Замена |
|------|--------|
| `src/content/articles/kak-ne-volnovatsya-na-ekzamene-ege.mdx` | `/media/articles/shkola-i-ege` → `/academy/.../shkola-i-ege` (подставить slug категории статьи shkola-i-ege); `/media/articles/raspisanie-ege-2026` → по категории статьи raspisanie-ege-2026. |
| `src/content/articles/kak-podgotovitsya-k-ege-po-himii-s-nulya.mdx` | Аналогично: stepen-okislenia, kak-nazivat-veschestva-v-himii, kak-ne-volnovatsya-na-ekzamene-ege — нужны slug категорий для каждой целевой статьи. |
| `src/content/articles/stepen-okislenia.mdx` | kak-podgotovitsya-k-ege-po-himii-s-nulya, kak-nazivat-veschestva-v-himii. |
| `src/content/articles/shkola-i-ege.mdx` | raspisanie-ege-2026, kak-ne-volnovatsya-na-ekzamene-ege. |
| `src/content/articles/kak-nazivat-veschestva-v-himii.mdx` | kak-podgotovitsya-k-ege-po-himii-s-nulya, stepen-okislenia, klassifikatsia-neorganicheskih-veschestv. |
| `src/content/articles/raspisanie-ege-2026.mdx` | kak-podgotovitsya-k-ege-po-himii-s-nulya, shkola-i-ege, kak-ne-volnovatsya-na-ekzamene-ege, shkala-perevoda-ballov-ege. |
| `src/content/articles/shkala-perevoda-ballov-ege.mdx` | raspisanie-ege-2026. |

Формат новой ссылки: `/academy/{categorySlug}/{articleSlug}`.

**Соответствие категория → slug (slugify):**
- «Школьникам» → `shkolnikam`
- «Материалы для ЕГЭ и ОГЭ по химии» → `materialy-dlya-ege-i-oge-po-himii`
- «Видео» → `video`

**Конкретные замены в MDX:**

| Статья (файл) | Старая ссылка | Новая ссылка |
|---------------|---------------|--------------|
| kak-ne-volnovatsya-na-ekzamene-ege.mdx | `/media/articles/shkola-i-ege` | `/academy/shkolnikam/shkola-i-ege` |
| kak-ne-volnovatsya-na-ekzamene-ege.mdx | `/media/articles/raspisanie-ege-2026` | `/academy/shkolnikam/raspisanie-ege-2026` |
| kak-podgotovitsya-k-ege-po-himii-s-nulya.mdx | `/media/articles/stepen-okislenia` | `/academy/materialy-dlya-ege-i-oge-po-himii/stepen-okislenia` |
| kak-podgotovitsya-k-ege-po-himii-s-nulya.mdx | `/media/articles/kak-nazivat-veschestva-v-himii` | `/academy/materialy-dlya-ege-i-oge-po-himii/kak-nazivat-veschestva-v-himii` |
| kak-podgotovitsya-k-ege-po-himii-s-nulya.mdx | `/media/articles/kak-ne-volnovatsya-na-ekzamene-ege` | `/academy/shkolnikam/kak-ne-volnovatsya-na-ekzamene-ege` |
| stepen-okislenia.mdx | `/media/articles/kak-podgotovitsya-k-ege-po-himii-s-nulya` | `/academy/shkolnikam/kak-podgotovitsya-k-ege-po-himii-s-nulya` |
| stepen-okislenia.mdx | `/media/articles/kak-nazivat-veschestva-v-himii` | `/academy/materialy-dlya-ege-i-oge-po-himii/kak-nazivat-veschestva-v-himii` |
| shkola-i-ege.mdx | `/media/articles/raspisanie-ege-2026` | `/academy/shkolnikam/raspisanie-ege-2026` |
| shkola-i-ege.mdx | `/media/articles/kak-ne-volnovatsya-na-ekzamene-ege` | `/academy/shkolnikam/kak-ne-volnovatsya-na-ekzamene-ege` |
| kak-nazivat-veschestva-v-himii.mdx | `/media/articles/kak-podgotovitsya-k-ege-po-himii-s-nulya` | `/academy/shkolnikam/kak-podgotovitsya-k-ege-po-himii-s-nulya` |
| kak-nazivat-veschestva-v-himii.mdx | `/media/articles/stepen-okislenia` | `/academy/materialy-dlya-ege-i-oge-po-himii/stepen-okislenia` |
| kak-nazivat-veschestva-v-himii.mdx | `/media/articles/klassifikatsia-neorganicheskih-veschestv` | `/academy/materialy-dlya-ege-i-oge-po-himii/klassifikatsia-neorganicheskih-veschestv` |
| raspisanie-ege-2026.mdx | `/media/articles/kak-podgotovitsya-k-ege-po-himii-s-nulya` | `/academy/shkolnikam/kak-podgotovitsya-k-ege-po-himii-s-nulya` |
| raspisanie-ege-2026.mdx | `/media/articles/shkola-i-ege` | `/academy/shkolnikam/shkola-i-ege` |
| raspisanie-ege-2026.mdx | `/media/articles/kak-ne-volnovatsya-na-ekzamene-ege` | `/academy/shkolnikam/kak-ne-volnovatsya-na-ekzamene-ege` |
| raspisanie-ege-2026.mdx | `/media/articles/shkala-perevoda-ballov-ege` | `/academy/shkolnikam/shkala-perevoda-ballov-ege` |
| shkala-perevoda-ballov-ege.mdx | `/media/articles/raspisanie-ege-2026` | `/academy/shkolnikam/raspisanie-ege-2026` |

---

## 4. Чек-лист перед деплоем

- [x] Папка `src/pages/media` удалена; маршруты перенесены в `src/pages/academy`.
- [x] Маршруты: `[category].astro`, `[category]/[slug].astro`, `articles/index`, `tags/[tag]`, `search`, `index` — на месте и без конфликтов.
- [x] Во всех компонентах и layout’ах нет вхождений `/media` в путях (остались только CSS `@media`, классы `ad-media__*`, контекст меню `"media"`, путь к картинке `logo_media.svg`).
- [x] Карточки (CardNew, CardHorizontal) ведут на `/academy/{categorySlug}/{slug}` и на категорию `/academy/{categorySlug}`.
- [x] Breadcrumbs и меню ведут на `/academy/`, `/academy/articles`, `/academy/{category}`, `/academy/tags/...`.
- [x] Статья открывается по `/academy/{category}/{slug}`; JSON-LD и canonical используют этот URL.
- [x] Поиск: в выдаче ссылки вида `/academy/{categorySlug}/{slug}/`.
- [x] RSS: URL статей в формате `/academy/{categorySlug}/{slug}/`.
- [x] Sitemap: фильтры обновлены на `/academy/tags/` и `/academy/search`.
- [x] Все MDX-статьи: внутренние ссылки переведены на `/academy/.../...`.
- [x] 404: кнопка «В академию» ведёт на `/academy/`.
- [x] Редиректы: скрипт `scripts/generate-htaccess-redirects.js` дополняет `dist/.htaccess` правилами 301 для Таймвеб (Apache).

---

## 5. Редиректы (рекомендация)

Чтобы старые ссылки не давали 404:

- `/media` → `/academy`
- `/media/` → `/academy/`
- `/media/articles` → `/academy/articles`
- `/media/articles/` → `/academy/articles/`
- `/media/articles/{slug}` → `/academy/{categorySlug}/{slug}` (нужна таблица или правило: slug → category для каждой статьи)
- `/media/category/{category}` → `/academy/{category}`
- `/media/tags/{tag}` → `/academy/tags/{tag}`
- `/media/search` → `/academy/search`

**Реализация (Таймвеб):** скрипт `scripts/generate-htaccess-redirects.js` запускается после сборки и дополняет `dist/.htaccess` правилами RewriteRule 301. В `package.json` в команду build добавлен вызов: `node scripts/generate-htaccess-redirects.js`. Исходный `public/.htaccess` копируется в dist при сборке, затем скрипт дописывает в конец блок редиректов.

---

## 6. Документация и чек-листы в репозитории

После переезда обновить упоминания URL в:

- `SEO_CHECKLIST.md` — заменить все `/media...` на `/academy...`.
- `PRODUCTION_READINESS_CHECKLIST.md` — пути и примеры.
- `FONT-SHORTHAND-ALL-PLACES.md`, `FONT-OVERRIDES.md`, `HARDCODED-STYLES-REPORT.md`, `IMAGE_OPTIMIZATION_REPORT.md` — пути к файлам `media/` заменить на `academy/`.

---

## 7. Краткая сводка замен в коде

| Тип | Было | Стало |
|-----|------|--------|
| Префикс раздела | `/media` | `/academy` |
| Главная раздела | `/media/` | `/academy/` |
| Категория | `/media/category/{slug}` | `/academy/{slug}` |
| Теги | `/media/tags/{tag}` | `/academy/tags/{tag}` |
| Статья | `/media/articles/{slug}` | `/academy/{categorySlug}/{slug}` |
| Банк статей | `/media/articles` | `/academy/articles` |
| Поиск | `/media/search` | `/academy/search` |
| base href | `/media/` | `/academy/` |
| UTM / класс | media-page, media-lead | academy-page, academy-lead (опционально) |

Готово к использованию как пошаговый план переезда.
