# Отчёт: захардкоженные шрифты и цвета в компонентах

Ниже перечислены все места, где заданы **жёстко прописанные** значения шрифтов (font-size в px, шорткат `font:` с числами) и цвета (hex, rgb, rgba) вместо переменных из глобала (`--ff`, `--h1`–`--h4`, `--lead`, `--text`, `--blue`, `--black`, `--white`, `--gray`, `--border` и т.д.).

**Глобальные токены (использовать вместо литер):**
- Шрифты: `--ff`, `--h1`, `--h2`, `--h3`, `--h4`, `--lead`, `--text`
- Цвета: `--blue` (#366ef0), `--black` (#111), `--white` (#fff), `--gray` (#888), `--border` (#dfdfdf), `--orange`, `--bg`

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
| Quote.astro | 62, 111 | font-weight: 700, 600; font-size: clamp(24spx…), clamp(8px…), clamp(10px…), clamp(8px…) |
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
| Файл | Строка | Значение |
|------|--------|----------|
| AboutSection.astro | 94, 168, 169, 181, 208, 220, 247, 293, 294, 315, 347 | #fff, #000, #eaf0ff |
| AuthorSection.astro | 209, 218 | color: #222; color: #fff |
| LeadCapture.astro | 382, 390, 394, 408, 422, 425, 434, 447, 470, 473, 480, 497 | #fff, #eaf1ff, #9ba3af, #b8caff, #10b981, #ef4444, #e6f0ff; background: #ddd, #fff, rgba(0,0,0,0.8) |
| AdSocialBanner.astro | 104, 119 | color: #fff |
| AdFreeBanner.astro | 101, 117, 123 | color: #fff |
| CasesSlider.astro | 158, 204 | color: #111, #fff |
| Faq.astro | 154 | color: #fff |
| KursiFormat.astro | 173 | color: #fff |
| KursiHero.astro | 104, 125 | background: #fff, #ddd |

### Компоненты stepik
| Файл | Строка | Значение |
|------|--------|----------|
| PaymentPopup.astro | 149, 155, 188, 195, 205 | background: rgba(0,0,0,0.7), #fff; border: #f3f3f3; color: #666 |
| PlatformSlider.astro | 78, 79, 106, 118, 119, 123 | background: #fff, #e5e7eb, #d1d5db; color: #374151, #111827; border: #e5e7eb |
| CourseOffer.astro | 363, 386, 391, 399, 447, 517, 522, 527, 539, 544, 548, 570, 579 | color: #fff, rgba(255,255,255,0.9/0.7), #ff725e, #ffed4e; background: #ff6b35, #ff8c42, #fff; border: #ff8c42, #e3edfb |
| CourseWhy.astro | 300, 351, 357, 391, 400, 405 | color: #000, #222, #fff |
| MegaSection.astro | 499, 512, 557, 604, 611, 656, 662, 684, 744, 754, 815, 829 | color: #fff; background: #f7f7f9, #fff, #bbb, #3390ff, #e2e8f0, #cbd5e1 |
| PriceBlock.astro | 145, 150, 163, 168 | color: #222, #555, #444 |
| ReviewsSection.astro | 351, 359, 363, 384, 388, 576, 585, 592, 613, 625, 634-635, 661, 669 | color: #fff, #ffd700, #333, #ddd; background: #fff; border: #fff, #ffd700 |
| SkillsGrid.astro | 34, 47 | color: #fff, #222; background: #fff |
| SupportSection.astro | 260, 275, 285, 290 | color: #222, #fff |
| stepikHero.astro | 225 | color: #eaf0ff |
| ModulesSlider.astro | 82, 88, 106, 127, 135, 153, 162 | color: #fff, #191c21, #222; background: #fff, #e2e8f0, #cbd5e1 |

### Компоненты cards
| Файл | Строка | Значение |
|------|--------|----------|
| caseCard.astro | 283, 316 | background: rgba(0,0,0,0.8), rgba(255,255,255,0.9) |
| cardNew.astro | 117, 132, 145 | color: #666 |
| CardHorizontal.astro | 120, 146 | color: #666 |
| cursCard.astro | 149 | color: #b9f81a |

### Компоненты mdx
| Файл | Строка | Значение |
|------|--------|----------|
| VideoTabs.astro | 130, 132, 138-139, 141, 147-148 | border: #ccc; background-color: #f9f9f9; color: #000 |
| PicButtonText.astro | 68, 122, 126 | background-color: #366ef0; color: #ffffff, rgba(255,255,255,0.9) |
| Quote.astro | 63, 72, 99, 113, 118 | color: #366ef0, #222, #111, #666; border: #fff |
| Accordion.astro | 25, 41, 43, 66, 83 | background: #fff, #f9fafb, #f3f4f6; color: #111, #374151 |
| EgeCalculator.astro | 47, 72, 85, 96, 803, 810 | border: #e5e7eb, #d1d5db; background: #366ef0; color: #666; inline #ef4444 в JS |
| TestComponent.astro | 98, 123, 139, 147, 148, 152-153, 160, 166, 181, 182, 192, 196-197, 201-202, 215-216, 229, 242, 256, 270, 271, 275, 280-281, 285 | много #111, #333, #444, #999, #fff, #366ef0, #b3d9ff, #2aa5a1, #c05b66 и фоны |
| Table.astro | 31, 39, 54, 56, 62, 73 | background: #fff, #f5f5f5, #f9f9f9, #f0f7ff; color: #111 |
| MultiAnswer.astro, OneAnswer.astro | 68, 95, 111, 119-120, 124-125, 132, 138, 150, 151, 163, 175, 182, 189, 196, 203-204, 208, 213-214, 218 | те же паттерны: #111, #333, #366ef0, #b3d9ff, #fff, #e6f2ff, #2aa5a1, #c05b66 |
| FAQ.astro | 45, 47, 66, 67, 72, 86, 87, 111 | border: #e5e5e5; background: #fff, #f9f9f9, #f0f7ff, #366ef0; color: #111, #fff, #444 |
| Banner.astro | 22, 28, 34, 40, 92 | border: "#b3d9ff", "#ffe0b3", "#b3eceb", "#ffb3bd"; color: #333 |

### Остальные компоненты
| Файл | Строка | Значение |
|------|--------|----------|
| SiteFooter.astro | 158, 159, 203, 207, 215, 227, 232, 242, 287, 286 | background: #000, #0060f7; color: #fff, rgba(163,165,167,0.9); border: #fff, #0060f7 |
| UnifiedMenu.astro | 582, 600, 615, 668, 707, 718, 748, 751-752, 756, 762, 779, 788, 810, 831, 854, 861, 879, 909, 929, 935, 947, 969, 988, 998, 999, 1010, 1041 | color: #111, #3376e0, #666, #fff; background: #fff, #f4f4f4, #f8f9fa, #3376e0, #2352b9, rgba(0,0,0,0.35); border: #eee, #e9ecef, #3376e0 |
| ui/SupportFab.astro | 139, 194-195 | color: #fff, #111; background: #ffffff |
| ui/ScrollToTop.astro | 23 | color: #fff |
| Breadcrumbs.astro | 128, 145, 150, 156, 165, 172, 177 | color: #888, #666, #0d6efd, #333, #999 |
| article/TableOfContents.astro | 75, 102, 107 | background: #ffffff; color: #0d6efd, #0a58ca |
| article/ProgressBar.astro | 23 | background: rgba(0,0,0,0.05) |
| Pagination.astro | 88, 89, 97, 101-103 | background: #fff, #f7f9fc, #0d6efd; color: #111, #fff; border: #d0d7de, #0d6efd |
| PopupForm.astro | 179, 196, 202, 227, 246, 287, 290, 296, 297 | background: #fff, #f8fafc, #eef2ff, #fbfbfd, #0b1020; color: #0a7f35, #b91c1c, #e6f0ff; border: #e5e7eb |
| slots/PlainSlot.astro | 126, 137, 205, 215, 222 | background: #f9f9f9, #fff, #f2f4f7; color: #fff, rgba(17,17,17,0.6) |
| slots/TgChecker.astro | 55, 75, 87, 125, 132 | inline style color:#c0392b; background: #f9f9f9, #fff |
| slots/CalcSlot.astro | 85, 93, 116, 127-128 | background: #f9f9f9, #fff, #333; color: #888, #fff |

### Layouts
| Файл | Строка | Значение |
|------|--------|----------|
| ArticleLayoutNew.astro | 479, 556, 580, 675 | background-color: #e3fdff, #f0f0f0; color: #666 |

### Страницы (pages)
| Файл | Строка | Значение |
|------|--------|----------|
| privacy.astro | 266 | color: #222 |
| payment.astro | 108 | color: #222 |
| agreement.astro | 132 | color: #222 |
| marketing-consent.astro | 152 | color: #222 |
| thank-you.astro | 111, 118, 133, 142, 187, 199, 261, 269 | color: #1f2937, #6b7280, #4b5563, #374151, #3b82f6; background: #10b981, #f8fafc, #3b82f6, #2563eb, #f3f4f6, #e5e7eb |
| refer.astro | 259, 264 | background: #f9f9f9, #fff |
| 404.astro | 48 | color: #555 |
| media/tags/[tag].astro | 169 | color: #929292 |
| media/search.astro | 198, 200, 208, 230, 247, 269, 281, 289, 295, 313, 316, 326 | border: #d0d7de, #1a73e8; background: #fff, #f7f9fc, #f0f2f5, #f7f7f9; color: #666, #111, #555, #444 |
| media/category/[category].astro | 156 | color: #929292 |
| media/articles/index.astro | 342, 347, 361, 385, 393, 428, 429, 434, 437, 438-439, 451, 452, 464 | color: #111, #222, #555; background: #fff, #f7f9fc, #0d6efd, #fefefe; border: #d8dee4, #d0d7de, #0d6efd, #222 |

### global_lend.css (использование литер, не определение :root)
| Строка | Значение |
|--------|----------|
| 193, 197, 200 | color/background: #fff в .btn |
| 229, 286, 292-293, 320, 323, 330-331, 339-340, 370, 387, 392 | color/background в типографике, code, pre, ссылках |

---

## 3. Рекомендации

- **Шрифты:** где по смыслу подходят «заголовок» / «лид» / «основной текст», заменить `font-size: Npx` и `font: … Npx …` на `font-size: var(--h1)` / `var(--h2)` / `var(--h3)` / `var(--lead)` / `var(--text)`. `font-weight` можно оставить числами или ввести токены (например `--fw-500`, `--fw-700`), если нужна единая палитра.
- **Цвета:** заменить повторяющиеся hex/rgba на переменные: например `#366ef0` → `var(--blue)`, `#111`/`#222` → `var(--black)` или добавить `--black-soft: #222`, `#fff` → `var(--white)`, `#666`/`#888` → `var(--gray)` или расширить палитру серых в :root.
- **Фоны и границы:** те же подстановки (`--white`, `--border`, `--blue` и т.д.), при необходимости добавить в глобал токены вроде `--bg-soft`, `--border-subtle` и использовать их в компонентах вместо литер.

Файл можно использовать как чек-лист для поочерёдной замены захардкоженных значений на глобальные переменные.
