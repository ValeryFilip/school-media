// src/content/config.ts
import { defineCollection, z } from "astro:content";

const articles = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        date: z.date(),
        updated: z.string().optional(), // дата последнего редактирования (YYYY-MM-DD), проставляется автоматически git-хуком
        description: z.string().optional(),
        tags: z.array(z.string()).default([]),
        category: z.string(),
        image: z.string().optional(),       // квадрат 300x300 в intro
        readingTime: z.number().int().positive().optional(),
        toc: z.boolean().optional(),        // показывать/скрывать содержание статьи (по умолчанию true)
        tocManual: z.array(z.object({       // ручное содержание (опционально, если нужно переопределить автоматическое)
            id: z.string().optional(),
            text: z.string(),
        })).optional(),
        videoUrl: z.string().optional(),       // URL видео для VideoObject JSON-LD (YouTube, VK, Rutube)
        visible: z.boolean().default(true),    // видимость статьи (true - опубликована, false - черновик)
    }),
});

export const collections = { articles };
