/**
 * seoData.ts — единый источник данных для SEO и JSON-LD
 * 
 * Централизованное хранение данных организации, социальных сетей и SEO-констант.
 * Используется в MainLayout и ArticleLayout для генерации JSON-LD.
 */

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
 * Утилита для абсолютизации URL
 */
export function absAsset(origin: string, path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? path : "/" + path}`;
}

