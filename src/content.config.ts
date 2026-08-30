import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// TAG RULES (locked):
// - tags[0] = section: "Destinations" | "Guides" | "Books" — decides
//   which listing page / homepage row the article appears under.
// - tags[1] = always shown on the card, in every section.
// - tags[2] = shown on the card ONLY for Destinations and Guides
//   (ignored on Books cards).
// - ALL tags (any length) are matched against in global search.
// - Search results page shows tags[0] on the card too, everywhere else
//   tags[0] is hidden.

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string(),
    author: z.string().default('World Travel Picks'),
    publishDate: z.date(),
    readTime: z.string(),
    tags: z.array(z.string()).min(2),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  articles,
  pages,
};