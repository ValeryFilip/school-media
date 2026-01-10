import type { CollectionEntry } from "astro:content";
import { calcReadingTime } from "./calcReadingTime";

export type ArticleWithReadingTime =
  CollectionEntry<"articles"> & {
    data: CollectionEntry<"articles">["data"] & {
      readingTime: number;
    };
  };

export function withReadingTime(
  entries: CollectionEntry<"articles">[]
): ArticleWithReadingTime[] {
  return entries.map((entry) => ({
    ...entry,
    data: {
      ...entry.data,
      readingTime: calcReadingTime(entry.body),
    },
  }));
}
