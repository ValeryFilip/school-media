# Отчёт: захардкоженные шрифты и цвета в компонентах

Ниже перечислены все места, где заданы **жёстко прописанные** значения шрифтов (font-size в px, шорткат `font:` с числами) и цвета (hex, rgb, rgba) вместо переменных из глобала (`--ff`, `--h1`–`--h4`, `--lead`, `--text`, `--blue`, `--black`, `--white`, `--gray`, `--border`, `--coral`, `--overlay` и т.д.).

**Глобальные токены (использовать вместо литер):**
- Шрифты: `--ff`, `--h1`, `--h2`, `--h3`, `--h4`, `--lead`, `--text`
- Цвета: `--blue` (#366ef0), `--black` (#111), `--white` (#fff), `--gray` (#888), `--border` (#dfdfdf), `--orange`, `--bg`, `--green`, `--error` (#ef4444), `--coral` (#ff6b35), `--overlay` (rgba(0,0,0,0.75))

---

## 1. Шрифты (font-size в px, font: с числами, font-weight)

### Компоненты mainpage
| Файл | Строка | Что захардкожено |
|------|--------|------------------|
| AboutSection.astro | 187, 195, 205, 226, 234, 244, 303, 321, 344 | font-weight: 700 / 500 |
| AuthorSection.astro | 212 | font-weight: 500 |
| LeadCapture.astro | 371-372, 376-377, 405-406, 418, 433, 466-467, 483, 495-496, 544, 547, 587, 591 | font-size: 30px, 14px, 16px, 22px, 13px, 18px, 9px; font: 12px/1.4; font-weight: 700/500 |
| leadCapture2.astro | 257, 262, 267, 274, 292, 318, 334 | font-weight: 700/400; + clamp(18px…), clamp(8px…) для font-size |
| AdSocialBanner.astro | — | только font-weight в других блоках через глобал |
| CasesSlider.astro | 154-155, 206-207, 271, 284, 294, 305 | font-size: 32px, 16px, 28px, 14px, 24px; font-weight: 700, 600 |
| courseCardsnew.astro | 194, 251, 260, 306-307, 329, 346, 425 | font-weight: 600/700/400; font-size: 18px, 24px |
| KursiHero.astro | 93 | font-weight: 700 |
| KursiFormat.astro | 196, 247, 309 | font-weight: 500/700; font-size: 22px |
| Faq.astro | 119, 167, 185, 189 | font: 700 20px/1.3, 500 16px/1.5; font-size: 18px, 16px |
| typeChoose.astro | 153, 169, 180, 189, 198 | font-weight: 800, 400 |
| UnisMarquee.astro | 132 | font-weight: 700 |

### Компоненты stepik
| Файл | Строка | Что захардкожено |
|------|--------|------------------|
| PaymentPopup.astro | 204, 244, 274 | font-size: 16px, 14px, 13px |
| PlatformSlider.astro | 99, 104, 116 | font-size: 28px, 16px, 18px |
| CourseOffer.astro | 298, 346, 354, 384, 389, 398, 419, 422, 446, 456, 479, 520, 525, 538, 542, 549-550, 572-573, 607, 610, 613, 616, 630, 660, 665, 669, 672, 676 | множество font-size в px (16, 14, 20, 34, 18, 13, 28, 24, 26) и font: с px |
| CourseWhy.astro | 299, 349, 356, 398, 403, 430, 462, 466, 473, 492, 496, 506, 510, 513 | font: с var и с 24px; font-size: 28px, 24px, 16px, 18px, 22px |
| MegaSection.astro | 498, 575, 579, 584, 655, 699, 704, 712, 814, 827 | font: с var(--h2)/--h3/--text/--lead и с 15px |
| PriceBlock.astro | 143-144, 148-149, 161-162, 167, 170, 185, 188, 191, 194, 212, 215, 218, 221, 230, 233, 237 | font-size: 72px, 28px, 24px, 64px, 26px, 22px, 20px, 56px, 48px, 16px; font-weight: 800, 600, 500 |
| ReviewsSection.astro | 294, 336, 357, 362, 383, 387, 474, 478, 491, 494, 512, 515, 519, 523, 538, 542, 557, 577, 596, 626, 662-663 | font-size в px (14, 13, 16, 28, 26, 24, 40); font: с 16px, 32px, 14px |
| SupportSection.astro | 224, 249, 254, 259, 283, 288, 335, 346, 349, 354, 357, 369, 373, 376, 380, 383 | font: с var и с 18px, 16px, 26px; font-size: 20px, 28px, 18px, 16px, 22px, 24px, 15px |
| stepikHero.astro | 164, 228, 231 | font: 500 14px/1, 600 var(--h3), 500 var(--text) |
| SkillsGrid.astro | 33, 46, 60, 70, 76 | font: 700 var(--h2), 500 18px/1.5; font-size: 28px, 16px, 24px |
| ModulesSlider.astro | 81, 121, 126, 134 | font: 700 var(--h2); font-size: 18px, 20px; font-weight: 500 |

### Компоненты cards
| Файл | Строка | Что захардкожено |
|------|--------|------------------|
| caseCard.astro | 138, 157-158, 169-170, 189, 199, 315 | font-weight: 500, 400, 600; font-size: 15px, 18px; font: 600 16px/1 var(--ff) |
| cardNew.astro | 107, 116, 131, 135, 144 | font-size: clamp(18px…), clamp(14px…), clamp(10px…) — не var(--text)/--h3 |
| CardHorizontal.astro | 110, 119, 129, 145 | font-size: clamp(18px…), clamp(14px…), clamp(10px…) |

### Компоненты mdx
| Файл | Строка | Что захардкожено |
|------|--------|------------------|
| PicButtonText.astro | 121 | font-weight: 800 |
| Quote.astro | 62, 111 | font-weight: 700, 600; font-size: clamp(24px…), clamp(8px…), clamp(10px…), clamp(8px…) |
| Accordion.astro | 39, 57-58, 82 | font-weight: 600, 400; font-size: 34px, 14px |
| Banner.astro | 85, 117, 121, 125 | font-weight: 700; font-size: 20px, 14px |
| FAQ.astro | 64, 89, 129, 135, 145 | font-weight: 600, 700; font-size: 14px |
| Table.astro | 55, 93, 96 | font-weight: 600; font-size: 10px |
| EgeCalculator.astro | 67, 74, 82-83, 93, 97 | font-size: 14px, 13px; font-weight: 600; + inline style 18px, 12px в JS |
| TestComponent.astro | 122, 221, 248, 299 | font-weight: 600; font-size: 14px |
| TestSlider.astro | 59-60 | font-size: 14px; font-weight: 500 |
| MultiAnswer.astro, OneAnswer.astro | 94, 156, 181 | font-weight: 600 |

### Остальные компоненты
| Файл | Строка | Что захардкожено |
|------|--------|------------------|
| SiteFooter.astro | 190-191, 197, 201, 217, 226, 234, 244, 253, 260-261 | font-weight: 800, 700, 600; font-size: 22px, 16px, 14px |
| UnifiedMenu.astro | 608-609, 628, 687, 705-706, 711-712, 717, 746-747, 754-755, 855-856, 877-878, 886, 907-908, 940-941, 946, 967-968, 1001-1002 | много font-size: 16px, 12px, 14px; font-weight: 500, 600 |
| CopyLinkButton.astro | 53 | font-size: 14px |
| Breadcrumbs.astro | 127, 203 | font-size: 12px, 15px |
| HeroCourses.astro | 110, 198-199, 204-205, 211-212, 218-219, 223, 240-241, 246, 251, 342, 346, 350, 354, 366, 370, 374 | font-weight: 700, 600, 500, 800; font-size: 24px, 18px, 54px, 32px, 36px, 14px |
| text/h2zag.astro | 24, 30 | font-weight: 700, 400 |
| PlainSlot.astro | 114, 123, 166, 218, 221 | font-weight: 600; font-size: 16px, 15px, 12px, 13px |
| TableOfContents.astro | 82 | font-weight: 600 |
| Pagination.astro | 91, 116, 130, 145 | font-weight: 600; font-size: 14px, 13px, 12px |
| PopupForm.astro | 197, 206-207, 218, 224, 237, 249, 275, 284, 312 | font-size: 22px, 20px, 14px, 16px, 12px, 13px, 18px; font-weight: 700, 600 |
| CatBadge.astro | 67, 77, 103, 107, 114, 118, 125 | font-weight: 600; font-size: 12px, 14px, 11px, 13px, 10px, 9px |

### Layouts
| Файл | Строка | Что захардкожено |
|------|--------|------------------|
| ArticleLayoutNew.astro | 440, 466, 486, 497, 542, 599, 628, 666 | font-weight: 700, 400, 600; + много clamp() для font-size (13px, 28px, 15px, 12px, 18px, 16px, 20px и т.д.) |

### Страницы (pages)
| Файл | Строка | Что захардкожено |
|------|--------|------------------|
| privacy.astro | 280, 286, 290, 304, 329, 332, 337 | font-weight: 700; font-size: 20px, 16px, 28px, 20px, 14px |
| payment.astro | 122, 128, 132, 157, 182, 185, 190 | то же |
| agreement.astro | 146, 152, 156, 181, 205, 208, 213 | то же |
| marketing-consent.astro | 166, 172, 176, 201, 225, 228, 233 | то же + clamp(24px…), clamp(18px…) |
| thank-you.astro | 106, 112, 114, 119, 135, 154-155, 172, 208 | font-size: 40px, 32px, 18px, 20px, 14px, 28px; font-weight: 700, 600 |
| refer.astro | 198, 250, 257 | font-weight: 700; font: 600 14px/1.2; font-size: 16px |
| media/index.astro | 440 | font-weight: 700 |
| media/tags/[tag].astro | 170-171, 189-190 | font-weight: 700; font-size: 32px |
| media/search.astro | 288 | font-weight: 600 |
| media/category/[category].astro | 157-158, 176-177 | font-weight: 700; font-size: 32px |
| media/articles/index.astro | 339-340, 346, 384, 390, 431, 469, 472, 491, 494, 497 | font-weight: 700, 600; font-size: 64px, 24px, 14px, 48px, 22px, 32px, 18px, 20px |

### global_lend.css (не определение токенов)
| Строка | Что захардкожено |
|--------|------------------|
| 137, 145, 152, 157, 164 | font-weight в .h1, .h2, .h3, .lead, .text |
| 182-183, 236, 244, 252, 260, 268, 278, 302 | font-weight, font-size: 16px в кнопках/карточках |
| 386, 407 | font-weight: 700; font-size: 13px |
| 227, 234, 238, 242, 246, 250, 254, 258, 262, 266, 270, 275 | clamp() для заголовков и отступов (можно считать расширением типографики) |

---

## 2. Цвета (color, background, border — hex, rgb, rgba)

### Компоненты mainpage
**Исправлено:** цвета заменены на переменные `:root` (var(--white), var(--black), var(--bg), var(--gray), var(--green), var(--border), var(--blue), var(--overlay)) в: AboutSection, AuthorSection, LeadCapture, AdSocialBanner, AdFreeBanner, CasesSlider, Faq, KursiFormat, KursiHero, UnisMarquee. Оставлены без замены (нет токена): LeadCapture — #ef4444. Оверлей заменён на var(--overlay).

### Компоненты stepik
**Исправлено:** заменены на переменные в PaymentPopup, PlatformSlider, CourseWhy, SkillsGrid, SupportSection, stepikHero, PriceBlock, MegaSection, ReviewsSection, CourseOffer, ModulesSlider (var(--white), var(--black), var(--gray), var(--border), var(--blue), var(--bg), var(--coral), var(--overlay)). Оверлеи и коралловый CTA/спиннер — var(--overlay), var(--coral).

**Нет близкого токена (оставлено как есть):**
- **CourseOffer.astro:** `#ffed4e` (жёлтый), `#e3edfb` (светлая граница), `rgba(255,255,255,0.9/0.7/0.15/0.6)`, `rgba(255,107,53,0.4/0.6)` — полупрозрачные значения и акценты.
- **MegaSection.astro:** `#f7f7f9`, `#bbb`, `#e2e8f0`, `#cbd5e1` (светло-серые/слейт фоны).
- **ReviewsSection.astro:** `#ffd700` (золотой звёзды/акцент) — хардкод допустим, используется только здесь.
- **ModulesSlider.astro:** `#e2e8f0`, `#cbd5e1` (слейт фоны кнопок слайдера) — хардкод допустим.

### Компоненты cards
**Исправлено:** заменены на переменные в cardNew, CardHorizontal, cursCard (var(--gray), var(--green)); дефолтный цвет категории в JS — #366ef0 (--blue); оверлей в caseCard — var(--overlay).

**Оставлено без замены (нет токена):** caseCard.astro — `rgba(255,255,255,0.9)` (фон кнопки «Закрыть»), `box-shadow: 0 10px 30px rgba(0,0,0,0.5)`.

### Компоненты mdx
**Исправлено:** везде, где был подходящий токен, заменено на переменные: VideoTabs (border, color), PicButtonText (--blue, --white), Quote (--blue, --black, --white, --gray), Accordion (--border, --white, --black, --gray), Table (--white, --black, --border), FAQ (--border, --white, --black, --blue, --gray), EgeCalculator (--border, --blue, --gray), Banner (--gray), MultiAnswer/OneAnswer/TestComponent (--white, --border, --black, --blue, --gray, --green, --error).

**Оставлено без замены (нет подходящего токена):**
- Светлые фоны: `#f9f9f9`, `#f5f5f5`, `#f9fafb`, `#f3f4f6`, `#f0f7ff`, `#e6f2ff` — в Table, Accordion, FAQ, VideoTabs, тестах. **Опционально:** можно добавить в `:root` один токен `--bg-subtle: #f5f5f5` и заменить эти значения для единообразия (не обязательно).
- Конфиг тем в Banner.astro (JS): `#e6f2ff`, `#b3d9ff` и т.д. — задаются через inline style, оставлены как есть.
- Полупрозрачные: `rgba(255,255,255,0.9)` в PicButtonText; тени и `rgba(54,110,240,…)` — без токенов.
- EgeCalculator: inline-стили в JS (#ef4444, #fef2f2 и т.д.) — при желании можно подставлять hex из --error.

### Остальные компоненты
**Исправлено:** заменены на переменные в SiteFooter (--black, --white), UnifiedMenu (--black, --white, --gray, --blue, --border), ui/SupportFab, ui/ScrollToTop (--white, --black), Breadcrumbs (--gray, --blue), article/TableOfContents (--white, --blue), Pagination (--white, --black, --blue, --border), PopupForm (--white, --border, --green, --error, --black), slots/PlainSlot, CalcSlot, TgChecker (--white, --black, --gray).

**Оставлено без замены (нет токена / особый случай):**
- SiteFooter: `rgba(163,165,167,0.9)` — приглушённый серый текст.
- UnifiedMenu: `#f4f4f4`, `#f8f9fa` (светлые фоны), `rgba(0,0,0,0.35)` (оверлей меню).
- article/ProgressBar: `rgba(0,0,0,0.05)`, градиент с #0d6efd/#6ea8fe.
- PopupForm: светлые фоны `#f8fafc`, `#eef2ff`, `#fbfbfd`.
- slots: `#f9f9f9`, `#f2f4f7`; TgChecker — inline `color:#c0392b` в JS; PlainSlot — `rgba(17,17,17,0.6)`.

### Layouts
**Исправлено:** ArticleLayoutNew.astro — `color: #666` → `var(--gray)`.

**Оставлено без замены:** `background-color: #e3fdff`, `#f0f0f0` — нет подходящего токена для светлого циан/серого фона. MainLayout: `theme-color` в meta — литерал #366ef0 (соответствует --blue), можно оставить.

### Страницы (pages)
**Исправлено:** privacy, payment, agreement, marketing-consent — `#222` → `var(--black)`; refer — `#fff` → `var(--white)`; 404 — `#555` → `var(--gray)`; media/tags/[tag], media/category/[category] — `#929292` → `var(--gray)`; media/search — `#fff`, `#111`, `#666`, `#555`, `#444`, границы и `#1a73e8` → `var(--white)`, `var(--black)`, `var(--gray)`, `var(--border)`, `var(--blue)`; media/articles/index — `#111`, `#222`, `#555`, `#fff`, `#0d6efd`, границы → `var(--black)`, `var(--gray)`, `var(--white)`, `var(--blue)`, `var(--border)`.

**Не трогаем:** thank-you.astro — по запросу не изменяли.

**Оставлено без замены:** refer — `#f9f9f9`; media/search, media/articles/index — светлые фоны `#f7f9fc`, `#f0f2f5`, `#f7f7f9`, `#fefefe`; rgba и outline в media.

### global_lend.css (использование литер, не определение :root)
| Строка | Значение |
|--------|----------|
| 193, 197, 200 | color/background: #fff в .btn |
| 229, 286, 292-293, 320, 323, 330-331, 339-340, 370, 387, 392 | color/background в типографике, code, pre, ссылках |

---

## 3. Рекомендации

- **Шрифты:** где по смыслу подходят «заголовок» / «лид» / «основной текст», заменить `font-size: Npx` и `font: … Npx …` на `font-size: var(--h1)` / `var(--h2)` / `var(--h3)` / `var(--lead)` / `var(--text)`. `font-weight` можно оставить числами или ввести токены (например `--fw-500`, `--fw-700`), если нужна единая палитра.
- **Цвета:** заменить повторяющиеся hex/rgba на переменные: например `#366ef0` → `var(--blue)`, `#111`/`#222` → `var(--black)`, `#fff` → `var(--white)`, `#666`/`#888` → `var(--gray)`, тёмный оверлей → `var(--overlay)`, коралловый CTA → `var(--coral)`.
- **Фоны и границы:** те же подстановки (`--white`, `--border`, `--blue`, `--overlay` и т.д.), при необходимости добавить в глобал токены вроде `--bg-soft`, `--border-subtle`.

Файл можно использовать как чек-лист для поочерёдной замены захардкоженных значений на глобальные переменные.
