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
        toc: z.boolean().optional(),        // показывать/скрывать содержание статьи (по умолчанию true)
        tocManual: z.array(z.object({       // ручное содержание (опционально, если нужно переопределить автоматическое)
            id: z.string().optional(),
            text: z.string(),
        })).optional(),
        showHeroImage: z.boolean().optional(), // показывать/скрывать главную картинку статьи (по умолчанию true)
        videoUrl: z.string().optional(),       // URL видео для VideoObject JSON-LD (YouTube, VK, Rutube)
    }),
});

export const collections = { articles };
