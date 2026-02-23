# Где задаётся шрифт (font-family / font)

В глобале (`src/styles/global_lend.css`) на **html** заданы:

- `font-family: var(--ff);` (Raleway + fallback)
- `font-variant-numeric: lining-nums;` (чтобы цифры не скакали в Raleway)

Ниже — все места в компонентах и страницах, где снова задаётся шрифт. Если указан не `var(--ff)` и не `inherit`, глобальный шрифт и `font-variant-numeric` там не наследуются (или переопределяются).

---

## Сводная таблица

| Файл                                                                       | Что задано                                                                                       | Риск для цифр                                                      |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **Глобал (эталон)**                                                        |                                                                                                  |                                                                    |
| `src/styles/global_lend.css`                                               | `html`: `font-family: var(--ff);` + `font-variant-numeric: lining-nums;`                         | —                                                                  |
| `src/styles/global_lend.css`                                               | `.article__content code`: `font-family: "Courier New", "Consolas", monospace;`                   | моноширинный код, по желанию можно добавить `font-variant-numeric` |
| **Переопределяют шрифт (не Raleway)**                                      |                                                                                                  |                                                                    |
| `src/components/stepik/PlatformSlider.astro`                               | `font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;`                           | да — другой стек, нет numeric                                      |
| `src/pages/thank-you.astro`                                                | `body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }`       | да — вся страница без Raleway и без numeric                        |
| `src/components/mainpage/LeadCapture.astro`                                | `font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;` (блок кода/подсказки) | моноширинный, при цифрах можно добавить numeric                    |
| `src/components/mdx/Quote.astro`                                           | `font-family: Georgia, serif;`                                                                   | да — цитаты, при цифрах в цитатах — скачок                         |
| **Используют var(--ff)** (глобал сохраняется, numeric наследуется от html) |                                                                                                  |                                                                    |
| `src/components/SiteFooter.astro`                                          | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/UnifiedMenu.astro`                                         | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/cards/caseCard.astro`                                      | `font: 600 16px/1 var(--ff) !important;`                                                         | нет                                                                |
| `src/components/mainpage/AuthorSection.astro`                              | `font-family: var(--ff);` и `font: 500 16px/1.5 var(--ff);`                                      | нет                                                                |
| `src/components/mainpage/LeadCapture.astro`                                | `font-family: var(--ff);` (в других блоках)                                                      | нет                                                                |
| `src/components/cards/CardHorizontal.astro`                                | `font: inherit;`                                                                                 | нет                                                                |
| `src/components/mdx/ADbanners/PicButtonText.astro`                         | `font-family: var(--ff, "Raleway", sans-serif);`                                                 | нет                                                                |
| `src/components/mdx/VideoTabs.astro`                                       | `font-family: var(--ff, Arial, sans-serif);`                                                     | нет (fallback Arial только если --ff нет)                          |
| `src/pages/refer.astro`                                                    | `font: 600 14px/1.2 var(--ff);`                                                                  | нет                                                                |
| `src/pages/privacy.astro`                                                  | `font-family: var(--ff, Montserrat, system-ui, ...);`                                            | нет                                                                |
| `src/pages/payment.astro`                                                  | `font-family: var(--ff, Montserrat, system-ui, ...);`                                            | нет                                                                |
| `src/pages/agreement.astro`                                                | `font-family: var(--ff, Montserrat, system-ui, ...);`                                            | нет                                                                |
| `src/pages/marketing-consent.astro`                                        | `font-family: var(--ff, Montserrat, system-ui, ...);`                                            | нет                                                                |
| `src/components/mainpage/KursiHero.astro`                                  | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/stepik/CourseOffer.astro`                                  | много `font: ... var(--ff);` и `font-family: var(--ffфяяыфвыв);`                                 | нет                                                                |
| `src/components/slots/PlainSlot.astro`                                     | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/mainpage/typeChoose.astro`                                 | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/HeroCourses.astro`                                         | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/text/h2zag.astro`                                          | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/stepik/CourseWhy.astro`                                    | `font-family: var(--ff);` и `font: ... var(--ff);`                                               | нет                                                                |
| `src/components/stepik/MegaSection.astro`                                  | `font-family: var(--ff);` и `font: ... var(--ff);`                                               | нет                                                                |
| `src/components/stepik/PriceBlock.astro`                                   | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/stepik/ReviewsSection.astro`                               | `font-family: var(--ff);` и `font: ... var(--ff);`                                               | нет                                                                |
| `src/components/stepik/SkillsGrid.astro`                                   | `font: ... var(--ff);`                                                                           | нет                                                                |
| `src/components/mainpage/Faq.astro`                                        | `font-family: var(--ff);` и `font: ... var(--ff);`                                               | нет                                                                |
| `src/components/stepik/SupportSection.astro`                               | `font-family: var(--ff);` и `font: ... var(--ff);`                                               | нет                                                                |
| `src/components/mainpage/KursiFormat.astro`                                | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/stepik/stepikHero.astro`                                   | `.stepik-hero { font-family: var(--ff); }` и `font: ... var(--ff);`                              | нет                                                                |
| `src/components/mainpage/UnisMarquee.astro`                                | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/stepik/PaymentPopup.astro`                                 | `font-family: var(--ff, -apple-system, ...);`                                                    | нет                                                                |
| `src/components/stepik/ModulesSlider.astro`                                | `font: ... var(--ff);`                                                                           | нет                                                                |
| `src/components/slots/TgChecker.astro`                                     | `font-family: var(--ff);`                                                                        | нет                                                                |
| `src/components/slots/CalcSlot.astro`                                      | `font-family: var(--ff);`                                                                        | нет                                                                |
| **Наследование**                                                           |                                                                                                  |                                                                    |
| `src/components/mdx/tests/TestComponent.astro`                             | `font-family: inherit;`                                                                          | нет                                                                |
| `src/components/mdx/tests/MultiAnswer.astro`                               | `font-family: inherit;`                                                                          | нет                                                                |
| `src/components/mdx/tests/OneAnswer.astro`                                 | `font-family: inherit;`                                                                          | нет                                                                |
| `src/pages/media/articles/index.astro`                                     | `font: inherit;` (в части блоков)                                                                | нет                                                                |
| **Остальное (только размер/жирность, шрифт не меняют)**                    |                                                                                                  |                                                                    |
| `src/components/mainpage/AboutSection.astro`                               | только `font: 700 ... var(--ff);` и т.п.                                                         | нет                                                                |

---

## Что править в первую очередь (цифры могут скакать)

1. **`src/components/stepik/PlatformSlider.astro`** (стр. ~82)  
   Сейчас: `font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;`  
   Лучше: `font-family: var(--ff);` и при необходимости `font-variant-numeric: lining-nums;`

2. **`src/pages/thank-you.astro`** (стр. ~76)  
   Сейчас: `body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }`  
   Лучше: убрать переопределение `body` или задать `font-family: var(--ff);` и `font-variant-numeric: lining-nums;`

3. **`src/components/mdx/Quote.astro`** (стр. ~66)  
   Сейчас: `font-family: Georgia, serif;`  
   Если в цитатах бывают цифры — добавить туда же: `font-variant-numeric: lining-nums;`

4. **Моноширинный код** (LeadCapture, global code)  
   При желании для блоков с цифрами можно добавить `font-variant-numeric: tabular-nums;` или `lining-nums;`.

После правок в этих местах шрифт и поведение цифр будут совпадать с глобалом.
