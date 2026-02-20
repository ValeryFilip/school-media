# Чеклист готовности к продакшену и деплою

Полный список проверок перед выкладкой сайта на хостинг. Отмечайте пункты по мере выполнения.

**Связанный документ:** [SEO_CHECKLIST.md](./SEO_CHECKLIST.md) — детальный SEO-чеклист.

---

## Что можно проверить локально (без живого сайта)

Эти пункты можно проверить в репозитории и после `npm run build`:

| Раздел | Пункт | Как проверить |
|--------|--------|----------------|
| **1** | Билд без ошибок | `npm run build` |
| **1** | Нет предупреждений в билде | Смотреть вывод `npm run build` |
| **1** | Переменные окружения / секреты | В коде нет `process.env`/`import.meta.env`; нет захардкоженных API keys/паролей (проверено: только CSS‑токены) |
| **1** | astro.config | `site: 'https://egehim.ru'`, `output: 'static'` (проверено) |
| **2** | robots.txt | Генерация в `robots.txt.ts` — Sitemap в теле ответа (проверено) |
| **2** | sitemap | Генерация через `@astrojs/sitemap`: `sitemap-index.xml` + `sitemap-0.xml` в `dist`; robots.txt указывает на `sitemap-index.xml` |
| **2** | noindex 404 / thank-you / search | В коде: 404 и search через MainLayout `noindex={true}`, thank-you — свой meta robots (проверено) |
| **2** | Canonical, OG, lang, viewport | В Seo.astro, MainLayout, thank-you (проверено) |
| **4** | Внешние ссылки rel=noopener | У всех `target="_blank"` в футере, меню, thank-you, формах и т.д. есть rel (проверено) |
| **4** | Юр. страницы и ссылки | Файлы `privacy.astro`, `agreement.astro`, `payment.astro`, `refer.astro`, `marketing-consent.astro` есть; ссылки в футере, PopupForm, LeadCapture (проверено) |
| **5** | Viewport | В MainLayout и thank-you задан (проверено) |
| **6** | Секреты в коде | Поиск по apiKey/password/secret — только дизайн‑токены в CSS (проверено) |
| **1** | npm audit | Запустить `npm audit` — решить по апгрейду зависимостей |

После билда можно дополнительно: проверить наличие `dist/robots.txt`, `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, что HTML в `dist/` минифицирован.

**Остальное** (страницы открываются, Lighthouse, HTTPS, счётчики, GSC, деплой, пост‑деплой) — нужен живой сайт или ручная проверка.

---

## 1. Сборка и окружение

- [x] **Билд без ошибок** — `npm run build` завершается успешно
- [x] **Нет предупреждений в билде** — критичные warning’ы исправлены (исправлен невалидный CSS в `Table.astro`: убрано JS-выражение из `<style>`)
- [x] **Переменные окружения** — в проекте нет использования `process.env`/`import.meta.env`; секреты не захардкожены (для прода при появлении API keys — вынести в env)
- [x] **`astro.config`** — `site: 'https://egehim.ru'` соответствует прод-домену
- [x] **Режим вывода** — `output: 'static'` корректен для статического хостинга
- [ ] **Версии зависимостей** — после `npm audit fix` остаются 4 уязвимости в astro/vite/esbuild; полное исправление — апгрейд на Astro 5 (`npm audit fix --force`), это breaking change. Для статического билда без dev-сервера в проде риски ниже; при желании запланировать апгрейд

---

## 2. Индексация и SEO (базовая проверка)

- [x] **robots.txt** — доступен по `https://egehim.ru/robots.txt`, содержит `Sitemap: https://egehim.ru/sitemap-index.xml` (генерируется в `robots.txt.ts`)
- [x] **sitemap** — доступен `sitemap-index.xml` (интеграция `@astrojs/sitemap`), в нём ссылка на `sitemap-0.xml` со всеми страницами
- [x] **Служебные страницы** — 404, thank-you, search с `noindex,nofollow` (в коде: 404 и search через MainLayout `noindex={true}`, thank-you — свой meta robots)
- [x] **Canonical** — на страницах с MainLayout canonical задаётся в Seo.astro (origin + pathname; при билде origin из `site`); на thank-you добавлен `<link rel="canonical">` с config.siteUrl
- [x] **Title и description** — уникальные на ключевых страницах; правки внесены (пробелы, «ГОТОВО», медиа/поиск/архив)
- [x] **Open Graph / Twitter** — в Seo.astro: og:locale, og:type, og:site_name, og:title, og:description, og:url, og:image (absUrl); og:image:width/height/type/alt; article:published_time/modified_time для статей; twitter:card summary_large_image, title, description, image. В MainLayout при отсутствии image подставляется дефолт `/images/technical/og-home.png` — в проде даёт абсолютный URL
- [x] **Язык** — в MainLayout.astro и thank-you.astro задан `<html lang="ru">`
- [ ] **Структурированные данные** — JSON-LD без ошибок (проверка в [Google Rich Results Test](https://search.google.com/test/rich-results) / валидаторе)

---

## 3. Загрузка и производительность

- [ ] **Страницы открываются** — главная, курсы, статьи, медиа, категории/теги, 404
- [ ] **Нет белых экранов** — JS не ломает рендер (при отключённом JS критичный контент виден)
- [ ] **Скорость загрузки** — LCP < 2.5 с (Lighthouse / PageSpeed Insights)
- [ ] **CLS** — без заметных сдвигов верстки (CLS < 0.1)
- [ ] **Интерактивность** — FID/INP < 100 ms (если есть формы/кнопки)
- [ ] **Изображения** — есть `width`/`height` или aspect-ratio, где нужно — `loading="lazy"`, выше fold — без лишнего lazy
- [ ] **Критичные ресурсы** — шрифты/критичный CSS не блокируют рендер надолго; при необходимости preload
- [ ] **Размер ответов** — HTML/CSS/JS минифицированы в production-билде
- [ ] **Сжатие** — на сервере включено gzip или brotli для текстовых ресурсов

---

## 4. Контент и ссылки

- [x] **Нет битых ссылок** — исправлено: дефолтный `ctaHref` в MainLayout был `/egecourse` (страницы нет) → заменён на `/allcourses`; на странице медиа кнопка «Забрать оба курса» вела на `/start` (страницы нет) → заменена на `/allcourses`. Остальные внутренние ссылки (меню, футер, статьи, категории/теги) ведут на существующие маршруты. Рекомендуется дополнительно прогнать линк-чекером после деплоя.
- [x] **Внешние ссылки** — у всех ссылок с `target="_blank"` добавлен `rel="noopener noreferrer"` или `rel="noopener"`: CasesSlider, caseCard, PlainSlot, SiteFooter (YouTube, VK, Telegram), thank-you; в payment.astro, UnifiedMenu, ArticleLayoutNew, PopupForm, LeadCapture, leadCapture2, AdSocialBanner, SupportFab уже были.
- [ ] **Формы** — поиск: `action="search"` (GET) на /media/search — ок. Лид-формы: на главной и в медиа передаётся внешний `formAction` (Google Apps Script); дефолт в LeadCapture/leadCapture2 — `/api/lead` — на статическом хостинге без сервера даст 404; при использовании без переопределения `formAction` нужен бэкенд или подстановка рабочего URL.
- [x] **UTM на формах и кнопках** — попап: в MainLayout в PopupForm передаётся `utmSource` по странице (main-page, media, allcourses, …), `utmMedium=organic`, `utmCampaign=popup-lead`. Кнопки открытия попапа (меню десктоп/мобильное, футер) получают `pageUtmSource` из layout и `data-utm-content`: menu-desktop, menu-mobile, footer. Инлайн LeadCapture: главная — main-page/organic/homepage-lead; медиа — media-page/organic/media-lead; allcourses — allcourses/organic/allcourses-lead. Баннеры в статьях (PicButtonText): utm_source/campaign/content задаются пропсами (по умолчанию banner-article). При отправке попапа приоритет UTM: кнопка-триггер > data-атрибуты формы > last_touch из URL.
- [ ] **Медиа** — изображения и видео загружаются, пути после билда корректны (проверить вручную или линк-чекером)
- [x] **RSS** — в `rss.xml.ts` URL статей формируются как `${siteUrl}/media/articles/${slug}` (config.siteUrl); фид валидный, ссылки на прод-URL

---

## 5. Мобильная версия и UX

- [x] **Viewport** — в MainLayout.astro и thank-you.astro задан `<meta name="viewport" content="width=device-width, initial-scale=1" />`
- [ ] **Адаптивность** — вёрстка читаема и кликабельна на 320px–428px
- [ ] **Touch-элементы** — кнопки/ссылки не меньше ~44×44 px
- [ ] **Тексты** — читаемы без зума, контраст достаточный (WCAG AA по возможности)
- [ ] **Навигация** — меню и футер работают на мобильных

---

## 6. Безопасность и заголовки (на стороне хостинга/прокси)

- [ ] **HTTPS** — весь сайт отдаётся по HTTPS, редирект с HTTP на HTTPS
- [ ] **HSTS** — заголовок включён (по возможности)
- [ ] **X-Content-Type-Options: nosniff** — включён
- [ ] **X-Frame-Options** — задан (например `DENY` или `SAMEORIGIN`)
- [ ] **Content-Security-Policy** — при необходимости настроен без поломки скриптов/стилей
- [ ] **Секреты** — нет API keys и паролей в репозитории и в клиентском коде

---

## 7. Аналитика и мониторинг

- [ ] **Счётчики** — Яндекс.Метрика (и др.) работают на прод-домене, тег не дублируется
- [ ] **Поисковики** — сайт добавлен в Google Search Console и Яндекс.Вебмастер
- [ ] **Отправка sitemap** — sitemap добавлен в GSC и Вебмастер
- [ ] **Цели/события** — заявки, клики по кнопкам при необходимости считаются

---

## 8. Юридическое и согласия

- [ ] **Политика конфиденциальности** — страница есть, ссылка в футере/формах
- [ ] **Согласие на обработку персональных данных** — страница и ссылка где нужно
- [ ] **Согласие на рассылку** — при наличии подписок/рассылок
- [ ] **Договор оферты/оплаты** — при приёме платежей страницы и ссылки на месте

---

## 9. Хостинг и деплой

- [ ] **Деплой** — выбран способ (статический хостинг / CI/CD), билд запускается из прод-окружения
- [ ] **Домен** — DNS указывает на хостинг, A/AAAA или CNAME настроены
- [ ] **SSL-сертификат** — установлен и не истекает в ближайшее время
- [ ] **Корневая страница** — запрос к `https://egehim.ru/` отдаёт главную (не 404)
- [ ] **Вложенные пути** — работают прямые заходы на `/media/articles/...`, `/neorganika/` и т.д. (для SPA/статики — корректная настройка fallback при необходимости)
- [ ] **Служебные файлы** — `robots.txt`, `sitemap.xml`, `rss.xml` отдаются с правильным Content-Type
- [ ] **Кэширование** — для статики (CSS, JS, изображения) настроены адекватные Cache-Control/ETag

---

## 10. Пост-деплой (быстрая проверка)

- [ ] **Главная** — открывается, контент актуален
- [ ] **2–3 статьи** — открываются по прямым ссылкам из sitemap
- [ ] **Одна страница курса** — например `/neorganika/`
- [ ] **404** — по несуществующему URL показывается своя страница 404
- [ ] **robots.txt и sitemap** — открываются в браузере по прод-URL
- [ ] **Проверка в поиске** — запрос `site:egehim.ru` в Google/Яндекс показывает сайт (после индексации)
- [ ] **Мобильный тест** — быстрая проверка с телефона или Lighthouse mobile

---

## Краткий чеклист «минимум перед выкладкой»

1. Билд без ошибок.
2. `site` в конфиге = прод-домен.
3. robots.txt и sitemap доступны и корректны.
4. Критичные страницы с canonical, title, description, noindex где нужно.
5. Нет битых ссылок на главных экранах.
6. HTTPS и редирект с HTTP.
7. Домен и SSL настроены.
8. Метрика/счётчики работают.
9. Юридические страницы и ссылки на месте.
10. Пост-деплой: главная, статьи, 404, sitemap — открываются.

После прохождения полного чеклиста можно считать проект готовым к продакшену и индексации.
