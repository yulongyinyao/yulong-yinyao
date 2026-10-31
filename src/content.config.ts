import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  ILLUSTRATION_CATEGORY_SLUGS,
  POST_CATEGORY_SLUGS,
} from './data/categories';

/** Accept both YAML date objects and plain YYYY-MM-DD strings. */
const dateValue = z
  .union([z.string(), z.date()])
  .transform((value) => {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return value.slice(0, 10);
  })
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: '日期必须是 YYYY-MM-DD 格式',
  });

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: dateValue,
    category: z.enum(POST_CATEGORY_SLUGS),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const illustrations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/illustrations' }),
  schema: z.object({
    title: z.string(),
    date: dateValue,
    category: z.enum(ILLUSTRATION_CATEGORY_SLUGS),
    tags: z.array(z.string()).default([]),
    images: z.array(z.string()).min(1),
    description: z.string().default(''),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, illustrations };
