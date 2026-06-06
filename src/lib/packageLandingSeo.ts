import type { PackageData } from "../data/packageLanding";

const SITE_URL = "https://egehim.ru";
const BRAND_NAME = "ЕГЭХИМ";

export function buildPackageLandingSeo(data: PackageData) {
  const url = data.seo.url;
  const image = new URL(data.seo.image, SITE_URL).href;
  const organizationId = `${SITE_URL}/#organization`;
  const webPageId = `${url}#webpage`;
  const courseId = `${url}#course`;
  const productId = `${url}#product`;
  const offerId = `${url}#offer`;
  const faqId = `${url}#faq`;

  const breadcrumbs = [
    { name: "Все курсы", href: "/allcourses/" },
    { name: data.seo.breadcrumbName },
  ];

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": courseId,
    name: data.seo.productName,
    description: data.seo.description,
    url,
    image,
    inLanguage: "ru-RU",
    educationalLevel: "Подготовка к ЕГЭ",
    isAccessibleForFree: false,
    provider: {
      "@type": "Organization",
      "@id": organizationId,
      name: BRAND_NAME,
      url: SITE_URL,
    },
    offers: { "@id": offerId },
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productId,
    name: data.seo.productName,
    description: data.seo.description,
    url,
    image,
    sku: data.pricing.featured.skuId,
    category: "Онлайн-курсы подготовки к ЕГЭ по химии",
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    offers: {
      "@type": "Offer",
      "@id": offerId,
      url,
      price: data.seo.price,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        "@id": organizationId,
        name: BRAND_NAME,
      },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": faqId,
    url: `${url}#faq`,
    mainEntity: data.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": webPageId,
    name: data.seo.title,
    description: data.seo.description,
    url,
    image,
    inLanguage: "ru-RU",
    isPartOf: {
      "@type": "WebSite",
      name: BRAND_NAME,
      url: SITE_URL,
    },
    about: { "@id": courseId },
    mainEntity: [{ "@id": courseId }, { "@id": productId }, { "@id": faqId }],
  };

  return {
    breadcrumbs,
    courseJsonLd,
    productJsonLd,
    faqJsonLd,
    webPageJsonLd,
  };
}
