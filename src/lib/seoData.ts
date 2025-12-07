/**
 * seoData.ts — единый источник данных для SEO
 * 
 * Централизованное хранение данных организации, социальных сетей и SEO-констант.
 */

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
 * Утилита для абсолютизации URL (legacy, используйте absUrl)
 * @deprecated Используйте absUrl вместо этой функции
 */
export function absAsset(origin: string, path?: string | null): string | undefined {
  return absUrl(origin, path);
}

