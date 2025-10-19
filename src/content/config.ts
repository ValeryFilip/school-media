// src/content/config.ts
import { defineCollection, z } from "astro:content";

const articles = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        date: z.date(),
        description: z.string().optional(),
        tags: z.array(z.string()).default([]),
        category: z.string(),
        image: z.string().optional(),       // квадрат 300x300 в intro
        author: z.string().optional(),
        authorRole: z.string().optional(),  // должность/роль автора
        authorImage: z.string().optional(), // аватар автора
        readingTime: z.string().optional(),
        articleBody: z.string().optional(), // полный текст статьи для JSON-LD
    }),
});

export const collections = { articles };
