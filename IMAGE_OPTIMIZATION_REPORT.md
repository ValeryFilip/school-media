# Анализ изображений в public/ — что оптимизировать

## Cleanup (уже сделано)

- **Удалены дубликаты:** `mainpage/oge - копия.png`, папка `stepik/reviews/png/`, `stepik/reviews/Screenshot_12.png`
- **Удалены неиспользуемые:** `girl-lead1.webp`, `articles/nomenklatura/complex-salt.jpg`, `articles/videos/nazvaniya.jpeg`, `stepen.jpeg`, `mainpage/topimage.png`, `mainpage/social-assets/social.png`, `mycollection/002-up-right-arrow.png`, `003-diagonal-arrow.png`, `stepik/atom.webp`, `laboratory.webp`, `paper-bg.webp`, `technical/instagram.png`, `logo2.png`, `logo3.png`, `uni/Document.webp`, `flasks/CH-PHSTRIP_Web__52297.jpg`, четыре файла `flasks/20161004*.png`
- В коде: `courseCardsnew.astro` — путь `10klass.png` заменён на `10kl.png`

## Статьи — обложки переведены на WebP (уже сделано)

- **Обложки статей** в `images/articles/`: PNG конвертированы в WebP (classif, nomenklatura, podgotovka, raspisanie, shkala, shkola-i-ege, stepen, stress-na-ege). В MDX во всех статьях в `image` и `heroImage` стоят пути на `.webp`. Старые PNG удалены.
- **Видео-превью** в `images/articles/videos/` (7-zadanie, donor, gidroliz, rastvor, vodorod) оставлены в **JPEG** — не конвертировались, в статьях ссылки на `.jpeg`.

## Баннер и фото отзывов на главной (уже сделано)

- **Баннер:** добавлен `images/banner-pic.webp`. В коде во всех статьях (PicButtonText) путь заменён с `banner-pic.png` на `banner-pic.webp`.
- **Фото в отзывах на главной:** добавлены `images/mainpage/reviews/liza-photo.webp` и `veronika-photo.webp`. В `src/pages/index.astro` для отзывов Вероники и Лизы пути обновлены с `.jpg` на `.webp`.
- **Adfree:** добавлен сжатый `images/mainpage/adfree.webp`. В коде пути заменены с `adfree.png` на `adfree.webp` в `index.astro`, `media/index.astro`, `allcourses.astro`, `AdFreeBanner.astro`.
- **404 и главная:** сжаты и заменены пути на WebP: `technical/404.webp` (404.astro), `mainpage/heroleft.webp`, `heroright.webp`, `photo-last.webp`, `social.webp` (index.astro, KursiHero.astro, AdSocialBanner.astro).

**Что осталось в репозитории** — только используемые файлы; список ниже актуален после cleanup и перевода статей на WebP.

---

## Точно надо менять и сжимать

Картинки, которые **ещё ссылаются в коде** и при этом тяжёлые или в формате PNG/JPEG — их стоит сжать и при необходимости заменить на WebP, затем обновить пути в коде.

| Файл                                                              | Размер       | Где в коде                                                                  | Действие                              |
| ----------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------- | ------------------------------------- |
| `images/chemistry.png`                                            | **~2.4 MB**  | В коде уже `chemistry.webp` (ArticleLayoutNew)                              | Удалить PNG с диска — не используется |
| `images/banner-pic.png`                                           | **~2.4 MB**  | В коде уже `banner-pic.webp`                                                | Удалить PNG с диска                   |
| `images/1234.jpg`                                                 | **~1.27 MB** | В коде уже `1234.webp`                                                      | Удалить JPG с диска                   |
| `images/girl-lead.webp`                                           | **~1.45 MB** | В коде уже `girl-lead1.webp`                                                | Удалить старый webp с диска           |
| `images/mainpage/reviews/liza-photo.jpg`                          | **~1.84 MB** | В коде уже `liza-photo.webp`                                                | Удалить JPG с диска                   |
| `images/mainpage/adfree.png`                                      | **~673 KB**  | В коде уже `adfree.webp`                                                    | Удалить PNG с диска                   |
| `images/mainpage/reviews/veronika-photo.jpg`                      | **~632 KB**  | В коде уже `veronika-photo.webp`                                            | Удалить JPG с диска                   |
| ~~**Главная**~~                                                   | —            | **Готово:** heroleft, heroright, photo-last, social → .webp, пути обновлены |
| **Фласки / allcourses**                                           |
| `images/flasks/CE-FLAISET__44996.png`                             | **~1.05 MB** | allcourses.astro                                                            | WebP → заменить пути в allcourses     |
| `images/flasks/CE-SEPF250_1__97109.png`                           | **~714 KB**  | allcourses.astro                                                            | То же                                 |
| `images/flasks/CE-BEISET__57187.png`                              | **~626 KB**  | allcourses.astro                                                            | То же                                 |
| `images/flasks/ce-fdis250_1__98982.png`                           | **~530 KB**  | allcourses.astro                                                            | То же                                 |
| ~~`images/technical/404.png`~~                                    | —            | **Готово:** заменён на 404.webp, путь в 404.astro обновлён                  |
| **Отзывы на главной (в коде всё ещё .jpg/.png)**                  |
| `images/mainpage/reviews/maks-photo.jpg`, maks1.jpg, maks2.png    | разное       | index.astro                                                                 | Сжать или WebP, обновить пути         |
| `images/mainpage/reviews/nika-photo.jpg`, nika1.jpg, nika2.png    | разное       | index.astro                                                                 | То же                                 |
| `images/mainpage/reviews/david-photo.jpg`, david1.png, david2.jpg | разное       | index.astro                                                                 | То же                                 |
| `images/mainpage/reviews/anna-photo.jpg`, anna1.jpg, anna2.png    | разное       | index.astro                                                                 | То же                                 |
| `images/mainpage/reviews/anya-photo.jpg`, anya1.png, anya2.png    | разное       | index.astro                                                                 | То же                                 |
| `images/mainpage/reviews/veronika1.jpg`, veronika2.png            | разное       | index.astro                                                                 | То же                                 |
| `images/mainpage/reviews/liza1.jpg`, liza2.png                    | разное       | index.astro                                                                 | То же                                 |

**Примечание:** компонент `KursiFormat.astro` нигде не используется (не импортируется). В нём по умолчанию указан несуществующий `topimage.png` — можно не трогать или при необходимости поменять default на существующий файл.

---

## Критерии

- **Обязательно** — > 1 MB или тяжёлый PNG
- **Желательно** — 500 KB–1 MB
- **По возможности** — средние JPEG/PNG, SVG

---

## Обязательно уменьшить/оптимизировать

| Файл                                     | Размер                | Действие                                      |
| ---------------------------------------- | --------------------- | --------------------------------------------- |
| `images/1234.jpg`                        | **1.27 MB**           | WebP или JPEG quality 80–85                   |
| `images/1234.webp`                       | **930 KB**            | Уменьшить качество/разрешение                 |
| `images/girl-lead.webp`                  | **1.45 MB**           | Уменьшить качество/разрешение                 |
| ~~`images/articles/*.png`~~              | —                     | **Готово:** заменены на WebP, PNG удалены     |
| `images/articles/videos/*.jpeg`          | ~115–195 KB каждый    | По желанию: можно конвертировать в WebP позже |
| `images/mainpage/reviews/anya-photo.jpg` | **379 KB**            | Уменьшить до ~100–150 KB                      |
| `images/mainpage/reviews/david1.png`     | **244 KB**            | Конвертировать в WebP                         |
| `images/mainpage/reviews/liza1.jpg`      | **365 KB**            | Сжать                                         |
| `images/mainpage/reviews/veronika2.png`  | **173 KB**            | WebP                                          |
| `images/mainpage/reviews/nika2.png`      | **276 KB**            | WebP                                          |
| `images/stepik/hero-image-neorg.webp`    | **317 KB**            | Уменьшить качество WebP                       |
| `images/stepik/gifs/*.webm`              | **1.2–1.7 MB каждый** | Пережать (меньший битрейт), всего ~8.4 MB     |
| `images/technical/404.png`               | **320 KB**            | WebP или сжатый PNG                           |
| `images/uni/gorniy.webp`                 | **357 KB**            | Уменьшить качество                            |
| `images/uni/Spbgu.webp`                  | **192 KB**            | По желанию                                    |
| `images/uni/almazova.webp`               | **169 KB**            | По желанию                                    |
| `images/uni/mechnikova.webp`             | **155 KB**            | По желанию                                    |

---

## Желательно оптимизировать

- Крупные PNG на главной: `10kl.png`, `ege.png`, `oge.png`, `chemistry.png` (banner-pic и adfree уже WebP).
- Оставшиеся фото в `mainpage/reviews/` (anya-photo, david, nika, anna и др. — liza и veronika уже в WebP).
- WebM в `stepik/gifs/` — пережать с меньшим битрейтом.
- По желанию: превью видео в `images/articles/videos/*.jpeg` → WebP (сейчас оставлены JPEG).

---

## SVG

| Файл                           | Действие                                            |
| ------------------------------ | --------------------------------------------------- |
| `favicon.svg` (в корне public) | Минифицировать (SVGO) — сократить размер в 2–5 раз. |
| `images/logo_media.svg`        | Оставить как есть (используется в меню).            |

---

## Файлы, на которые есть ссылки в коде, но которых нет в public

Имеет смысл добавить или заменить пути в коде:

- **`/images/og/refers.jpg`**, **`/images/og/courses.jpg`**, **`/images/og/egecourse-hero.jpg`** — папка `images/og/` отсутствует (refer.astro, allcourses.astro, index.astro).
- **`/images/placeholder.svg`**, **`/images/placeholder.jpg`** — используются в media/search и карточках как fallback.
- **`/images/mainpage/inorg-hero.png`** — используется в stepikHero.astro; в репозитории его нет (можно заменить на существующий `stepik/hero-image-neorg.webp` или добавить файл).

---

## Рекомендуемый порядок работ

1. ~~**Статьи (обложки)**~~ — **сделано:** PNG заменены на WebP, ссылки в MDX обновлены.
2. ~~**Баннер и фото отзывов (liza, veronika)**~~ — **сделано:** добавлены WebP, пути в коде обновлены.
3. **Главная** — `ege.png`, `oge.png`, `10kl.png`, `chemistry.png` → WebP + уменьшение (adfree уже заменён на WebP).
4. **Остальные фото отзывов** — anya, david, nika, anna и др.: уменьшить разрешение и качество (800–1200px, quality 80–85).
5. **Favicon** — прогнать через SVGO.
6. **WebM** в `stepik/gifs/` — пережать с меньшим битрейтом (например ffmpeg `-b:v 800k`).
7. **technical/404.png** — WebP или сжатый PNG.

---

## Инструменты

- **PNG/JPEG → WebP:** Sharp (уже в проекте), [squoosh.app](https://squoosh.app), или `npx sharp-cli`.
- **SVG:** `npx svgo favicon.svg -o favicon.min.svg`.
- **WebM:** `ffmpeg -i input.webm -b:v 800k output.webm`.

После оптимизации проверить, что в коде используются нужные файлы и при необходимости обновить пути на `.webp`.asd
