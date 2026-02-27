# Рефакторинг URL статей и раздела «медиа»

Документ для будущей реализации: анализ двух вариантов смены формата ссылок на статьи и категории.

---

## Текущая структура

| Назначение | Текущий URL | Файл |
|------------|-------------|------|
| Главная блога | `egehim.ru/media/` | `src/pages/media/index.astro` |
| Каталог статей | `egehim.ru/media/articles/` | `src/pages/media/articles/index.astro` |
| Страница статьи | `egehim.ru/media/articles/[slug]/` | `src/pages/media/articles/[slug].astro` |
| Категория | `egehim.ru/media/category/[category]/` | `src/pages/media/category/[category].astro` |
| Тег | `egehim.ru/media/tags/[tag]/` | `src/pages/media/tags/[tag].astro` |
| Поиск | `egehim.ru/media/search` | `src/pages/media/search.astro` |

У каждой статьи в frontmatter есть поле `category` (например: «Школьникам», «Видео», «Материалы для ЕГЭ и ОГЭ по химии»). Для URL используется slugified-значение (например `shkolnkam`, `video`).

---

## Вариант 1: Статьи в корне без /media/

**Целевая схема:**
- Статья: `egehim.ru/[КАТЕГОРИЯ]/[SLUG]` (без префикса)
- `/media/` остаётся только для: тегов, категорий (листинг), главной блога (и при необходимости каталога статей)

**Плюсы:** короткие и «человеческие» URL статей.  
**Минусы:** динамический маршрут `[category]/[slug]` в корне; нужно аккуратно генерировать только пары из реальных статей, чтобы не пересекаться с существующими страницами (`/privacy`, `/organika` и т.д.).

### Что делать

1. **Новая страница статьи** — `src/pages/[category]/[slug].astro`:
   - В `getStaticPaths()` по коллекции статей возвращать `{ params: { category: slugify(fm.category), slug: post.slug } }`.
   - Внутри страницы: загрузка по `slug`, проверка `slugify(fm.category) === params.category` (иначе редирект на правильный URL или 404).
   - Перенести логику из `media/articles/[slug].astro` (layout, JSON-LD, breadcrumbs, рекомендации).

2. **Обновить все ссылки на статьи** — везде вместо `basePath + "/articles/" + slug` использовать `"/" + slugify(category) + "/" + slug`:
   - `CardHorizontal.astro`, `cardNew.astro` — есть `post.data.category`, подставлять в ссылку.
   - `ArticleLayoutNew.astro` — `articlePath`, `articleUrl`, ссылки «назад в категорию», шаринг.
   - `media/articles/index.astro` — в шаблонах карточек ссылка на статью с категорией.
   - `media/search.astro` — абсолютный путь `/${slugify(p.category)}/${p.slug}`.
   - `media/category/[category].astro`, `media/tags/[tag].astro` — при рендере карточек передавать category поста + slug.
   - `rss.xml.ts` — `link` на статью: `${siteUrl}/${slugify(post.data.category)}/${post.slug}/`.

3. **Старый URL** `/media/articles/[slug]`:
   - Либо удалить файл (старые ссылки дадут 404).
   - Либо оставить редирект 301 на `/${category}/${slug}` (лучше для SEO).

4. **Остальное:** меню, баннеры — ссылки на «Все статьи» и категории оставить на `/media/articles` и `/media/category/...`. Breadcrumbs на странице статьи: при необходимости вести на `/media` и `/media/category/...`.

**Оценка:** один новый маршрут + правки в 7–9 файлах; время — порядка 1–2 часов.

---

## Вариант 2: Заменить media → library (рекомендуемый)

**Целевая схема:**
- Везде префикс **`/library/`** вместо `/media/`.
- Статья: **`egehim.ru/library/[КАТЕГОРИЯ]/[SLUG]`** (например `/library/shkolnkam/nazvanie-stati`).
- Категория (листинг): **`egehim.ru/library/[КАТЕГОРИЯ]`** (например `/library/shkolnkam`), без сегмента `category` в пути.
- Теги: **`egehim.ru/library/tags/[tag]`** — структура «как есть», только база `media` → `library`.
- Главная блога: **`egehim.ru/library/`**.
- Каталог статей (если нужен): **`egehim.ru/library/articles/`**.

**Плюсы:** один префикс для всего раздела, нет маршрутов в корне, понятные URL, проще массовая замена строк и правка структуры папок.

### Что делать

#### 1. Структура страниц

- Переименовать **`src/pages/media/`** → **`src/pages/library/`**.
- **Категория (листинг):** перенести логику из `media/category/[category].astro` в **`library/[category].astro`** (URL станет `/library/школьникам` без слова `category`).
- **Статья:** новая страница **`library/[category]/[slug].astro`**:
  - `getStaticPaths()`: по коллекции статей возвращать `{ params: { category: slugify(category), slug } }`.
  - Внутри: загрузка по `slug`, проверка совпадения `slugify(fm.category)` с `params.category`.
- **Теги:** оставить ту же структуру — **`library/tags/[tag].astro`** (содержимое как сейчас).
- **Главная блога:** **`library/index.astro`** (аналог текущего `media/index.astro`).
- **Каталог статей:** **`library/articles/index.astro`** (аналог `media/articles/index.astro`).
- В **`library/[category].astro`** в `getStaticPaths()` возвращать только slug’и категорий, которые реально есть у статей (не `articles`, не `tags`), чтобы не конфликтовать с `library/articles/` и `library/tags/`.

#### 2. Замена путей и переменных

| Где | Что менять |
|-----|------------|
| **MainLayout** | `pathname.startsWith("/media")` → `"/library"`, `<base href="/media/">` → `"/library/"`. |
| **Breadcrumbs** | Проверка и пути с `/media` → `/library`. |
| **UnifiedMenu** | `/media`, `/media/articles`, `/media/category/...` → `/library`, `/library/articles`, категории как `/library/[category]`. |
| **CardHorizontal, cardNew, AdMediaBanner** | `basePath = "/media"` → `"/library"`, ссылка на статью: **`/library/${slugify(category)}/${slug}`**. |
| **ArticleLayoutNew** | `base = "/media"` → `"/library"`, ссылки: статья **`/library/${categorySlug}/${slug}`**, категория **`/library/${categorySlug}`**. |
| **Страницы library/** | Во всех (index, articles/index, [category], [category]/[slug], tags/[tag], search) заменить `siteUrl + "/media/..."` и внутренние ссылки на `/library/...`. |
| **RSS** | URL статей: **`/library/${slugify(category)}/${slug}/`**. |
| **404, SiteFooter** | Ссылки «В медиа» / «Медиа» → `/library/` (и при желании текст «Библиотека»). |
| **seoData** | `inMedia` и `homeHref` с `/media/` → проверка по `/library/` и `.../library/`. |
| **Контент (MDX)** | Прямые ссылки вида `/media/articles/...` в статьях заменить на **`/library/КАТЕГОРИЯ/slug`** (по одной категории и slug для каждой статьи). |

#### 3. Редиректы (для SEO)

- `/media` → `/library`
- `/media/articles` → `/library/articles`
- `/media/articles/:slug` → `/library/:category/:slug` (category из frontmatter по slug)
- `/media/category/:category` → `/library/:category`
- `/media/tags/:tag` → `/library/tags/:tag`

Редиректы задать в конфиге хостинга (Netlify, Vercel, nginx и т.п.) или в `astro.config.mjs`, если поддерживается.

**Оценка:** переименование папки + правки в ~15–20 файлах; время — порядка 1–2 часов.

---

## Файлы и места, где встречается /media или формирование ссылок

(Удобно для поиска при реализации.)

- `src/pages/404.astro` — ссылка «В медиа»
- `src/pages/media/` — вся папка → `library/`
- `src/pages/rss.xml.ts` — URL статей
- `src/layouts/MainLayout.astro` — `inMedia`, `<base href>`
- `src/layouts/ArticleLayoutNew.astro` — `base`, ссылки на статью и категорию
- `src/components/Breadcrumbs.astro` — `inMedia`, `homeHref`
- `src/components/UnifiedMenu.astro` — ссылки на медиа/категории/статьи
- `src/components/cards/CardHorizontal.astro` — `basePath`, формирование `href`
- `src/components/cards/cardNew.astro` — `basePath`, ссылки на статью и категорию
- `src/components/mainpage/AdMediaBanner.astro` — `basePath`
- `src/components/article/TableOfContents.astro` — комментарий/пример пути
- `src/components/SiteFooter.astro` — ссылка «Медиа»
- `src/lib/seoData.ts` — `inMedia`, `homeHref`
- `src/content/articles/*.mdx` — прямые ссылки вида `(/media/articles/...)`

---

## Итог

- **Вариант 1** — статьи в корне, без префикса; технически возможен, но добавляет динамический маршрут в корень и редиректы со старых URL.
- **Вариант 2** — замена media → library с форматами `/library/КАТЕГОРИЯ/НАЗВАНИЕ` и `/library/КАТЕГОРИЯ`, теги как `/library/tags/...` — проще внедрять и поддерживать, все пути под одним префиксом.

Для будущей работы достаточно выбрать один вариант и последовательно пройти список файлов выше, обновляя пути и формирование ссылок на статьи и категории.
