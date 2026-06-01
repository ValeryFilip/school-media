import { slugify } from "./slugify";

export const ACADEMY_BASE_PATH = "/academy-v2";

export function academyPath(path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${ACADEMY_BASE_PATH}${normalized === "/" ? "/" : normalized}`;
}

export function academyCategoryPath(category: string): string {
  return academyPath(`/${slugify(category)}/`);
}

export function academyArticlePath(category: string, slug: string): string {
  return academyPath(`/${slugify(category)}/${slug}/`);
}

export function academyTagPath(tag: string): string {
  return academyPath(`/tags/${slugify(tag)}/`);
}

export function academyArticlesPath(page?: number): string {
  const href = academyPath("/articles/");
  return page && page > 1 ? `${href}?page=${page}` : href;
}
