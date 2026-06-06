/*
  Данные лендингов /package/* (3 пакета):
    pack2 — Общая + Неорганика
    pack3 — Органика + Неорганика + Общая (флагман)
    pack4 — Орг + Неорг + Общ + Авторские варианты

  Структура одинаковая → компоненты принимают свою секцию как проп.
  Меняешь массив (модули, причины, бонусы, FAQ…) — страница пересобирается.
*/

import type { RichString, SectionTitle } from "./referLanding";

// ────────────────────────────────────────────────────────────
// Stepik — конфиг + helper для генерации view/pay URL.
// Логика повторяет лендинги /obschaya/, /organika/, /neorganika/:
//   • view-URL  — открывается в новой вкладке (витрина курса);
//   • pay-URL   — открывается в iframe-попапе через
//                 <PaymentPopup /> (data-payment-url).
// Промокод = +5% скидка на этап оплаты.
// ────────────────────────────────────────────────────────────

export interface StepikOffer {
  /** ID курса на Stepik: stepik.org/a/{courseId} */
  courseId: string;
  /** Промокод для оплаты со скидкой 5%. */
  promoCode: string;
  /** utm_medium для трекинга источника. */
  utmMedium: string;
  /** utm_campaign, по умолчанию "5%25" (= "5%" url-encoded). */
  utmCampaign?: string;
}

export function stepikUrls(s: StepikOffer): { view: string; pay: string } {
  const campaign = s.utmCampaign ?? "5%25";
  const view = `https://stepik.org/a/${s.courseId}?utm_source=cite&utm_medium=${s.utmMedium}`;
  const pay = `https://stepik.org/a/${s.courseId}/pay?promo=${s.promoCode}&utm_source=cite&utm_medium=${s.utmMedium}&utm_campaign=${campaign}`;
  return { view, pay };
}

function packageFormatData(args: {
  section: string;
  countText: string;
  routeText: string;
  accessText: string;
}) {
  return {
    section: args.section,
    title: {
      text: "Пакет — это те же самостоятельные курсы. Просто вместе и дешевле.",
      marks: [
        { text: "те же самостоятельные курсы.", color: "fuchsia" as const },
        { text: "вместе и дешевле.", underline: "acid" },
      ],
    },
    lead: {
      kicker: "// что такое пакет",
      text: `Пакет не заменяет монокурсы и не прячет внутри новый формат. Это ${args.countText} в одном аккаунте Stepik: те же уроки, задания, разборы и доступ. Ты можешь идти по готовому маршруту или открывать только нужные темы.`,
    },
    principle: {
      kicker: "// логика",
      titleHtml: `${args.routeText} <span class="text-acid">по отдельности</span> или забрать <span class="text-fuchsia2">одним комплектом</span>`,
      textHtml: `Если нужен один раздел — открывай монокурс. Если хочешь закрыть несколько частей ЕГЭ и не переплачивать за каждую покупку отдельно — пакет выгоднее.`,
      footnote: args.accessText,
    },
    cards: [
      { kicker: "// состав", color: "acid" as const, title: "Без урезанных версий", text: "В пакет входят полноценные курсы, которые продаются отдельно: с теми же видео, заданиями, материалами и обновлениями." },
      { kicker: "// маршрут", color: "fuchsia" as const, title: "Можно идти в своём порядке", text: "Начни с общей химии, прыгни в неорганику или добей органику — порядок не зашит жёстко." },
      { kicker: "// выгода", color: "acid" as const, title: "Один платёж дешевле", text: "Пакет нужен не для красоты: он снижает итоговую цену, если ты всё равно планируешь брать несколько курсов." },
      { kicker: "// честность", color: "fuchsia" as const, title: "Можно сравнить отдельно", text: "Ниже есть ссылки на монокурсы: посмотри состав каждого курса и реши, нужен комплект или отдельный раздел." },
    ],
    contrast: {
      label: "// пакет против случайных покупок",
      bad: {
        head: "Покупать вслепую",
        text: "Взять один курс, потом понять, что нужен второй, третий и практика вариантов.",
      },
      good: {
        head: "Собрать комплект сразу",
        text: "Получить все нужные разделы в одном маршруте, с понятной экономией и без разрозненных оплат.",
      },
    },
    footnote: "Пакет подходит, если ты готовишься системно. Если нужна только одна тема — лучше перейти на соответствующий монокурс.",
  };
}

// ────────────────────────────────────────────────────────────
// Pack 3 — флагман (текущая страница /package/)
// ────────────────────────────────────────────────────────────

export const pack3 = {
  seo: {
    title: "Пакет из 3 курсов по химии для ЕГЭ 2027 · ЕГЭХИМ",
    description:
      "Пакет курсов по органической, неорганической и общей химии для ЕГЭ 2027: 68 часов видео, 196 тем, 2715 заданий и бессрочный доступ.",
    url: "https://egehim.ru/paket-3-kursa/",
    image: "/images/new-design/org-neorg-obsch.webp",
    imageAlt: "Пакет из трех курсов ЕГЭХИМ: органическая, неорганическая и общая химия",
    productName: "PACK ×3 — Органика + Неорганика + Общая химия",
    breadcrumbName: "Пакет из 3 курсов",
    price: "11300",
  },
  nav: {
    meta: "/ пакет ×3",
    landingLinks: [
      { href: "#inside", label: "Что входит" },
      { href: "#value", label: "Выгода" },
      { href: "#why", label: "Почему пакет" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: { href: "#price", label: "Купить пакет →" },
  },

  hero: {
    secNum: "[01] / пакет курсов · доступ навсегда",
    microKicker: "// PACK ×3 — почти вся химия ЕГЭ в одном пакете",
    headline: {
      html: `Вся химия<br/>для ЕГЭ<br/><span class="text-dim">в одном</span><br/><span class="ul-a">пакете</span>.`,
    } as RichString,
    lead: {
      html: `Органика, неорганика и&nbsp;общая химия — <span class="text-acid font-semibold">три самостоятельных курса</span> с&nbsp;теорией и&nbsp;практикой для заданий <span class="text-acid font-semibold">1–33</span>. Один платёж вместо трёх, бессрочный доступ и&nbsp;поддержка на&nbsp;платформе и&nbsp;в&nbsp;общем чате.`,
    } as RichString,
    ctaPrimary: { href: "#price", label: "Забрать пакет за 11 300 ₽" },
    ctaSecondary: { href: "#value", label: "Сколько экономлю ↓" },
    microSpecs: ["3 курса в одном аккаунте", "самостоятельный темп", "Stepik · iOS · Android"],
    bundle: {
      kicker: "// состав пакета · 3 курса",
      indicator: "● ЗАДАНИЯ 1–33",
      layers: [
        { idx: "01", name: "Органика", share: "≈30% ЕГЭ", meta: "25 ч видео · 1065 заданий · углеводороды → биомолекулы", href: "/organika/" },
        { idx: "02", name: "Неорганика", share: "≈30% ЕГЭ", meta: "26 ч видео · 1085 заданий · свойства классов, ОВР, цепочки", href: "/neorganika/" },
        { idx: "03", name: "Общая химия", share: "≈30% ЕГЭ", meta: "17 ч видео · 565 заданий · строение, связь, термохимия, расчёты", href: "/obschaya/" },
      ],
      miniStats: [
        { value: { html: `68<span class="text-dim text-sm">ч</span>` }, label: "видео" },
        { value: { html: `2715<span class="text-dim text-sm">+</span>` }, label: "задач" },
        { value: { html: `∞` }, label: "доступ", valueClass: "text-acid" },
      ],
      price: {
        old: "13 970 ₽ по отдельности",
        current: { html: `11 300 ₽<span class="text-dim text-sm font-normal"> / навсегда</span>` },
        savingBadge: "−2 670 ₽",
      },
    },
    stats: [
      { value: { html: `1–33` }, label: "задания охвачены", valueClass: "text-acid" },
      { value: { html: `×3` }, label: "курса в одном пакете" },
      { value: { html: `68<span class="text-dim text-2xl">ч</span>` }, label: "видео без воды" },
      { value: { html: `−19<span class="text-dim text-2xl">%</span>` }, label: "к цене трёх курсов", valueClass: "text-fuchsia2" },
    ],
  },

  heroMarquee: [
    "органика",
    "неорганика",
    "общая химия",
    "теория и практика для заданий 1–33",
    "один платёж вместо трёх",
    "экономия 2 670 ₽",
    "доступ навсегда",
  ],

  selfpaced: packageFormatData({
    section: "[03] / ЧТО ТАКОЕ ПАКЕТ",
    countText: "три самостоятельных курса",
    routeText: "Органика, неорганика и общая химия",
    accessText: "После оплаты открываются три отдельных курса в одном аккаунте. Доступ сохраняется без подписки и продлений.",
  }),

  inside: {
    secNum: "[02] / ЧТО ВХОДИТ",
    title: {
      text: "Три курса, которые собирают всю химию воедино.",
      marks: [{ text: "собирают всю химию", underline: "acid" }],
    } as SectionTitle,
    lead: "Каждый курс можно проходить отдельно. Вместе они охватывают общую, неорганическую и органическую химию: от строения атома до сложных органических цепочек.",
    modules: [
      {
        idx: "// курс 01", pill: "≈30% ЕГЭ", name: "Органика", meta: "25 ч видео · 1065 заданий", href: "/organika/",
        bullets: [
          "Углеводороды: алканы, алкены, алкины, арены",
          "Кислородсодержащие: спирты, альдегиды, кислоты",
          "Азотсодержащие, аминокислоты, белки",
          "Задания 10–16, 24, 32 и 33",
        ],
        priceSeparately: "5 790 ₽",
      },
      {
        idx: "// курс 02", pill: "≈30% ЕГЭ", name: "Неорганика", meta: "26 ч видео · 1085 заданий", href: "/neorganika/",
        bullets: [
          "Свойства оксидов, кислот, оснований, солей",
          "Металлы и неметаллы, электролиз",
          "ОВР и метод электронного баланса",
          "Задания 6–9, 24, 29, 30 и 31",
        ],
        priceSeparately: "5 790 ₽",
      },
      {
        idx: "// курс 03", pill: "≈30% ЕГЭ", name: "Общая", meta: "17 ч видео · 565 заданий", href: "/obschaya/",
        bullets: [
          "Строение атома, периодический закон",
          "Химическая связь и строение вещества",
          "Скорость реакций, химическое равновесие",
          "Расчётные задачи 27–28, термохимия",
        ],
        priceSeparately: "2 390 ₽",
      },
    ],
    commonalities: [
      { title: "Видео + материалы", text: "уроки, таблицы, схемы и чек-листы для повторения" },
      { title: "Тренажёр с проверкой", text: "задачи с автопроверкой — решай сколько угодно раз" },
      { title: "Один чат на всё", text: "вопросы по любому из трёх курсов — в одном месте" },
      { title: "iOS / Android", text: "учись с телефона, планшета или компа — где удобно" },
    ],
  },

  value: {
    secNum: "[05] / ВЫГОДА",
    title: {
      text: "Три курса по отдельности — дороже на 2 670 ₽.",
      marks: [{ text: "дороже на 2 670 ₽", underline: "fuchsia" }],
    } as SectionTitle,
    separately: {
      kicker: "// по отдельности",
      rows: [
        { label: "Органика", price: "5 790 ₽" },
        { label: "Неорганика", price: "5 790 ₽" },
        { label: "Общая химия", price: "2 390 ₽" },
      ],
      total: "13 970 ₽",
      footnote: "сумма текущих цен трёх монокурсов",
    },
    bundle: {
      badge: "ВЫГОДНЕЕ",
      kicker: "// пакетом ×3",
      rows: [
        { label: "Органика + Неорганика + Общая", value: "в пакете" },
        { label: "Единый чат поддержки", value: "включён" },
        { label: "Бессрочный доступ к материалам", value: "включён" },
      ],
      total: "11 300 ₽",
      footnote: { html: `один платёж · экономия <span class="text-fuchsia2 font-bold">2 670 ₽</span>` } as RichString,
    },
    callouts: [
      { value: "2 670 ₽" as string | RichString, label: "прямая экономия в пакете", kind: "fuchsia" as const },
      { value: "≈ 8 уроков" as string | RichString, label: "столько стоят 11 300 ₽ у репетитора по 1 500 ₽", kind: "paper" as const },
      {
        value: { html: `4<span class="text-2xl" style="color: rgba(10,10,10,0.4);"> части</span>` } as RichString,
        label: "Т-Банк или Яндекс Сплит на Stepik",
        kind: "paper" as const,
      },
    ],
    cta: { href: "#price", label: "Сэкономить 2 670 ₽" },
  },

  why: {
    secNum: "[06] / ПОЧЕМУ ПАКЕТ",
    title: {
      text: "Три самостоятельных курса. Один маршрут подготовки.",
      marks: [{ text: "Один маршрут подготовки.", color: "dim" }],
    } as SectionTitle,
    reasons: [
      {
        kicker: "// 01 · связность", kickerColor: "acid" as const,
        title: "Химия не делится на куски",
        text: "Органика опирается на строение атома из общей, неорганика — на ОВР. Купив всё сразу, ты не упрёшься в тему, которой «не было в твоём курсе».",
      },
      {
        kicker: "// 02 · порядок", kickerColor: "acid" as const,
        title: "Понятно, что проходить дальше",
        text: "Начни с общей химии, затем переходи к неорганике и органике. Темы выстроены так, чтобы новые реакции опирались на уже изученную базу.",
      },
      {
        kicker: "// 03 · практика", kickerColor: "acid" as const,
        title: "После теории сразу идут задания",
        text: "Материал закрепляется задачами с автопроверкой. Ошибку можно разобрать и повторить попытку, не дожидаясь следующего занятия.",
      },
      {
        kicker: "// 04 · темп", kickerColor: "fuchsia" as const,
        title: "Подготовка подстраивается под график",
        text: "Курсы не привязаны к расписанию группы: можно ускоряться на знакомых темах и подробнее разбирать сложные разделы.",
      },
    ],
  },

  afterPayment: {
    secNum: "[07] / что будет после оплаты",
    title: {
      text: "Все три курса появятся в кабинете. В любом порядке.",
      marks: [
        { text: "Все три курса", underline: "acid" as const },
        { text: "В любом порядке.", color: "dim" as const },
      ],
    },
    intro: "Один платёж — три курса в одном аккаунте на Stepik. Никаких отдельных регистраций, никакого порядка «сначала это, потом то». Можно начать с любого, переключаться между ними, возвращаться к темам.",
    steps: [
      {
        code: "01",
        tag: "// оплата",
        title: "Жмёшь «Перейти к оплате»",
        text: "Кнопка ведёт на Stepik с уже применённым промокодом — скидка 5%. Оплата картой, Я.Сплитом или Т-Банком (рассрочка на 4 части под 0%). Чек приходит на почту автоматом.",
      },
      {
        code: "02",
        tag: "// личный кабинет",
        title: "Три курса появляются у тебя в аккаунте",
        text: "Сразу после оплаты органика, неорганика и общая открываются вместе. Один логин, один прогресс, один общий чат поддержки.",
      },
      {
        code: "03",
        tag: "// порядок",
        title: "Проходишь как удобно",
        text: "Параллельно, по очереди, перескакивая между темами — твой темп. Доступ навсегда: можно вернуться через год, перед олимпиадой или в универе.",
      },
    ],
  },

  pricing: {
    secNum: "[08] / ЦЕНА · 2027",
    title: { html: `Вся химия ЕГЭ<br/><span class="text-ink/60">+&nbsp;скидка&nbsp;19%.</span>` } as RichString,
    badge: { html: `ПАКЕТНАЯ ЦЕНА АКТИВНА · ЭКОНОМИЯ <span class="text-acid font-bold">2 670 ₽</span>` } as RichString,
    featured: {
      topStripeLeft: "★ флагманский пакет · вся химия ЕГЭ",
      topStripeRight: "3 КУРСА · ОДИН ПЛАТЁЖ",
      code: "[ PACK ×3 · ЗАДАНИЯ 1–33 ]",
      skuId: "2027.PACK3",
      title: { html: `Орг + Неорг<br/>+ Общая.` } as RichString,
      spec: "// 68 ч видео · 2715 заданий · доступ ∞",
      priceOld: "13 970 ₽",
      priceOldBadge: "−19%",
      priceCurrent: { html: `11&nbsp;300&nbsp;₽` } as RichString,
      perpetualSuffix: "/ навсегда",
      installmentNote: "или оплата частями через Т-Банк / Яндекс Сплит на Stepik",
      savingHighlight: {
        kicker: "// ЭКОНОМИЯ В ПАКЕТЕ",
        sum: { html: `<span class="text-fuchsia2 font-bold">2 670 ₽</span> <span class="text-dim">/ −19%</span>` } as RichString,
        barPercent: 81,
        foot: { html: `Три курса по отдельности — <span class="text-paper line-through">13 970 ₽</span>` } as RichString,
      },
      // У пакета ×3 пока нет отдельного проверенного промокода оплаты.
      // Сохраняем действующий платёжный контур ×4, пока не будет выдан URL для 238137.
      stepik: {
        courseId: "238138",
        promoCode: "90c9f6c96cad6e37",
        utmMedium: "package-pack3",
      } as StepikOffer,
      purchase: {
        payLabel: "Перейти к оплате · скидка 5%",
        viewLabel: "Посмотреть курс на Stepik",
        note: "Итоговая цена с промокодом отобразится на Stepik",
      },
      ctaFootnote: "возврат в течение 14 дней · по правилам Stepik",
      bonuses: [
        { idx: "// ФОРМАТ 01", title: "Три курса в одном аккаунте", text: "Переключайся между общей, неорганической и органической химией без отдельных кабинетов." },
        { idx: "// МАРШРУТ 02", title: "15 разделов и 196 тем", text: "Последовательный маршрут от строения атома до органических цепочек и расчётных задач." },
        { idx: "// ПРАКТИКА 03", title: "Задания с автопроверкой", text: "Результат виден сразу, а попытки можно повторять для закрепления темы." },
        { idx: "// МАТЕРИАЛЫ 04", title: "Файлы для печати", text: "Таблицы, схемы и чек-листы для повторения материала." },
      ],
      featuresKicker: "// что входит в пакет",
      features: [
        "3 самостоятельных курса",
        "68 часов видео без воды",
        "2715 заданий с автопроверкой",
        "Теория и практика для заданий 1–33",
        "Таблицы, схемы и чек-листы",
        "Платформа Stepik + приложение",
      ],
    },
    secondary: [
      {
        idx: "[ ОРГАНИКА · соло ]", idxColor: "paper" as const,
        hoverHint: "1 курс из 3 ·",
        title: "Только органика →",
        meta: "// ≈30% ЕГЭ · 1065 заданий",
        priceNew: "5 790 ₽", priceOld: "7 490 ₽", saving: "−1 700 ₽",
        href: "/organika/",
        paymentUrl: "https://stepik.org/a/196367/pay?promo=74e5757035325913&utm_source=cite&utm_medium=package-pack3&utm_campaign=5%25",
        borderHoverClass: "hover:border-paper",
      },
      {
        idx: "[ PACK ×4 · 1–33 + 15 АВ ]", idxColor: "fuchsia" as const,
        hoverHint: "+ авторские варианты ·",
        title: "Полный пакет ×4 →",
        meta: "// + 15 авторских вариантов и 650 заданий",
        priceNew: "11 700 ₽", priceOld: "14 470 ₽", saving: "−2 770 ₽",
        href: "/paket-4-kursa/",
        paymentUrl: "https://stepik.org/a/238138/pay?promo=90c9f6c96cad6e37&utm_source=cite&utm_medium=package-pack4&utm_campaign=5%25",
        borderHoverClass: "hover:border-fuchsia2",
      },
    ],
    facts: [
      { idx: "// ФАКТ 01", title: "Курсы работают на Stepik", text: "Можно заниматься в браузере или мобильном приложении для iOS и Android.", bgClass: "bg-paper", kickerColorClass: "text-ink/60", textColorClass: "text-ink/70" },
      { idx: "// ФАКТ 02", title: "Прогресс сохраняется", text: "Продолжай обучение с другого устройства с того места, на котором остановился.", bgClass: "bg-paper", kickerColorClass: "text-ink/60", textColorClass: "text-ink/70" },
      { idx: "// ФАКТ 03", title: "Вопрос можно задать по теме", text: "Поддержка доступна под уроками Stepik и в общем чате по материалам пакета.", bgClass: "bg-paper", kickerColorClass: "text-ink/60", textColorClass: "text-ink/70" },
    ],
  },

  faq: {
    secNum: "[09] / FAQ",
    title: { text: "Вопросы про пакет.", marks: [{ text: "пакет.", underline: "acid" }] } as SectionTitle,
    lead: "Кратко и по делу — что входит, как купить, как пользоваться. Если чего-то не нашёл — напиши в поддержку.",
    items: [
      { q: "Чем пакет отличается от покупки трёх курсов по отдельности?", a: "По содержанию — ничем: внутри те же три курса с видео, заданиями, таблицами, схемами и чек-листами. Разница в цене: один платёж 11 300 ₽ вместо 13 970 ₽ — экономия 2 670 ₽." },
      { q: "Что значит «доступ навсегда»?", a: "После оплаты доступ к приобретённым материалам сохраняется без ограничения по времени. Подписки и обязательных продлений нет." },
      { q: "Можно ли купить в рассрочку?", a: "На Stepik доступна оплата частями через Т-Банк или Яндекс Сплит. Доступные сроки и суммы отображаются непосредственно во время оплаты." },
      { q: "Что если не подойдёт?", a: "Возврат можно оформить в течение 14 дней после покупки по действующим правилам Stepik." },
      { q: "На какой платформе курсы?", a: "Курсы развёрнуты на Stepik — мобильное приложение iOS / Android, прогресс на разных устройствах, удобная навигация." },
      { q: "Подходит для 10 класса / повторного года?", a: "Да. Логика «от строения атома до сложных цепочек» одинаково работает и для тех, кто только начинает в 10 классе, и для тех, кто доучивает темы перед второй попыткой. Темп выбираешь сам." },
      { q: "Как работает поддержка?", a: "Вопрос можно задать под уроком на Stepik или в общем чате. Написать можно в любое время, ответы приходят в рабочее время." },
    ],
  },

  finalCta: {
    kicker: "// последний шаг",
    title: { html: `Забери <span class="text-acid">всю химию</span><br/><span class="text-dim">— одним платежом.</span>` } as RichString,
    ctaPrimary: { href: "#price", label: "Купить пакет за 11 300 ₽" },
    ctaSecondary: { href: "#inside", label: "↑ что внутри" },
  },
};

export type PackageData = typeof pack3;

// ────────────────────────────────────────────────────────────
// Pack 2 — Общая + Неорганика
// ────────────────────────────────────────────────────────────

export const pack2: PackageData = {
  seo: {
    title: "Пакет: общая и неорганическая химия ЕГЭ 2027 · ЕГЭХИМ",
    description: "Пакет курсов по общей и неорганической химии для подготовки к ЕГЭ 2027: 43 часа видео, 134 темы, 1650 заданий и бессрочный доступ.",
    url: "https://egehim.ru/paket-2-kursa/",
    image: "/images/new-design/obsch-neorg.webp",
    imageAlt: "Пакет ЕГЭХИМ по общей и неорганической химии",
    productName: "PACK ×2 — Общая + Неорганическая химия",
    breadcrumbName: "Пакет из 2 курсов",
    price: "6990",
  },
  nav: {
    meta: "/ пакет ×2",
    landingLinks: [
      { href: "#inside", label: "Что входит" },
      { href: "#value", label: "Выгода" },
      { href: "#why", label: "Почему пакет" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: { href: "#price", label: "Купить пакет ×2 →" },
  },

  hero: {
    secNum: "[01] / стартовый пакет · 2 курса",
    microKicker: "// PACK ×2 — общая химия + неорганика",
    headline: {
      html: `Общая<br/>+ неорганика<br/><span class="text-dim">в одном</span><br/><span class="ul-a">пакете</span>.`,
    } as RichString,
    lead: {
      html: `Общая химия и&nbsp;неорганика — <span class="text-acid font-semibold">два самостоятельных курса</span> с&nbsp;теорией и&nbsp;практикой для <span class="text-acid font-semibold">24 из 34 заданий</span> ЕГЭ. Один платёж вместо двух, бессрочный доступ и&nbsp;поддержка на&nbsp;платформе и&nbsp;в&nbsp;общем чате.`,
    } as RichString,
    ctaPrimary: { href: "#price", label: "Забрать пакет за 6 990 ₽" },
    ctaSecondary: { href: "#value", label: "Сколько экономлю ↓" },
    microSpecs: ["2 курса в одном аккаунте", "самостоятельный темп", "Stepik · iOS · Android"],
    bundle: {
      kicker: "// состав пакета · 2 курса",
      indicator: "● 24 ИЗ 34 ЗАДАНИЙ",
      layers: [
        { idx: "01", name: "Общая химия", share: "≈30% ЕГЭ", meta: "17 ч видео · 565 заданий · строение, связь, термохимия", href: "/obschaya/" },
        { idx: "02", name: "Неорганика", share: "≈30% ЕГЭ", meta: "26 ч видео · 1085 заданий · свойства классов, ОВР, цепочки", href: "/neorganika/" },
      ],
      miniStats: [
        { value: { html: `43<span class="text-dim text-sm">ч</span>` }, label: "видео" },
        { value: { html: `1 650<span class="text-dim text-sm"></span>` }, label: "задач" },
        { value: { html: `∞` }, label: "доступ", valueClass: "text-acid" },
      ],
      price: {
        old: "8 180 ₽ по отдельности",
        current: { html: `6 990 ₽<span class="text-dim text-sm font-normal"> / навсегда</span>` },
        savingBadge: "−1 190 ₽",
      },
    },
    stats: [
      { value: { html: `24/34` }, label: "задания охвачены", valueClass: "text-acid" },
      { value: { html: `×2` }, label: "курса в одном пакете" },
      { value: { html: `43<span class="text-dim text-2xl">ч</span>` }, label: "видео без воды" },
      { value: { html: `−15<span class="text-dim text-2xl">%</span>` }, label: "к цене двух курсов", valueClass: "text-fuchsia2" },
    ],
  },

  heroMarquee: [
    "общая химия",
    "неорганика",
    "теория для 24 из 34 заданий",
    "один платёж вместо двух",
    "экономия 1 190 ₽",
    "доступ навсегда",
    "фундамент под органику",
  ],

  selfpaced: packageFormatData({
    section: "[03] / ЧТО ТАКОЕ ПАКЕТ",
    countText: "два самостоятельных курса",
    routeText: "Общая химия и неорганика",
    accessText: "После оплаты открываются два отдельных курса в одном аккаунте. Можно идти параллельно или закрывать разделы по очереди.",
  }),

  inside: {
    secNum: "[02] / ЧТО ВХОДИТ",
    title: {
      text: "Два курса, которые собирают всю базу химии.",
      marks: [{ text: "всю базу", underline: "acid" }],
    } as SectionTitle,
    lead: "Общая даёт строение, связь и реакционную способность; неорганика — конкретные классы соединений, ОВР и цепочки. Это база, на которую потом ложится органика.",
    modules: [
      {
        idx: "// курс 01", pill: "≈30% ЕГЭ", name: "Общая", meta: "17 ч видео · 565 заданий", href: "/obschaya/",
        bullets: [
          "Строение атома, периодический закон",
          "Химическая связь и строение вещества",
          "Скорость реакций, химическое равновесие",
          "Расчётные задачи 27–28, термохимия",
        ],
        priceSeparately: "2 390 ₽",
      },
      {
        idx: "// курс 02", pill: "≈30% ЕГЭ", name: "Неорганика", meta: "26 ч видео · 1085 заданий", href: "/neorganika/",
        bullets: [
          "Свойства оксидов, кислот, оснований, солей",
          "Металлы и неметаллы, электролиз",
          "ОВР и метод электронного баланса",
          "Задания 6–9, 24, 29, 30 и 31",
        ],
        priceSeparately: "5 790 ₽",
      },
    ],
    commonalities: pack3.inside.commonalities.map((item, index) =>
      index === 2
        ? { title: "Один чат на всё", text: "вопросы по обоим курсам — в одном месте" }
        : item
    ),
  },

  value: {
    secNum: "[05] / ВЫГОДА",
    title: {
      text: "Два курса по отдельности — дороже на 1 190 ₽.",
      marks: [{ text: "дороже на 1 190 ₽", underline: "fuchsia" }],
    } as SectionTitle,
    separately: {
      kicker: "// по отдельности",
      rows: [
        { label: "Общая химия", price: "2 390 ₽" },
        { label: "Неорганика", price: "5 790 ₽" },
      ],
      total: "8 180 ₽",
      footnote: "сумма текущих цен двух монокурсов",
    },
    bundle: {
      badge: "ВЫГОДНЕЕ",
      kicker: "// пакетом ×2",
      rows: [
        { label: "Общая + Неорганика", value: "в пакете" },
        { label: "Единый чат поддержки", value: "включён" },
        { label: "Бессрочный доступ к материалам", value: "включён" },
      ],
      total: "6 990 ₽",
      footnote: { html: `один платёж · экономия <span class="text-fuchsia2 font-bold">1 190 ₽</span>` } as RichString,
    },
    callouts: [
      { value: "1 190 ₽" as string | RichString, label: "прямая экономия в пакете", kind: "fuchsia" as const },
      { value: "≈ 5 уроков" as string | RichString, label: "столько стоят 6 990 ₽ у репетитора по 1 500 ₽", kind: "paper" as const },
      {
        value: { html: `4<span class="text-2xl" style="color: rgba(10,10,10,0.4);"> части</span>` } as RichString,
        label: "Т-Банк или Яндекс Сплит на Stepik",
        kind: "paper" as const,
      },
    ],
    cta: { href: "#price", label: "Сэкономить 1 190 ₽" },
  },

  why: {
    secNum: "[06] / ПОЧЕМУ ПАКЕТ",
    title: {
      text: "Стартовый набор — без пробелов в базе.",
      marks: [{ text: "без пробелов", color: "dim" }],
    } as SectionTitle,
    reasons: [
      {
        kicker: "// 01 · фундамент", kickerColor: "acid" as const,
        title: "База, на которой держится вся химия",
        text: "Без общей не понять ОВР, без неорганики — реакции в органике. Эти два курса в связке убирают самые частые «дыры» в подготовке.",
      },
      {
        kicker: "// 02 · порядок", kickerColor: "acid" as const,
        title: "Сначала принципы, затем реакции",
        text: "Общая химия объясняет закономерности, а неорганика показывает их на конкретных классах веществ. Поэтому темы не приходится заучивать отдельно.",
      },
      {
        kicker: "// 03 · практика", kickerColor: "acid" as const,
        title: "Знания проверяются сразу",
        text: "После уроков идут задания с автопроверкой. Можно вернуться к ошибке, повторить тему и решить задачу ещё раз.",
      },
      {
        kicker: "// 04 · продолжение", kickerColor: "fuchsia" as const,
        title: "Базу легко дополнить органикой",
        text: "После общей и неорганической химии можно отдельно подключить органику или перейти к полному пакету, не перестраивая подготовку.",
      },
    ],
  },

  afterPayment: {
    secNum: "[07] / что будет после оплаты",
    title: {
      text: "Оба курса появятся в кабинете. В любом порядке.",
      marks: [
        { text: "Оба курса", underline: "acid" as const },
        { text: "В любом порядке.", color: "dim" as const },
      ],
    },
    intro: "Один платёж — два курса в одном аккаунте на Stepik. Можно начать с общей, можно — с неорганики, можно идти параллельно. Один логин, один чат, один прогресс.",
    steps: [
      {
        code: "01",
        tag: "// оплата",
        title: "Жмёшь «Перейти к оплате»",
        text: "Кнопка ведёт на Stepik с уже применённым промокодом — скидка 5%. Оплата картой, Я.Сплитом или Т-Банком (рассрочка на 4 части под 0%). Чек приходит на почту автоматом.",
      },
      {
        code: "02",
        tag: "// личный кабинет",
        title: "Два курса появляются у тебя в аккаунте",
        text: "Сразу после оплаты общая и неорганическая химия открываются вместе. Один логин, один прогресс, один общий чат поддержки.",
      },
      {
        code: "03",
        tag: "// порядок",
        title: "Проходишь как удобно",
        text: "Параллельно или по очереди, перескакивая между темами — твой темп. Доступ навсегда: можно вернуться через год или дополнить курс органикой.",
      },
    ],
  },

  pricing: {
    secNum: "[08] / ЦЕНА · 2027",
    title: { html: `Общая + Неорг<br/><span class="text-ink/60">+&nbsp;скидка&nbsp;15%.</span>` } as RichString,
    badge: { html: `ПАКЕТНАЯ ЦЕНА АКТИВНА · ЭКОНОМИЯ <span class="text-acid font-bold">1 190 ₽</span>` } as RichString,
    featured: {
      topStripeLeft: "★ стартовый пакет · база химии ЕГЭ",
      topStripeRight: "2 КУРСА · ОДИН ПЛАТЁЖ",
      code: "[ PACK ×2 · 24 ИЗ 34 ]",
      skuId: "2027.PACK2",
      title: { html: `Общая<br/>+ Неорганика.` } as RichString,
      spec: "// 43 ч видео · 1650 заданий · доступ ∞",
      priceOld: "8 180 ₽",
      priceOldBadge: "−15%",
      priceCurrent: { html: `6&nbsp;990&nbsp;₽` } as RichString,
      perpetualSuffix: "/ навсегда",
      installmentNote: "или оплата частями через Т-Банк / Яндекс Сплит на Stepik",
      savingHighlight: {
        kicker: "// ЭКОНОМИЯ В ПАКЕТЕ",
        sum: { html: `<span class="text-fuchsia2 font-bold">1 190 ₽</span> <span class="text-dim">/ −15%</span>` } as RichString,
        barPercent: 85,
        foot: { html: `Два курса по отдельности — <span class="text-paper line-through">8 180 ₽</span>` } as RichString,
      },
      stepik: {
        courseId: "238136",
        promoCode: "ee3fee815d6fc976",
        utmMedium: "package-pack2",
      } as StepikOffer,
      purchase: {
        payLabel: "Перейти к оплате · скидка 5%",
        viewLabel: "Посмотреть курс на Stepik",
        note: "Итоговая цена с промокодом отобразится на Stepik",
      },
      ctaFootnote: "возврат в течение 14 дней · по правилам Stepik",
      bonuses: [
        { idx: "// ФОРМАТ 01", title: "Два курса в одном аккаунте", text: "Общая и неорганическая химия доступны рядом, без отдельных кабинетов и подписок." },
        { idx: "// МАТЕРИАЛЫ 02", title: "Файлы для печати", text: "Таблицы, схемы и чек-листы для повторения материала." },
        { idx: "// ПРАКТИКА 03", title: "Задания с автопроверкой", text: "Результат виден сразу, а попытки можно повторять для закрепления темы." },
        { idx: "// МАРШРУТ 04", title: "От атома до цепочек", text: "Темы идут от базовых закономерностей к свойствам веществ и сложным реакциям." },
      ],
      featuresKicker: "// что входит в пакет",
      features: [
        "2 самостоятельных курса",
        "43 часа видео без воды",
        "1650 заданий с автопроверкой",
        "Теория для 24 из 34 заданий",
        "Таблицы, схемы и чек-листы",
        "Платформа Stepik + приложение",
      ],
    },
    secondary: [
      {
        idx: "[ НЕОРГАНИКА · соло ]", idxColor: "paper" as const,
        hoverHint: "1 курс из 2 ·",
        title: "Только неорганика →",
        meta: "// ≈30% ЕГЭ · 1085 заданий",
        priceNew: "5 790 ₽", priceOld: "7 490 ₽", saving: "−1 700 ₽",
        href: "/neorganika/",
        paymentUrl: "https://stepik.org/a/134777/pay?promo=b59b65357e66a38d&utm_source=cite&utm_medium=package-pack2&utm_campaign=5%25",
        borderHoverClass: "hover:border-paper",
      },
      {
        idx: "[ PACK ×3 · ЗАДАНИЯ 1–33 ]", idxColor: "fuchsia" as const,
        hoverHint: "+ органика · ×3 курса",
        title: "Полный пакет ×3 →",
        meta: "// + органика, экономия 2 670 ₽",
        priceNew: "11 300 ₽", priceOld: "13 970 ₽", saving: "−2 670 ₽",
        href: "/paket-3-kursa/",
        paymentUrl: "https://stepik.org/a/238138/pay?promo=90c9f6c96cad6e37&utm_source=cite&utm_medium=package-pack3&utm_campaign=5%25",
        borderHoverClass: "hover:border-fuchsia2",
      },
    ],
    facts: [
      { idx: "// ФАКТ 01", title: "Курсы работают на Stepik", text: "Можно заниматься в браузере или мобильном приложении для iOS и Android.", bgClass: "bg-paper", kickerColorClass: "text-ink/60", textColorClass: "text-ink/70" },
      { idx: "// ФАКТ 02", title: "Прогресс сохраняется", text: "Продолжай обучение с другого устройства с того места, на котором остановился.", bgClass: "bg-paper", kickerColorClass: "text-ink/60", textColorClass: "text-ink/70" },
      { idx: "// ФАКТ 03", title: "Вопрос можно задать по теме", text: "Поддержка доступна под уроками Stepik и в общем чате по материалам пакета.", bgClass: "bg-paper", kickerColorClass: "text-ink/60", textColorClass: "text-ink/70" },
    ],
  },

  faq: {
    secNum: "[09] / FAQ",
    title: { text: "Вопросы про пакет ×2.", marks: [{ text: "пакет ×2.", underline: "acid" }] } as SectionTitle,
    lead: "Базовый пакет — общая + неорганика. Если планируешь органику тоже — посмотри PACK ×3, экономия больше.",
    items: [
      { q: "Хватит ли пакета ×2 для подготовки к ЕГЭ?", a: "Пакет содержит общую и неорганическую химию и охватывает темы для 24 из 34 заданий ЕГЭ. Для органических заданий нужен отдельный курс или пакет ×3." },
      { q: "Чем отличается от пакета ×3?", a: "В ×3 добавлена органика: ещё 25 часов видео и 1065 заданий. В результате три курса охватывают теорию и практику для заданий 1–33." },
      { q: "Что значит «доступ навсегда»?", a: "После оплаты курсы остаются за тобой без ограничений по времени. Можно вернуться к материалам после ЕГЭ, перед олимпиадой, в универе." },
      { q: "Можно ли купить в рассрочку?", a: "На Stepik доступна оплата частями через Т-Банк или Яндекс Сплит. Доступные сроки и суммы отображаются непосредственно во время оплаты." },
      { q: "Что если не подойдёт?", a: "Возврат можно оформить в течение 14 дней после покупки по действующим правилам Stepik." },
      { q: "На какой платформе курсы?", a: "Курсы развёрнуты на Stepik — приложение iOS / Android, прогресс синхронизируется между устройствами." },
      { q: "Как работает поддержка?", a: "Вопрос можно задать под уроком на Stepik или в общем чате. Написать можно в любое время, ответы приходят в рабочее время." },
    ],
  },

  finalCta: {
    kicker: "// последний шаг",
    title: { html: `Забери <span class="text-acid">базу химии</span><br/><span class="text-dim">— одним платежом.</span>` } as RichString,
    ctaPrimary: { href: "#price", label: "Купить пакет за 6 990 ₽" },
    ctaSecondary: { href: "#inside", label: "↑ что внутри" },
  },
};

// ────────────────────────────────────────────────────────────
// Pack 4 — Орг + Неорг + Общ + Авторские варианты
// ────────────────────────────────────────────────────────────

export const pack4: PackageData = {
  seo: {
    title: "Полный пакет по химии ЕГЭ 2027: курсы и варианты · ЕГЭХИМ",
    description: "Полный пакет подготовки к ЕГЭ по химии 2027: три курса, 68 часов видео, 15 авторских вариантов, 3365 заданий и бессрочный доступ.",
    url: "https://egehim.ru/paket-4-kursa/",
    image: "/images/new-design/org-neorg-obsch-var.webp",
    imageAlt: "Полный пакет ЕГЭХИМ: три курса по химии и авторские варианты",
    productName: "PACK ×4 — Три курса по химии + авторские варианты",
    breadcrumbName: "Полный пакет из 4 курсов",
    price: "11700",
  },
  nav: {
    meta: "/ пакет ×4 · полный",
    landingLinks: [
      { href: "#inside", label: "Что входит" },
      { href: "#value", label: "Выгода" },
      { href: "#why", label: "Почему пакет" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: { href: "#price", label: "Купить полный пакет →" },
  },

  hero: {
    secNum: "[01] / полный пакет · 4 курса",
    microKicker: "// PACK ×4 — вся химия + авторские варианты ЕГЭ",
    headline: {
      html: `Полная<br/>подготовка<br/><span class="text-dim">к ЕГЭ</span><br/><span class="ul-f">пакетом ×4</span>.`,
    } as RichString,
    lead: {
      html: `Органика, неорганика, общая химия и&nbsp;<span class="text-fuchsia2 font-semibold">15&nbsp;авторских вариантов ЕГЭ</span>. Три курса дают теорию и&nbsp;практику для заданий <span class="text-acid font-semibold">1–33</span>, а&nbsp;650 заданий в&nbsp;вариантах помогают отработать полный формат экзамена.`,
    } as RichString,
    ctaPrimary: { href: "#price", label: "Забрать полный пакет за 11 700 ₽" },
    ctaSecondary: { href: "#value", label: "Сколько экономлю ↓" },
    microSpecs: ["теория + полный формат", "15 авторских вариантов", "Stepik · iOS · Android"],
    bundle: {
      kicker: "// состав пакета · 4 курса",
      indicator: "● 1–33 + 15 АВ",
      layers: [
        { idx: "01", name: "Органика", share: "≈30% ЕГЭ", meta: "25 ч видео · 1065 заданий · углеводороды → биомолекулы", href: "/organika/" },
        { idx: "02", name: "Неорганика", share: "≈30% ЕГЭ", meta: "26 ч видео · 1085 заданий · свойства классов, ОВР, цепочки", href: "/neorganika/" },
        { idx: "03", name: "Общая химия", share: "≈30% ЕГЭ", meta: "17 ч видео · 565 заданий · строение, связь, термохимия", href: "/obschaya/" },
        { idx: "04", name: "Авторские варианты", share: "практика", meta: "15 вариантов · 650 заданий формата ЕГЭ", href: "https://stepik.org/a/140949?utm_source=cite&utm_medium=package-4" },
      ],
      miniStats: [
        { value: { html: `68<span class="text-dim text-sm">ч</span>` }, label: "видео" },
        { value: { html: `3365<span class="text-dim text-sm"></span>` }, label: "заданий" },
        { value: { html: `∞` }, label: "доступ", valueClass: "text-acid" },
      ],
      price: {
        old: "14 470 ₽ по отдельности",
        current: { html: `11 700 ₽<span class="text-dim text-sm font-normal"> / навсегда</span>` },
        savingBadge: "−2 770 ₽",
      },
    },
    stats: [
      { value: { html: `15` }, label: "полных вариантов ЕГЭ", valueClass: "text-acid" },
      { value: { html: `×4` }, label: "курса в одном пакете" },
      { value: { html: `68<span class="text-dim text-2xl">ч</span>` }, label: "видео без воды" },
      { value: { html: `−19<span class="text-dim text-2xl">%</span>` }, label: "к цене четырёх курсов", valueClass: "text-fuchsia2" },
    ],
  },

  heroMarquee: [
    "органика",
    "неорганика",
    "общая химия",
    "15 авторских вариантов ЕГЭ",
    "теория 1–33 + практика полного формата",
    "один платёж вместо четырёх",
    "экономия 2 770 ₽",
    "доступ навсегда",
  ],

  selfpaced: packageFormatData({
    section: "[03] / ЧТО ТАКОЕ ПАКЕТ",
    countText: "три самостоятельных курса и авторские варианты",
    routeText: "Три курса и 15 авторских вариантов",
    accessText: "После оплаты открываются три курса и отдельный блок авторских вариантов на Stepik. Доступ сохраняется без подписки и продлений.",
  }),

  inside: {
    secNum: "[02] / ЧТО ВХОДИТ",
    title: {
      text: "Четыре курса — вся химия ЕГЭ под ключ.",
      marks: [{ text: "под ключ.", underline: "fuchsia" }],
    } as SectionTitle,
    lead: "Три курса дают теорию, авторские варианты — практику в реальном формате экзамена. Учишь, прорешиваешь, повторяешь — без додумывания, что ещё посмотреть.",
    modules: [
      {
        idx: "// курс 01", pill: "≈30% ЕГЭ", name: "Органика", meta: "25 ч видео · 1065 заданий", href: "/organika/",
        bullets: [
          "Углеводороды: алканы, алкены, алкины, арены",
          "Кислородсодержащие: спирты, альдегиды, кислоты",
          "Азотсодержащие, аминокислоты, белки",
          "Задания 10–16, 24, 32 и 33",
        ],
        priceSeparately: "5 790 ₽",
      },
      {
        idx: "// курс 02", pill: "≈30% ЕГЭ", name: "Неорганика", meta: "26 ч видео · 1085 заданий", href: "/neorganika/",
        bullets: [
          "Свойства оксидов, кислот, оснований, солей",
          "Металлы и неметаллы, электролиз",
          "ОВР и метод электронного баланса",
          "Задания 6–9, 24, 29, 30 и 31",
        ],
        priceSeparately: "5 790 ₽",
      },
      {
        idx: "// курс 03", pill: "≈30% ЕГЭ", name: "Общая", meta: "17 ч видео · 565 заданий", href: "/obschaya/",
        bullets: [
          "Строение атома, периодический закон",
          "Химическая связь и строение вещества",
          "Скорость реакций, химическое равновесие",
          "Расчётные задачи 27–28, термохимия",
        ],
        priceSeparately: "2 390 ₽",
      },
      {
        idx: "// курс 04", pill: "практика", name: "Авторские варианты", meta: "15 вариантов · 650 заданий", href: "https://stepik.org/a/140949?utm_source=cite&utm_medium=package-4",
        bullets: [
          "15 авторских вариантов формата ЕГЭ",
          "650 заданий для экзаменационной практики",
          "Разбор всех 34 заданий по каждому варианту",
          "Тайминг и стратегия распределения сил",
        ],
        priceSeparately: "500 ₽",
      },
    ],
    commonalities: pack3.inside.commonalities.map((item, index) =>
      index === 2
        ? { title: "Один чат на всё", text: "вопросы по трём курсам и вариантам — в одном месте" }
        : item
    ),
  },

  value: {
    secNum: "[05] / ВЫГОДА",
    title: {
      text: "Четыре курса по отдельности — дороже на 2 770 ₽.",
      marks: [{ text: "дороже на 2 770 ₽", underline: "fuchsia" }],
    } as SectionTitle,
    separately: {
      kicker: "// по отдельности",
      rows: [
        { label: "Органика", price: "5 790 ₽" },
        { label: "Неорганика", price: "5 790 ₽" },
        { label: "Общая химия", price: "2 390 ₽" },
        { label: "Авторские варианты", price: "500 ₽" },
      ],
      total: "14 470 ₽",
      footnote: "сумма текущих цен четырёх монокурсов",
    },
    bundle: {
      badge: "ВЫГОДНЕЕ",
      kicker: "// полным пакетом ×4",
      rows: [
        { label: "Орг + Неорг + Общая + АВ", value: "в пакете" },
        { label: "Единый чат поддержки", value: "включён" },
        { label: "Бессрочный доступ к материалам", value: "включён" },
      ],
      total: "11 700 ₽",
      footnote: { html: `один платёж · экономия <span class="text-fuchsia2 font-bold">2 770 ₽</span>` } as RichString,
    },
    callouts: [
      { value: "2 770 ₽" as string | RichString, label: "прямая экономия в пакете", kind: "fuchsia" as const },
      { value: "≈ 8 уроков" as string | RichString, label: "столько стоят 11 700 ₽ у репетитора по 1 500 ₽", kind: "paper" as const },
      {
        value: { html: `4<span class="text-2xl" style="color: rgba(10,10,10,0.4);"> части</span>` } as RichString,
        label: "Т-Банк или Яндекс Сплит на Stepik",
        kind: "paper" as const,
      },
    ],
    cta: { href: "#price", label: "Сэкономить 2 770 ₽" },
  },

  why: {
    secNum: "[06] / ПОЧЕМУ ПАКЕТ",
    title: {
      text: "Три курса теории. Пятнадцать полных вариантов.",
      marks: [{ text: "Пятнадцать полных вариантов.", color: "dim" }],
    } as SectionTitle,
    reasons: [
      {
        kicker: "// 01 · связность", kickerColor: "acid" as const,
        title: "Теория основных разделов и практика вместе",
        text: "Три теоретических курса плюс 15 авторских вариантов и 650 заданий формата ЕГЭ. После теории сразу идёт отработка в нужном формате — учить и тренировать в одном месте.",
      },
      {
        kicker: "// 02 · диагностика", kickerColor: "acid" as const,
        title: "Варианты показывают слабые темы",
        text: "Полная работа связывает разделы между собой и быстро выявляет пробелы. После попытки понятно, к какому уроку вернуться.",
      },
      {
        kicker: "// 03 · стратегия", kickerColor: "acid" as const,
        title: "Тайминг и распределение сил",
        text: "В авторских вариантах разбирается, как распределять время на 34 задания, с чего начинать, что оставлять на потом — то, чему не учат в обычных курсах.",
      },
      {
        kicker: "// 04 · цикл", kickerColor: "fuchsia" as const,
        title: "Один цикл: изучил, проверил, повторил",
        text: "Не нужно отдельно искать теорию и пробники. Курсы дают базу, варианты проверяют результат, а ошибки возвращают к нужным темам.",
      },
    ],
  },

  afterPayment: {
    secNum: "[07] / что будет после оплаты",
    title: {
      text: "Все четыре курса появятся в кабинете. В любом порядке.",
      marks: [
        { text: "Все четыре курса", underline: "fuchsia" as const },
        { text: "В любом порядке.", color: "dim" as const },
      ],
    },
    intro: "Один платёж — три теоретических курса и 15 авторских вариантов в одном аккаунте на Stepik. Можно начать с теории и идти по теме, можно сразу взяться за варианты и подтягивать слабые места. Один логин, один прогресс.",
    steps: [
      {
        code: "01",
        tag: "// оплата",
        title: "Жмёшь «Перейти к оплате»",
        text: "Кнопка ведёт на Stepik с уже применённым промокодом — скидка 5%. Оплата картой, Я.Сплитом или Т-Банком (рассрочка на 4 части под 0%). Чек приходит на почту автоматом.",
      },
      {
        code: "02",
        tag: "// личный кабинет",
        title: "Четыре курса в твоём аккаунте",
        text: "Сразу после оплаты три курса теории + 15 авторских вариантов открываются вместе. Один логин, один прогресс, один общий чат.",
      },
      {
        code: "03",
        tag: "// порядок",
        title: "Проходишь как удобно",
        text: "Параллельно, по очереди или сначала варианты для диагностики — твой темп. Доступ навсегда: возвращайся к материалам в любой момент подготовки.",
      },
    ],
  },

  pricing: {
    secNum: "[08] / ЦЕНА · 2027",
    title: { html: `Вся химия + АВ<br/><span class="text-ink/60">+&nbsp;скидка&nbsp;19%.</span>` } as RichString,
    badge: { html: `ПАКЕТНАЯ ЦЕНА АКТИВНА · ЭКОНОМИЯ <span class="text-acid font-bold">2 770 ₽</span>` } as RichString,
    featured: {
      topStripeLeft: "★ полный пакет · теория + практика ЕГЭ",
      topStripeRight: "4 КУРСА · ОДИН ПЛАТЁЖ",
      code: "[ PACK ×4 · 15 АВ ]",
      skuId: "2027.PACK4",
      title: { html: `Орг + Неорг<br/>+ Общая + АВ.` } as RichString,
      spec: "// 68 ч видео · 3365 заданий · 15 вариантов",
      priceOld: "14 470 ₽",
      priceOldBadge: "−19%",
      priceCurrent: { html: `11&nbsp;700&nbsp;₽` } as RichString,
      perpetualSuffix: "/ навсегда",
      installmentNote: "или оплата частями через Т-Банк / Яндекс Сплит на Stepik",
      savingHighlight: {
        kicker: "// ЭКОНОМИЯ В ПАКЕТЕ",
        sum: { html: `<span class="text-fuchsia2 font-bold">2 770 ₽</span> <span class="text-dim">/ −19%</span>` } as RichString,
        barPercent: 81,
        foot: { html: `Четыре курса по отдельности — <span class="text-paper line-through">14 470 ₽</span>` } as RichString,
      },
      stepik: {
        courseId: "238138",
        promoCode: "90c9f6c96cad6e37",
        utmMedium: "package-pack4",
      } as StepikOffer,
      purchase: {
        payLabel: "Перейти к оплате · скидка 5%",
        viewLabel: "Посмотреть курс на Stepik",
        note: "Итоговая цена с промокодом отобразится на Stepik",
      },
      ctaFootnote: "возврат в течение 14 дней · по правилам Stepik",
      bonuses: [
        { idx: "// ФОРМАТ 01", title: "Весь комплект в одном аккаунте", text: "Три теоретических курса и авторские варианты доступны рядом на Stepik." },
        { idx: "// ПРАКТИКА 02", title: "15 вариантов · 650 заданий", text: "Практика полного формата ЕГЭ, автопроверка и видеоразборы." },
        { idx: "// ДИАГНОСТИКА 03", title: "Пробелы видны по результату", text: "После варианта можно вернуться к нужному разделу и повторить материал." },
        { idx: "// МАТЕРИАЛЫ 04", title: "Файлы для печати", text: "Таблицы, схемы и чек-листы для повторения материала." },
      ],
      featuresKicker: "// что входит в полный пакет",
      features: [
        "3 курса + 15 авторских вариантов",
        "68 часов видео",
        "3365 заданий суммарно",
        "Теория для заданий 1–33",
        "Практика полного формата ЕГЭ",
        "Таблицы, схемы и чек-листы",
      ],
    },
    secondary: [
      {
        idx: "[ ОРГАНИКА · соло ]", idxColor: "paper" as const,
        hoverHint: "1 курс отдельно ·",
        title: "Только органика →",
        meta: "// ≈30% ЕГЭ · 1065 заданий",
        priceNew: "5 790 ₽", priceOld: "7 490 ₽", saving: "−1 700 ₽",
        href: "/organika/",
        paymentUrl: "https://stepik.org/a/196367/pay?promo=74e5757035325913&utm_source=cite&utm_medium=package-pack4&utm_campaign=5%25",
        borderHoverClass: "hover:border-paper",
      },
      {
        idx: "[ PACK ×3 · ЗАДАНИЯ 1–33 ]", idxColor: "fuchsia" as const,
        hoverHint: "без авторских вариантов ·",
        title: "Пакет ×3 без АВ →",
        meta: "// 3 курса теории, без вариантов",
        priceNew: "11 300 ₽", priceOld: "13 970 ₽", saving: "−2 670 ₽",
        href: "/paket-3-kursa/",
        paymentUrl: "https://stepik.org/a/238138/pay?promo=90c9f6c96cad6e37&utm_source=cite&utm_medium=package-pack3&utm_campaign=5%25",
        borderHoverClass: "hover:border-fuchsia2",
      },
    ],
    facts: [
      { idx: "// ФАКТ 01", title: "Курсы работают на Stepik", text: "Можно заниматься в браузере или мобильном приложении для iOS и Android.", bgClass: "bg-paper", kickerColorClass: "text-ink/60", textColorClass: "text-ink/70" },
      { idx: "// ФАКТ 02", title: "Прогресс сохраняется", text: "Продолжай обучение с другого устройства с того места, на котором остановился.", bgClass: "bg-paper", kickerColorClass: "text-ink/60", textColorClass: "text-ink/70" },
      { idx: "// ФАКТ 03", title: "Вопрос можно задать по теме", text: "Поддержка доступна под уроками Stepik и в общем чате по материалам пакета.", bgClass: "bg-paper", kickerColorClass: "text-ink/60", textColorClass: "text-ink/70" },
    ],
  },

  faq: {
    secNum: "[09] / FAQ",
    title: { text: "Вопросы про полный пакет.", marks: [{ text: "полный пакет.", underline: "fuchsia" }] } as SectionTitle,
    lead: "Полный пакет — три теоретических курса плюс 15 авторских вариантов и 650 заданий в формате ЕГЭ. Если что-то не нашёл — напиши в поддержку.",
    items: [
      { q: "Что такое «авторские варианты ЕГЭ»?", a: "15 вариантов формата ЕГЭ, собранных Валерием: суммарно 650 заданий для экзаменационной практики. Варианты помогают отработать тайминг, увидеть ловушки и привыкнуть к сочетанию тем в полной работе." },
      { q: "Чем отличается от пакета ×3?", a: "В ×3 — только теоретические курсы (Орг + Неорг + Общая). В ×4 добавлены 15 авторских вариантов и 650 заданий для практики в формате экзамена." },
      { q: "Что значит «доступ навсегда»?", a: "После оплаты доступ к приобретённым материалам сохраняется без ограничения по времени. Подписки и обязательных продлений нет." },
      { q: "Можно ли купить в рассрочку?", a: "На Stepik доступна оплата частями через Т-Банк или Яндекс Сплит. Доступные сроки и суммы отображаются непосредственно во время оплаты." },
      { q: "Что если не подойдёт?", a: "Возврат можно оформить в течение 14 дней после покупки по действующим правилам Stepik." },
      { q: "На какой платформе курсы и варианты?", a: "Курсы и авторские варианты размещены на Stepik. Доступны автопроверка, видеоразборы и приложение для iOS / Android." },
      { q: "Когда начинать решать варианты?", a: "Авторские варианты разработаны для финального этапа подготовки — после прохождения теории. Если идёшь параллельно — лучше начать с теории, варианты подключить за 2–3 месяца до экзамена." },
    ],
  },

  finalCta: {
    kicker: "// последний шаг",
    title: { html: `Забери <span class="text-fuchsia2">всю подготовку</span><br/><span class="text-dim">— одним платежом.</span>` } as RichString,
    ctaPrimary: { href: "#price", label: "Купить полный пакет за 11 700 ₽" },
    ctaSecondary: { href: "#inside", label: "↑ что внутри" },
  },
};
