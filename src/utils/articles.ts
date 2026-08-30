import { getCollection, type CollectionEntry } from 'astro:content';

type Article = CollectionEntry<'articles'>;

// The three valid section values — Tag 1 must always be one of these.
export type Section = 'Destinations' | 'Guides' | 'Books';

/**
 * Returns every published (non-draft) article whose first tag matches
 * the given section. Used by listing pages and homepage rows —
 * each section only ever sees its own content, per the locked rule.
 */
export async function getArticlesBySection(section: Section): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }: Article) => !data.draft);
  return all.filter((article: Article) => article.data.tags[0] === section);
}

/**
 * Returns the tags that should actually display on a card, following
 * the locked display rules:
 * - Books articles: only tag[1] shows.
 * - Destinations / Guides articles: tag[1] AND tag[2] show (if tag[2] exists).
 * - tag[0] (the section) never shows here — only the search results
 *   page shows tag[0], via getSearchDisplayTags below.
 */
export function getCardDisplayTags(article: Article): string[] {
  const { tags } = article.data;
  const section = tags[0];

  if (section === 'Books') {
    return tags[1] ? [tags[1]] : [];
  }

  // Destinations and Guides: show tag[1] and tag[2], if present.
  return tags.slice(1, 3);
}

/**
 * Same as getCardDisplayTags, but ALSO includes tag[0] (the section) —
 * used only on the global search results page, so a result's type
 * (Destination / Guide / Book) is visible alongside its other tags.
 */
export function getSearchDisplayTags(article: Article): string[] {
  return article.data.tags;
}

/**
 * Global search: matches a query against ALL of an article's tags
 * (every position, not just 1-3) plus its title, regardless of
 * which section the article belongs to. This intentionally ignores
 * the section boundary that listing pages respect.
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }: Article) => !data.draft);
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return [];

    return all.filter((article: Article) => {
    const titleMatch = article.data.title.toLowerCase().includes(lowerQuery);
    const tagMatch = article.data.tags.some((tag: string) =>
      tag.toLowerCase().includes(lowerQuery)
    );
    return titleMatch || tagMatch;
  });
}