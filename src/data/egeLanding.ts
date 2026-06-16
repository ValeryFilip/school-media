export const egeLandingData = {
  pageTitle: "ЕГЭ по химии — подготовка · ЕГЭХИМ",
  nav: {
    logoSrc: "/images/technical/egehim(kursi).webp",
    logoAlt: "ЕГЭХИМ — курсы",
    brand: "",
    meta: "/ ЕГЭ · 2027",
    siteLinks: [
      { href: "/", label: "Главная" },
      {
        label: "Наши курсы",
        columns: [
          {
            title: "Годовые курсы",
            links: [
              { href: "/#courses-tabs", label: "Годовые курсы" },
              {
                href: "/#courses-tabs",
                label: "Годовой курс ЕГЭ",
                description: "Полный курс подготовки к ЕГЭ",
              },
              {
                href: "/#courses-tabs",
                label: "Годовой курс для 10 класса",
                description: "Подготовка к ЕГЭ с 10 класса",
              },
              {
                href: "/#courses-tabs",
                label: "Годовой курс ОГЭ",
                description: "Подготовка к ОГЭ",
              },
            ],
          },
          {
            title: "Самостоятельные курсы",
            links: [
              { href: "/allcourses/", label: "Самостоятельные курсы" },
              {
                href: "/obschaya/",
                label: "Курс по общей химии",
                description: "Основы химии",
              },
              {
                href: "/organika/",
                label: "Курс по органической химии",
                description: "Органическая химия",
              },
              {
                href: "/neorganika/",
                label: "Курс по неорганической химии",
                description: "Неорганическая химия",
              },
              {
                href: "/ovr/",
                label: "Курс по ОВР",
                description: "Окислительно-восстановительные реакции",
              },
              {
                href: "/varianty-ege/",
                label: "Авторские варианты ЕГЭ",
                description: "15 КИМов · формат ФИПИ 2027",
              },
            ],
          },
          {
            title: "Пакеты курсов",
            links: [
              {
                href: "/paket-2-kursa/",
                label: "Пакет «2 курса»",
                description: "Общая + неорганика",
              },
              {
                href: "/paket-3-kursa/",
                label: "Пакет «3 курса»",
                description: "Органика + неорганика + общая · флагман",
              },
              {
                href: "/paket-4-kursa/",
                label: "Пакет «4 курса»",
                description: "Всё + авторские варианты",
              },
            ],
          },
        ],
      },
      { href: "/academy/", label: "Академия" },
      { href: "/otzyvy-na-kursi/", label: "Отзывы" },
      { href: "/contacts/", label: "Контакты" },
    ],
    landingLinks: [
      { href: "#author", label: "Автор" },
      { href: "#compare", label: "Сравнение" },
      { href: "#program", label: "Программа" },
      { href: "#prices", label: "Тарифы" },
      { href: "#parents", label: "Родителям" },
    ],
    cta: {
      label: "Пробный урок",
      popupId: "lead-popup",
      source: "menu",
      variant: "desktop",
      campaign: "ege",
    },
  },
  hero: {
    label: "[01] / Hero · набор 2027 открыт",
    visual: "chaos",
    titleLines: ["ЕГЭ.", "ХИМИЯ."],
    highlightedTitle: "95+&nbsp;БАЛЛОВ",
    description:
      "Авторский онлайн-курс Валерия&nbsp;Филипенко. Минигруппы&nbsp;по&nbsp;6&nbsp;человек, постоянная поддержка от&nbsp;автора, разбор каждой ошибки.",
    cta: { href: "#form", label: "Записаться на пробный", arrow: "→" },
    ctaNote: "БЕСПЛАТНО · 60 МИН · ДИАГНОСТИКА",
    moleculeMeta: {
      x: "X: 0.00",
      y: "Y: 0.00",
      formula: "C₆H₅OH · phenol",
      status: "[ACTIVE]",
    },
    marquee: [
      "Cu + 2H₂SO₄ → CuSO₄ + SO₂ + 2H₂O",
      "CH₃COOH ⇌ CH₃COO⁻ + H⁺",
      "2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂ + 8H₂O",
      "C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O",
    ],
  },
  outcomes: {
    section: "[02] / СТАТИСТИКА",
    title: "Цифры,",
    mutedTitle:
      "которые не&nbsp;стыдно показывать <span class=\"ul\">родителям</span>.",
    stats: [
      {
        value: 81.5,
        suffix: "",
        label: "Средний балл",
        accent: "acid",
        decimals: 1,
        note: "Средний балл учеников, которые выполнили 80+% домашних работ и посетили все занятия.",
      },
      { valueText: "каждый 3-й", label: "Сдаёт на 80+" },
      {
        value: 2000,
        suffix: "+",
        label: "Выпускников",
        note: "Ученики на платформе Stepik, очных курсах и индивидуальных занятиях.",
      },
      { value: 300, label: "100-балльников" },
    ],
    note:
      "* Данные по&nbsp;выпускам 2016–2026. Все ученики верифицированы по&nbsp;скриншоту личного кабинета ФИПИ.",
  },
  howTo: {
    section: "[04] / ПОДГОТОВКА",
    title: "Как устроена подготовка.",
    mutedTitle:
      "6 шагов от&nbsp;«ничего не&nbsp;помню» до&nbsp;<span class=\"ul\">90+</span>.",
    note:
      "* Шаги идут параллельно. Например, лекции и&nbsp;домашка чередуются с&nbsp;диагностиками каждый месяц.",
  },
  program: {
    section: "[07] / ПРОГРАММА",
    title: "4 больших раздела.",
    mutedTitle:
      "62&nbsp;темы. 36&nbsp;недель. Все темы из&nbsp;кодификатора <span class=\"ul\">ФИПИ</span>&nbsp;— и&nbsp;ещё пара сверху.",
  },
  includes: {
    section: "[08] / ВНУТРИ КУРСА",
    titleHtml:
      "Что ты&nbsp;получаешь, когда нажимаешь <span class=\"ul\">«Оплатить»</span>.",
  },
  pricing: {
    section: "[10] / ТАРИФЫ · 2027",
    title: "Три концентрации.",
    mutedTitle:
      "До&nbsp;1&nbsp;августа — <span class=\"ul-fuchsia\">скидка&nbsp;30%</span>.",
    badgePrefix: "ОСТАЛОСЬ",
    badgeCounter: null,
    badgeText: '<span data-countdown-to="2026-08-01T00:00:00+03:00">—</span> ДО КОНЦА СКИДКИ',
    ribbonLeft: "★ выбирают 7 из 10 учеников · флагман курса",
    ribbonRight: "SCROLL ↓ · РАЗВЕРНИ ВСЕ ПОДАРКИ",
    featured: {
      metaLeft: "[ GROUP · 68% ]",
      metaRight: "2027.MAIN",
      title: "Минигруппа",
      subtitle: "// рабочая концентрация · до&nbsp;6&nbsp;человек в&nbsp;группе",
      oldPrice: "17&nbsp;200 ₽",
      discount: "−30%",
      price: "12&nbsp;000&nbsp;₽",
      period: "/ мес",
      installment: "примерно 1&nbsp;000&nbsp;₽ за&nbsp;занятие · 2 урока в&nbsp;неделю по&nbsp;90&nbsp;мин",
      placesLabel: "// МЕСТ ОСТАЛОСЬ",
      placesCurrent: "12",
      placesTotal: "/ 48",
      placesWidth: "75%",
      placesNote:
        'Набор 2027 закрывается 1&nbsp;сентября. До&nbsp;конца скидки <span data-countdown-to="2026-08-01T00:00:00+03:00" class="text-paper">—</span>',
      cta: "Записаться · сэкономить&nbsp;5&nbsp;200&nbsp;₽ →",
      note: "пробный урок &mdash; бесплатно · 60 мин · с автором курса",
    },
  },
  cases: {
    section: "[09] / КЕЙСЫ",
    title: "Результаты,",
    mutedTitle: "которые можно <span class=\"ul\">проверить</span>.",
    prevLabel: "←",
    nextLabel: "→",
  },
  faq: {
    section: "[13] / FAQ",
    titleHtml:
      "Вопросы, <span class=\"text-dim\">которые ты&nbsp;задаёшь себе в&nbsp;3&nbsp;часа ночи</span> перед&nbsp;тем, как&nbsp;<span class=\"ul\">записаться</span>.",
  },
  footer: {
    brand: "ЕГЭХИМ",
    description:
      "Школа подготовки к&nbsp;ЕГЭ и&nbsp;ОГЭ по&nbsp;химии Валерия Филипенко. Подготовим к&nbsp;ЕГЭ по&nbsp;химии с&nbsp;нуля до&nbsp;бюджета.",
    addressHtml:
      'Самозанятый Филипенко Валерий Юрьевич<br />Почта: <a class="hover:text-acid transition" href="mailto:info@egehim.ru">info@egehim.ru</a>',
    legalLinks: [
      { href: "/docs/privacy/", label: "Политика конфиденциальности", rel: "noopener" },
      { href: "/docs/agreement/", label: "Согласие на обработку персональных данных", rel: "noopener" },
      { href: "/docs/cookies/", label: "Политика cookie и аналитики", rel: "noopener" },
      { href: "/docs/marketing-consent/", label: "Согласие на рекламные рассылки", rel: "noopener" },
      { href: "/docs/payment/", label: "Оплата и возвраты", rel: "noopener" },
      { href: "/docs/partners/", label: "Правила реферальной программы", rel: "noopener" },
    ],
    columns: [
      {
        title: "Разделы",
        links: [
          { href: "/refer/", label: "Реферальная программа" },
          { href: "/otzyvy-na-kursi/", label: "Отзывы" },
          { href: "/academy/", label: "Академия" },
          { href: "/contacts/", label: "Контакты" },
          {
            href: "https://t.me/valery_chemistry",
            label: "Хочу стать автором",
            external: true,
          },
        ],
      },
      {
        title: "Курсы",
        links: [
          { href: "/allcourses/", label: "Все курсы по химии на Stepik" },
          { href: "/neorganika/", label: "Неорганическая химия ЕГЭ" },
          { href: "/organika/", label: "Органическая химия ЕГЭ" },
          { href: "/obschaya/", label: "Общая химия ЕГЭ" },
          { href: "/ovr/", label: "ОВР и задание 29 ЕГЭ" },
          { href: "/paket-2-kursa/", label: "Пакет ×2: общая + неорганика" },
          { href: "/paket-3-kursa/", label: "Пакет ×3: вся химия ЕГЭ" },
          { href: "/paket-4-kursa/", label: "Пакет ×4: курсы + варианты" },
          { href: "/varianty-ege/", label: "Авторские варианты ЕГЭ" },
        ],
      },
    ],
    cta: {
      label: "Начать бесплатно",
      popupId: "lead-popup",
      source: "footer",
      variant: "default",
      campaign: "ege",
    },
    socialGroups: [
      {
        title: "Напишите нам",
        links: [
          { href: "https://t.me/valery_chemistry", label: "Telegram" },
          {
            href: "https://wa.me/79818364992?text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82!%20",
            label: "WhatsApp",
          },
          { href: "https://vk.me/valeryfilip", label: "VK" },
        ],
      },
      {
        title: "Соцсети",
        links: [
          { href: "https://www.youtube.com/@chemistry_exam", label: "YouTube" },
          { href: "https://vk.com/chemistry_exam", label: "VK" },
          { href: "https://t.me/+KznfEhtzkeNlZjIy", label: "Telegram" },
        ],
      },
    ],
    copyright: `${new Date().getFullYear()} © Школа химии Валерия Филипенко`,
    bottomLinks: [
      { href: "/sitemap.xml", label: "Карта сайта", rel: "noopener" },
      { href: "/rss.xml", label: "RSS-лента", rel: "noopener" },
    ],
    disclaimer:
      "* WhatsApp принадлежит компании Meta, признанной экстремистской организацией и запрещённой на территории РФ.",
  },
  floatingActions: {
    supportLabel: "Написать нам",
    scrollLabel: "Наверх",
    links: [
      { href: "https://t.me/valery_chemistry", label: "Telegram" },
      {
        href: "https://wa.me/79818364992?text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82!%20",
        label: "WhatsApp",
      },
      { href: "https://vk.me/valeryfilip", label: "VK" },
    ],
  },
  popupForm: {
    popupId: "lead-popup",
    title: "Пробный урок",
    eyebrow: "// заявка · 40 секунд",
    submitText: "Отправить заявку →",
    action: "/api/lead.php",
    formType: "popup",
  },
  runtime: {},
};

export type EgeLandingData = typeof egeLandingData;
