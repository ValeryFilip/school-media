# Скрипты, которые можно заменить вёрсткой/CSS или сборкой

Список компонентов, где JS делает то, что можно перенести в CSS или на этап сборки (Astro). Для будущего рефактора.

---

## 1. Подгон размеров под контейнер (замеры + CSS-переменные)

**Файл:** `src/components/SideCategoryScroller.astro`

**Что делает:** Меряет `getBoundingClientRect()` у подписей и бара, считает scale и размеры ячеек, выставляет `--label-scale`, `--cell-h`, `--cell-w`. ResizeObserver + load/resize.

**Чем заменить:** Задать размеры/масштаб через CSS (фиксированные значения, `clamp()`, при необходимости container queries). Убрать замеры и JS.

---

## 2. Слайдеры на translateX по замеренной ширине

**Файлы:**
- `src/components/mainpage/CasesSlider.astro`
- `src/components/stepik/ModulesSlider.astro`

**Что делают:** Смещение каретки через `getBoundingClientRect().width` / `offsetLeft` и gap, обновление при resize.

**Чем заменить:** Слайдер на **CSS scroll-snap** (`overflow-x: auto`, `scroll-snap-type`, `scroll-snap-align`), кнопки — через `scrollIntoView` или ссылки. Расчёт `translateX` в JS не нужен.

---

## 3. ID заголовков и slug на клиенте

**Файл:** `src/layouts/ArticleLayoutNew.astro`

**Что делает:** Slugify заголовков и проставление `id` у `h2`/`h3` в `.article__content`.

**Чем заменить:** Делать slug и выставлять `id` при сборке в Astro (при рендере статьи). Убрать клиентский скрипт.

---

## 4. Оглавление (TOC) строится в браузере

**Файл:** `src/components/article/TableOfContents.astro`

**Что делает:** Обходит заголовки в контенте, генерирует список ссылок, при необходимости дописывает им `id`.

**Чем заменить:** Строить TOC при сборке (в Astro) и рендерить готовый HTML. ID заголовков тоже задавать на этапе сборки.

---

## 5. Подстановка первой картинки в hero

**Файл:** `src/components/article/ArticleHero.astro`

**Что делает:** Если в hero нет картинки — ищет первую `img` в контенте и клонирует в hero.

**Чем заменить:** При сборке (в layout или при рендере контента) определять первую картинку и передавать в hero как проп. Без клиентского JS.

---

## 6. Табы переключением класса и hidden

**Файлы:**
- `src/components/mainpage/courseCardsnew.astro`
- `src/components/mdx/VideoTabs.astro`

**Что делают:** Клик по вкладке → смена класса и `card.hidden` / показ нужного блока по `data-tab`.

**Чем заменить:** Табы на чистом CSS: скрытые `radio` + `label` и селекторы вида `[name="tab"]:checked ~ .card[data-tab="..."]`, либо один блок с `:target` / `details`.

---

## 7. Аккордеон «только один открыт»

**Файл:** `src/components/mainpage/Faq.astro`

**Что делает:** На событии `toggle` у `<details>` закрывает остальные пункты.

**Чем заменить:** Поведение «один открыт» можно сделать без JS через радиокнопки и привязку к `label` (radio-hack для аккордеона) или один общий `name` на `details` (с учётом поддержки браузерами).

---

## 8. Показ кнопки «Наверх» по скроллу

**Файл:** `src/components/ui/ScrollToTop.astro`

**Что делает:** При `scrollY > 300` добавляет класс `is-visible`.

**Чем заменить:** В поддерживаемых браузерах — **scroll-driven animations** (`animation-timeline: scroll()`, `@keyframes` по прогрессу скролла). Клик «наверх» можно оставить минимальным JS или заменить на якорь `#` (без smooth).

---

## 9. Полоска прогресса чтения

**Файл:** `src/components/article/ProgressBar.astro`

**Что делает:** По скроллу считает долю прочитанного и задаёт `width` полоски.

**Чем заменить:** В современных браузерах — **scroll-driven animations** (`animation-timeline: scroll()`) для ширины полоски. Без скрипта для самой анимации.

---

## 10. Клиентская пагинация по шаблонам

**Файл:** `src/components/Pagination.astro`

**Что делает:** Рендерит страницы из `template[id^="tmpl-"]`, переписывает `grid.innerHTML` и разметку пагинатора.

**Чем заменить:** Серверная пагинация по `?page=N` с разными URL и готовой вёрсткой с Astro. Тогда этот клиентский скрипт не нужен.

---

## Уже сделано

- **AuthorSection.astro** — выравнивание высоты правой колонки под левую перенесено в CSS (grid + flex), скрипт с `--author-equal-h` и ResizeObserver удалён.
