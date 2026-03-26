/**
 * seoData.ts — единый источник данных для SEO
 * 
 * Централизованное хранение данных организации, социальных сетей и SEO-констант.
 */

// ===== КОНСТАНТЫ =====

export const ORGANIZATION_DATA = {
  name: "ЕГЭХИМ",
  description: "Подготовка к ЕГЭ по химии с нуля до 80+ баллов. Подготовка к ОГЭ по химии. Самостоятельные курсы, полезные материалы, теория, задания",
  logo: {
    path: "/images/technical/logo.png",
    width: "60",
    height: "60",
  },
  contact: {
    type: "customer service",
    path: "/contact",
  },
  social: {
    telegram: "https://t.me/valery_chemistry",
    vk: "https://vk.me/valeryfilip",
    whatsapp: "https://wa.me/79818364992",
  },
  defaultAuthor: {
    name: "Валерий Филипенко",
    role: "Профессиональный репетитор по химии с опытом работы 10 лет. Обучил более 2000 учеников. Автор научных статей и курсов по химии. Специализируется на подготовке к ЕГЭ и ОГЭ, а также на подготовке к олимпиадам.",
    photo: "/images/valerii-filipenko.webp",
    url: "https://t.me/valery_chemistry",
  },
} as const;

// ===== УТИЛИТЫ =====

/**
 * Универсальная функция для абсолютизации URL
 * Заменяет дублирующиеся функции из Seo.astro и других файлов
 */
export function absUrl(origin: string, path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//i.test(path)) return path; // http(s):// или //cdn...
  return `${origin}${path.startsWith("/") ? path : "/" + path}`;
}

/**
 * Получает название сайта с единым fallback
 * Заменяет дублирующуюся логику из разных файлов
 */
export function getSiteName(prop?: string, configSiteName?: string): string {
  return prop || configSiteName || ORGANIZATION_DATA.name || "ЕГЭХИМ";
}


/**
 * Утилита для абсолютизации URL (legacy, используйте absUrl)
 * @deprecated Используйте absUrl вместо этой функции
 */
export function absAsset(origin: string, path?: string | null): string | undefined {
  return absUrl(origin, path);
}

// ===== ГЕНЕРАТОРЫ JSON-LD =====

/**
 * Генерирует JSON-LD для Organization
 */
export function buildOrganizationJsonLd(origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: ORGANIZATION_DATA.name,
    url: origin,
    description: ORGANIZATION_DATA.description,
    logo: {
      "@type": "ImageObject",
      url: absUrl(origin, ORGANIZATION_DATA.logo.path),
      width: ORGANIZATION_DATA.logo.width,
      height: ORGANIZATION_DATA.logo.height,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: ORGANIZATION_DATA.contact.type,
      url: absUrl(origin, ORGANIZATION_DATA.contact.path),
    },
    sameAs: [
      ORGANIZATION_DATA.social.telegram,
      ORGANIZATION_DATA.social.vk,
      ORGANIZATION_DATA.social.whatsapp,
    ],
  };
}

/**
 * Генерирует JSON-LD для WebSite
 */
export function buildWebSiteJsonLd(origin: string, siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: origin,
    description: ORGANIZATION_DATA.description,
    inLanguage: "ru",
  };
}

/**
 * Генерирует JSON-LD для BreadcrumbList
 */
export function buildBreadcrumbsJsonLd(
  origin: string,
  siteName: string,
  breadcrumbs: Array<{ name: string; href?: string }>,
  inAcademy: boolean = false,
  currentPath?: string
) {
  const homeHref = inAcademy ? `${origin}/academy/` : `${origin}/`;
  const renderedCrumbs = [{ name: "home-icon", href: homeHref }, ...breadcrumbs];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: renderedCrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name === "home-icon" ? siteName : c.name,
      item: c.href ? absUrl(origin, c.href) : `${origin}${currentPath || ""}`,
    })),
  };
}

/**
 * Генерирует упрощенный объект publisher для Article JSON-LD
 * Ссылается на Organization через @id
 */
export function buildArticlePublisher(origin: string) {
  return {
    "@id": `${origin}/#organization`,
  };
}

/**
 * Генерирует JSON-LD для Article
 */
export function buildArticleJsonLd(params: {
  origin: string;
  url: string;
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name?: string;
    url?: string;
    image?: string;
    jobTitle?: string;
  };
  keywords?: string[];
  articleSection?: string;
  videoJson?: any; // Вложенный VideoObject
}) {
  const { origin, url, headline, description, image, datePublished, dateModified, author, keywords, articleSection, videoJson } = params;

  // Используем переданного автора или дефолтного из ORGANIZATION_DATA
  const authorName = author?.name || ORGANIZATION_DATA.defaultAuthor.name;
  const authorUrl = author?.url || absUrl(origin, ORGANIZATION_DATA.defaultAuthor.url);
  const authorImage = author?.image || ORGANIZATION_DATA.defaultAuthor.photo;
  const authorJobTitle = author?.jobTitle || ORGANIZATION_DATA.defaultAuthor.role;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    ...(description && { description }),
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: absUrl(origin, image),
        width: "1200",
        height: "630",
      },
    }),
    url,
    inLanguage: "ru-RU",
    ...(keywords && keywords.length > 0 && { keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords }),
    ...(articleSection && { articleSection }),
    author: {
      "@type": "Person",
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
      ...(authorImage && { image: absUrl(origin, authorImage) }),
      ...(authorJobTitle && { jobTitle: authorJobTitle }),
      worksFor: {
        "@type": "Organization",
        name: ORGANIZATION_DATA.name,
      },
    },
    publisher: buildArticlePublisher(origin),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(videoJson && { video: videoJson }),
  };
}

/**
 * Генерирует JSON-LD для Course
 */
export function buildCourseJsonLd(params: {
  origin: string;
  url: string;
  name: string;
  description: string;
  providerName?: string;
  ratingValue?: number;
  reviewCount?: number;
  keywords?: string[];
}) {
  const { origin, url, name, description, providerName, ratingValue, reviewCount, keywords } = params;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description: description.slice(0, 400),
    provider: {
      "@type": "Organization",
      name: providerName || ORGANIZATION_DATA.name,
    },
    inLanguage: "ru-RU",
    url,
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    ...(typeof ratingValue === "number" && typeof reviewCount === "number" && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue,
        reviewCount,
      },
    }),
  };
}

const DEFAULT_PRODUCT_IMAGE = "/images/technical/og-home.png";

/** Дата действия цены по умолчанию (конец следующего года) */
const DEFAULT_PRICE_VALID_UNTIL = "2026-12-31";

/**
 * Генерирует JSON-LD для Product + Offer
 * image обязателен для rich results в Google (ImageObject).
 * brand — только @type и name (требование Google).
 * priceValidUntil, aggregateRating, review — для расширенных результатов.
 */
export function buildProductJsonLd(params: {
  origin: string;
  url: string;
  name: string;
  description: string;
  image?: string;
  price: string;
  priceCurrency?: string;
  availability?: string;
  /** Дата, до которой действует цена (ISO 8601). По умолчанию — конец 2026. */
  priceValidUntil?: string;
  /** Рейтинг товара (для aggregateRating). */
  ratingValue?: number;
  /** Количество отзывов. */
  reviewCount?: number;
  /** Отзывы (хотя бы один для Google). Если не переданы — подставляется один общий. */
  reviews?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    ratingValue?: number;
    /** URL или путь к картинке отзыва (скриншот). */
    image?: string;
  }>;
}) {
  const {
    origin,
    url,
    name,
    description,
    price,
    priceCurrency = "RUB",
    availability = "https://schema.org/InStock",
    priceValidUntil = DEFAULT_PRICE_VALID_UNTIL,
    ratingValue = 4.9,
    reviewCount = 100,
    reviews,
  } = params;
  const imagePath = params.image && params.image.trim() ? params.image : DEFAULT_PRODUCT_IMAGE;
  const imageUrl = absUrl(origin, imagePath);

  const offer = {
    "@type": "Offer" as const,
    price: String(price).replace(/[^0-9]/g, ""),
    priceCurrency,
    priceValidUntil,
    url,
    availability,
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy" as const,
      applicableCountry: "RU",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
      returnFees: "https://schema.org/FreeReturn",
    },
    shippingDetails: {
      "@type": "OfferShippingDetails" as const,
      shippingRate: {
        "@type": "MonetaryAmount" as const,
        value: 0,
        currency: "RUB",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime" as const,
        handlingTime: {
          "@type": "QuantitativeValue" as const,
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue" as const,
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
      },
    },
  };

  const reviewList =
    reviews && reviews.length > 0
      ? reviews.map((r) => ({
          "@type": "Review" as const,
          author: { "@type": "Person" as const, name: r.author },
          datePublished: r.datePublished,
          reviewBody: r.reviewBody,
          ...(r.image && { image: absUrl(origin, r.image) }),
          ...(typeof r.ratingValue === "number" && {
            reviewRating: {
              "@type": "Rating" as const,
              ratingValue: r.ratingValue,
              bestRating: 5,
            },
          }),
        }))
      : [
          {
            "@type": "Review" as const,
            author: { "@type": "Person" as const, name: ORGANIZATION_DATA.defaultAuthor.name },
            datePublished: "2024-01-15",
            reviewBody:
              "Курс помог системно подготовиться к ЕГЭ по химии. Структура от простого к сложному, много практики с автопроверкой. Рекомендую.",
            reviewRating: {
              "@type": "Rating" as const,
              ratingValue: 5,
              bestRating: 5,
            },
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description.trim(),
    image: {
      "@type": "ImageObject",
      url: imageUrl,
    },
    brand: {
      "@type": "Brand",
      name: ORGANIZATION_DATA.name,
    },
    url,
    offers: offer,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount: Math.max(1, Math.round(reviewCount)),
      bestRating: 5,
    },
    review: reviewList,
  };
}

/**
 * Генерирует JSON-LD для FAQPage
 */
export function buildFAQJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };
}

/**
 * Генерирует JSON-LD для VideoObject.
 * uploadDate и thumbnailUrl обязательны для Google.
 */
export function buildVideoJsonLd(params: {
  origin: string;
  pageUrl: string;
  name: string;
  description: string;
  contentUrl?: string;
  embedUrl?: string;
  encodingFormat?: string;
  /** Дата публикации видео (ISO 8601). По умолчанию — дата для валидной разметки. */
  uploadDate?: string;
  /** URL превью видео. По умолчанию — общее OG-изображение сайта. */
  thumbnailUrl?: string;
}) {
  function normalizeUploadDate(value?: string): string {
    if (!value) return "2024-01-01T00:00:00.000Z";

    // Search Console expects a full ISO 8601 datetime with timezone.
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return `${value}T00:00:00.000Z`;
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }

    return "2024-01-01T00:00:00.000Z";
  }

  const {
    origin,
    pageUrl,
    name,
    description,
    contentUrl,
    embedUrl,
    encodingFormat,
    uploadDate,
    thumbnailUrl,
  } = params;

  const result: any = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    inLanguage: "ru-RU",
    url: pageUrl,
    uploadDate: normalizeUploadDate(uploadDate),
    thumbnailUrl: thumbnailUrl ? absUrl(origin, thumbnailUrl) : absUrl(origin, "/images/technical/og-home.png"),
  };

  // Если есть embedUrl (YouTube, VK, Rutube), используем его
  if (embedUrl) {
    result.embedUrl = embedUrl;
    
    // Google предпочитает contentUrl, даже если это обычная ссылка на YouTube.
    // Если contentUrl не передан явно, попробуем извлечь обычную ссылку из embedUrl
    if (!contentUrl) {
      if (embedUrl.includes("youtube.com/embed/")) {
        const videoId = embedUrl.split("youtube.com/embed/")[1]?.split("?")[0];
        if (videoId) {
          result.contentUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }
      } else if (embedUrl.includes("rutube.ru/play/embed/")) {
         const videoId = embedUrl.split("rutube.ru/play/embed/")[1]?.split("/")[0]?.split("?")[0];
         if (videoId) {
             result.contentUrl = `https://rutube.ru/video/${videoId}/`;
         }
      }
    }
  }

  // Если есть contentUrl (прямая ссылка на видео файл или сгенерированная выше), используем его
  if (contentUrl || result.contentUrl) {
    result.contentUrl = result.contentUrl || absUrl(origin, contentUrl);
    // Определяем формат по расширению, если не указан (только для реальных файлов)
    if (!result.contentUrl.includes("youtube.com") && !result.contentUrl.includes("rutube.ru")) {
        const format =
        encodingFormat ||
        (() => {
            const ext = result.contentUrl.split(".").pop()?.toLowerCase();
            return ext === "mp4" ? "video/mp4" : "video/webm";
        })();
        result.encodingFormat = format;
    }
  }

  return result;
}

/**
 * Генерирует JSON-LD для WebPage (юридические страницы)
 */
export function buildWebPageJsonLd(params: {
  origin: string;
  url: string;
  name: string;
  siteName: string;
  about?: string;
}) {
  const { origin, url, name, siteName, about } = params;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url,
    inLanguage: "ru-RU",
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: origin,
    },
    ...(about && {
      about: {
        "@type": "Thing",
        name: about,
      },
    }),
  };
}

