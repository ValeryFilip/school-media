// src/config.ts
export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  description: string;
  author: string;
}

const config: SiteConfig = {
  siteName: 'ЕГЭХИМ',
  siteUrl: 'https://egehim.ru',
  description: 'SEO-дружественное медиа на Astro + Node.js',
  author: 'Редакция',
};

export default config;
