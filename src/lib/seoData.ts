/**
 * seoData.ts — единый источник данных для SEO
 * 
 * Централизованное хранение данных организации, социальных сетей и SEO-констант.
 */

// ===== КОНСТАНТЫ =====

export const ORGANIZATION_DATA = {
  name: "Химия ЕГЭ с Валерием Филипенко",
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
    role: "Профессиональный химик, преподаватель, эксперт ЕГЭ, автор ЕГЭ-курсов, репетитор со стажем больше 10 лет.",
    photo: "/images/stepik/researcher.webp",
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
  return prop || configSiteName || ORGANIZATION_DATA.name || "Химия ЕГЭ с Валерием Филипенко";
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
}) {
  const { origin, url, headline, description, image, datePublished, dateModified, author, keywords, articleSection } = params;

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

/**
 * Генерирует JSON-LD для Product + Offer
 */
export function buildProductJsonLd(params: {
  origin: string;
  url: string;
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  availability?: string;
}) {
  const { origin, url, name, description, price, priceCurrency = "RUB", availability = "https://schema.org/InStock" } = params;
  
  // Извлекаем только цифры из цены
  const priceNumber = String(price).replace(/[^0-9]/g, "");

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description.trim(),
    brand: {
      "@type": "Organization",
      name: ORGANIZATION_DATA.name,
    },
    url,
    offers: {
      "@type": "Offer",
      price: priceNumber,
      priceCurrency,
      url,
      availability,
    },
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
 * Генерирует JSON-LD для VideoObject
 */
export function buildVideoJsonLd(params: {
  origin: string;
  pageUrl: string;
  name: string;
  description: string;
  contentUrl?: string;
  embedUrl?: string;
  encodingFormat?: string;
}) {
  const { origin, pageUrl, name, description, contentUrl, embedUrl, encodingFormat } = params;
  
  const result: any = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    inLanguage: "ru-RU",
    url: pageUrl,
  };

  // Если есть embedUrl (YouTube, VK, Rutube), используем его
  if (embedUrl) {
    result.embedUrl = embedUrl;
  }

  // Если есть contentUrl (прямая ссылка на видео файл), используем его
  if (contentUrl) {
    result.contentUrl = absUrl(origin, contentUrl);
    // Определяем формат по расширению, если не указан
    const format = encodingFormat || (() => {
      const ext = contentUrl.split(".").pop()?.toLowerCase();
      return ext === "mp4" ? "video/mp4" : "video/webm";
    })();
    result.encodingFormat = format;
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

