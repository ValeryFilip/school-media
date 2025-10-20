# 📚 Примеры использования UnifiedMenu.astro

## 🎯 Вариант 1: Медиа-меню (как Menu.astro)

```astro
---
import UnifiedMenu from "../components/UnifiedMenu.astro";
import { getCollection } from "astro:content";

// Получаем категории
const posts = await getCollection("articles");
const categories = Array.from(
  new Set(posts.map((p) => String(p.data.category || "").trim()).filter(Boolean))
);
---

<UnifiedMenu
  variant="media"
  logoSrc="/images/logo_media.svg"
  logoHref="/media/"
  navItems={[
    { label: "Главная", href: "/media/" },
    { label: "Все статьи", href: "/media/articles" },
  ]}
  ctaText="Бесплатные курсы ЕГЭ"
  ctaHref="/courses/free"
  categories={categories}
  showSearch={true}
  searchAction="/media/search"
/>
```

## 🎯 Вариант 2: Лендинг-меню (как Menu_lend.astro)

```astro
---
import UnifiedMenu from "../components/UnifiedMenu.astro";
---

<UnifiedMenu
  variant="landing"
  logoSrc="/images/logo_media.svg"
  logoAlt="ЕГЕХИМ"
  logoHref="/"
  navItems={[
    { label: "Главная", href: "/" },
    { label: "Медиа", href: "/media" },
  ]}
  dropdownLabel="Курсы"
  dropdownItems={[
    {
      label: "Самостоятельные курсы",
      href: "/allcourses",
      sub: "Идёшь в своём темпе",
    },
    { label: "Годовые курсы", href: "/", sub: "Группа и контроль" },
  ]}
  ctaText="Записаться"
  ctaHref="#signup"
  contacts={[
    {
      label: "Telegram",
      href: "https://t.me/valery_chemistry",
      imgSrc: "/images/technical/telegram.png",
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/79818364992",
      imgSrc: "/images/technical/whatsapp.png",
    },
    {
      label: "VK",
      href: "https://vk.me/valeryfilip",
      imgSrc: "/images/technical/vk.png",
    },
  ]}
  contactsLabel="Напишите нам"
  showSearch={false}
/>
```

## 🔧 Вариант 3: Кастомное меню

```astro
---
import UnifiedMenu from "../components/UnifiedMenu.astro";
---

<UnifiedMenu
  variant="landing"
  logoText="ЕГЕХИМ"
  logoHref="/"
  navItems={[
    { label: "О нас", href: "/about" },
    { label: "Блог", href: "/blog" },
    { label: "Контакты", href: "/contacts" },
  ]}
  ctaText="Начать обучение"
  ctaHref="/start"
  breakpoint={900}
/>
```

## 📋 Полный список пропсов

| Параметр        | Тип                    | По умолчанию             | Описание                           |
| --------------- | ---------------------- | ------------------------ | ---------------------------------- |
| `variant`       | `"media" \| "landing"` | `"media"`                | Вариант меню                       |
| `logoSrc`       | `string?`              | -                        | Путь к логотипу (картинка)         |
| `logoAlt`       | `string?`              | -                        | Alt для логотипа                   |
| `logoText`      | `string?`              | `config.siteName`        | Текст логотипа (если нет картинки) |
| `logoHref`      | `string?`              | `"/"`                    | Ссылка логотипа                    |
| `navItems`      | `NavItem[]?`           | `[]`                     | Основные пункты меню               |
| `dropdownLabel` | `string?`              | `"Курсы"`                | Название dropdown                  |
| `dropdownItems` | `DropdownItem[]?`      | `[]`                     | Подпункты dropdown                 |
| `ctaText`       | `string?`              | `"Бесплатные курсы ЕГЭ"` | Текст CTA кнопки                   |
| `ctaHref`       | `string?`              | `"/courses/free"`        | Ссылка CTA кнопки                  |
| `categories`    | `string[]?`            | `[]`                     | Категории (только media)           |
| `showSearch`    | `boolean?`             | `variant === "media"`    | Показать поиск                     |
| `searchAction`  | `string?`              | `"/media/search"`        | Action формы поиска                |
| `contacts`      | `ContactItem[]?`       | `[]`                     | Соцсети (только landing)           |
| `contactsLabel` | `string?`              | `"Напишите нам"`         | Подпись над соцсетями              |
| `breakpoint`    | `number?`              | `1100`                   | Брейкпоинт для мобильного меню     |

## 🎨 Типы

```ts
interface NavItem {
  label: string;
  href: string;
}

interface DropdownItem {
  label: string;
  href: string;
  sub?: string; // подзаголовок
}

interface ContactItem {
  label: string;
  href: string;
  imgSrc: string;
  alt?: string;
}
```

## 🚀 Миграция

### Из Menu.astro → UnifiedMenu

```diff
- import Menu from "../components/Menu.astro";
+ import UnifiedMenu from "../components/UnifiedMenu.astro";

- <Menu categories={categories} logoSrc={logoSrc} ctaHref={ctaHref} />
+ <UnifiedMenu variant="media" categories={categories} logoSrc={logoSrc} ctaHref={ctaHref} />
```

### Из Menu_lend.astro → UnifiedMenu

```diff
- import Menu_lend from "../components/Menu_lend.astro";
+ import UnifiedMenu from "../components/UnifiedMenu.astro";

- <Menu_lend ctaHref={ctaHref} />
+ <UnifiedMenu
+   variant="landing"
+   ctaHref={ctaHref}
+   dropdownItems={[...]}
+   contacts={[...]}
+ />
```

## ✅ Преимущества

- ✅ **Один компонент** вместо двух
- ✅ **Гибкая настройка** через пропсы
- ✅ **Единый стиль** и поведение
- ✅ **Легче поддерживать** - изменения в одном месте
- ✅ **Меньше дублирования** кода
- ✅ **Встроенная доступность** (ARIA, фокус-ловушка)

## 🔧 Кастомизация

### Изменить цвет акцента

```css
/* В вашем глобальном CSS */
:root {
  --menu-accent: #ff6b6b; /* вместо синего */
}
```

### Изменить максимальную ширину

```css
:root {
  --menu-max-width: 1440px;
  --menu-padding: 60px;
}
```
