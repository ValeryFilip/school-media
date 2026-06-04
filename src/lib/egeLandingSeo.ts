import {
  buildCourseJsonLd,
  buildFAQJsonLd,
  buildProductJsonLd,
  pageUrlFromPath,
} from "./seoData";

type LandingData = {
  pricing?: {
    featured?: {
      title?: string;
      price?: string;
    };
  };
  runtime?: {
    faq?: Array<{ q: string; a: string }>;
  };
};

export const egeLandingFaqItems = [
  {
    q: "Я учусь в 10 классе и пока ничего не понимаю. Этот курс не для отличников?",
    a: "Нет. На курс приходят и&nbsp;с нуля. Мы подбираем группу под стартовый уровень и&nbsp;темп ученика: сначала закрываем базу, потом постепенно выходим на формат ЕГЭ.",
  },
  {
    q: "Что если я не потяну темп?",
    a: "Подберём группу под твой начальный уровень и&nbsp;темп. Если пропустил тему, можно догнать по записи, домашке и&nbsp;разбору на следующем занятии.",
  },
  {
    q: "Сколько часов в неделю реально нужно?",
    a: "2 урока по&nbsp;90&nbsp;минут + 4-7 часов на&nbsp;домашку. Итого примерно 7-10 часов в&nbsp;неделю, если хочешь видеть рост не&nbsp;в конспектах, а&nbsp;в баллах.",
  },
  {
    q: "Можно перейти с группового на индивидуальный посреди курса?",
    a: "Да, в&nbsp;любой момент. Пересчитываем оплату пропорционально дням и&nbsp;переводим в&nbsp;течение 24&nbsp;часов.",
  },
  {
    q: "Что если ЕГЭ изменится в 2027?",
    a: "Валерий и&nbsp;методист обновляют программу под актуальный кодификатор и&nbsp;спецификацию ФИПИ. Если меняются формулировки или акценты, это попадает в&nbsp;уроки и&nbsp;домашку.",
  },
  {
    q: "А деньги вернёте, если не понравится?",
    a: "В&nbsp;первые 14&nbsp;дней вернём деньги за&nbsp;непосещённые занятия. Гарантий конкретного балла не&nbsp;даём: результат зависит от посещаемости, домашки и&nbsp;системной работы.",
  },
  {
    q: "Родители смогут видеть, что происходит с подготовкой?",
    a: "Да. У&nbsp;родителей будет доступ к&nbsp;личному кабинету: видно занятия, домашку, активность и&nbsp;результаты пробников. Раз в&nbsp;месяц Валерий лично рассказывает об&nbsp;успехах и&nbsp;проблемах.",
  },
  {
    q: "Кто ведёт занятия?",
    a: "Занятия ведёт Валерий Филипенко. Это не&nbsp;сетка преподавателей и&nbsp;не поток случайных кураторов: один автор отвечает за программу, уроки и&nbsp;методику курса.",
  },
];

function text(value?: string): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildEgeLandingSeoSchemas(params: {
  origin: string;
  pathname: string;
  data: LandingData;
  name: string;
  description: string;
  image?: string;
  keywords?: string[];
  faqItems?: Array<{ q: string; a: string }>;
}) {
  const { origin, pathname, data, name, description, image, keywords } = params;
  const url = pageUrlFromPath(origin, pathname);
  const featured = data.pricing?.featured ?? {};
  const price = text(featured.price) || "0";
  const productName = text(featured.title)
    ? `${name}: ${text(featured.title)}`
    : name;
  const faqItems = params.faqItems ?? data.runtime?.faq ?? egeLandingFaqItems;

  return {
    courseJsonLd: buildCourseJsonLd({
      origin,
      url,
      name,
      description,
      ratingValue: 4.9,
      reviewCount: 100,
      keywords,
    }),
    productJsonLd: buildProductJsonLd({
      origin,
      url,
      name: productName,
      description,
      image,
      price,
      priceCurrency: "RUB",
    }),
    faqJsonLd: buildFAQJsonLd(faqItems),
  };
}
