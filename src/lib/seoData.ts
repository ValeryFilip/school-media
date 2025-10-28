/**
 * seoData.ts — единый источник данных для SEO и JSON-LD
 * 
 * Централизованное хранение данных организации, социальных сетей и SEO-констант.
 * Используется в MainLayout и ArticleLayout для генерации JSON-LD.
 */

// ===== ТИПЫ JSON-LD =====

export interface ArticleData {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  image?: {
    "@type": "ImageObject";
    url: string;
    height?: string;
    width?: string;
  };
  author: {
    "@type": "Person";
    name: string;
    url?: string;
    image?: string;
    jobTitle?: string;
    worksFor?: {
      "@type": "Organization";
      name: string;
    };
  };
  publisher:
    | {
        "@id": string; // ссылка на Organization через @id
      }
    | {
        "@type": "Organization";
        name: string;
        url?: string;
        logo: {
          "@type": "ImageObject";
          url: string;
          width?: string;
          height?: string;
        };
        description?: string;
        contactPoint?: {
          "@type": "ContactPoint";
          contactType?: string;
          url?: string;
        };
        sameAs?: string[];
      };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id"?: string;
  };
  articleBody?: string;
  keywords?: string[];
  articleSection?: string;
  inLanguage?: string;
  url?: string;
}

export interface OrganizationData {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id"?: string; // для поддержки ссылок между JSON-LD объектами
  name: string;
  url: string;
  logo: {
    "@type": "ImageObject";
    url: string;
    width?: string;
    height?: string;
  };
  description?: string;
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    contactType?: string;
    url?: string;
  };
  sameAs?: string[];
}

export interface WebSiteData {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  inLanguage?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface BreadcrumbData {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export interface PersonData {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  worksFor?: {
    "@type": "Organization";
    name: string;
  };
}

export type JsonLdData = ArticleData | OrganizationData | WebSiteData | BreadcrumbData | PersonData;
export type JsonLdType = "article" | "organization" | "website" | "breadcrumb" | "person";

// ===== КОНСТАНТЫ =====

export const ORGANIZATION_DATA = {
  name: "EGEHIM",
  description: "Подготовка к ЕГЭ по химии: курсы, разборы и материалы",
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
  return prop || configSiteName || ORGANIZATION_DATA.name || "EGEHIM";
}

/**
 * Форматирует JSON-LD для читаемости
 */
export function formatJsonLd(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

// ===== ГЕНЕРАТОРЫ JSON-LD =====

/**
 * Генерирует JSON-LD для Organization
 * Используется в MainLayout
 */
export function buildOrganizationJsonLd(origin: string) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Organization" as const,
    "@id": `${origin}/#organization`,
    name: ORGANIZATION_DATA.name,
    url: origin,
    description: ORGANIZATION_DATA.description,
    logo: {
      "@type": "ImageObject" as const,
      url: `${origin}${ORGANIZATION_DATA.logo.path}`,
      width: ORGANIZATION_DATA.logo.width,
      height: ORGANIZATION_DATA.logo.height,
    },
    contactPoint: {
      "@type": "ContactPoint" as const,
      contactType: ORGANIZATION_DATA.contact.type,
      url: `${origin}${ORGANIZATION_DATA.contact.path}`,
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
 * Используется в MainLayout
 */
export function buildWebSiteJsonLd(origin: string, siteName: string) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "WebSite" as const,
    name: siteName,
    url: origin,
    description: ORGANIZATION_DATA.description,
    inLanguage: "ru" as const,
  };
}

/**
 * Генерирует упрощенный объект publisher для Article JSON-LD
 * Ссылается на Organization через @id вместо дублирования данных
 */
export function buildArticlePublisher(origin: string) {
  return {
    "@id": `${origin}/#organization`,
  };
}

/**
 * Генерирует JSON-LD для BreadcrumbList
 * Используется в MainLayout
 */
export function buildBreadcrumbsJsonLd(
  origin: string, 
  siteName: string, 
  breadcrumbs: Array<{ name: string; href?: string }>,
  inMedia: boolean = false,
  currentPath?: string
): BreadcrumbData {
  const homeHref = inMedia ? `${origin}/media/` : `${origin}/`;
  const renderedCrumbs = [{ name: "home-icon", href: homeHref }, ...breadcrumbs];
  
  return {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    "itemListElement": renderedCrumbs.map((c, i) => ({
      "@type": "ListItem" as const,
      "position": i + 1,
      "name": c.name === "home-icon" ? siteName : c.name,
      "item": c.href ? `${origin}${c.href}` : `${origin}${currentPath || ""}`
    }))
  };
}

/**
 * Утилита для абсолютизации URL (legacy, используйте absUrl)
 * @deprecated Используйте absUrl вместо этой функции
 */
export function absAsset(origin: string, path?: string | null): string | undefined {
  return absUrl(origin, path);
}

