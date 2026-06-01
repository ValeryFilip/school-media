import { slugify } from "./slugify";
import { ACADEMY_BASE_PATH, academyArticlePath } from "./academyPaths";

export const toDate = (v: any): Date => (v instanceof Date ? v : new Date(v));
const pad = (n: number) => String(n).padStart(2, "0");
export const fmtShort = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`;
export const fmtFull = (d: Date) =>
  `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
export const readMins = (p: any): number => p.data.readingTime ?? 8;

export interface AcademyArticle {
  href: string;
  category: string;
  date: string;
  dateISO: string;
  mins: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

/** Канонический объект карточки статьи для всех страниц академии. */
export function articleCard(p: any, basePath = "/academy"): AcademyArticle {
  const d = toDate(p.data.date);
  const category = String(p.data.category || "");
  return {
    href:
      basePath === ACADEMY_BASE_PATH
        ? academyArticlePath(category, p.slug)
        : `${basePath}/${slugify(category)}/${p.slug}/`,
    category,
    date: fmtShort(d),
    dateISO: d.toISOString(),
    mins: readMins(p),
    title: p.data.title,
    description: p.data.description ?? "",
    image: p.data.image ?? "",
    tags: Array.isArray(p.data.tags) ? p.data.tags.map(String) : [],
  };
}
