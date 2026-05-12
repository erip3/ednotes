/**
 * @module features/articles/api/get-articles
 * @description Article content fetching and caching layer using TanStack Query.
 *
 * This module fetches a single article content payload from the reader API.
 *
 * Functionality:
 * - **Response validation**: Type guards validate API responses match expected structure
 * - **Error context**: Error messages with parameter information
 * - **React Query integration**: Query options generation for automatic caching and deduplication
 * - **Loader integration**: Designed for React Router loaders with queryClient
 *
 * @example
 * // Fetch a single article in a loader
 * const query = getArticlesQueryOptions({ articleId: 42 });
 * const result = await queryClient.fetchQuery(query);
 * // TypeScript knows: result.article is Article
 */

import { queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { Article, ArticleContent, CategorySummary } from '@/types/aliases';

type GetArticlesParams = { articleId: number };

/**
 * Type guard to validate if data is a valid Article
 */
const isArticle = (data: unknown): data is Article => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'content' in data &&
    'categoryId' in data
  );
};

/**
 * Type guard to validate if data is a valid ArticleContent response
 */
const isArticleContent = (data: unknown): data is ArticleContent => {
  return (
    !!data &&
    typeof data === 'object' &&
    'article' in data &&
    'breadcrumbs' in data &&
    'backgroundArticles' in data &&
    isArticle((data as ArticleContent).article) &&
    Array.isArray((data as ArticleContent).breadcrumbs) &&
    (data as ArticleContent).breadcrumbs!.every(
      (item): item is CategorySummary =>
        !!item && typeof item === 'object' && 'id' in item && 'title' in item,
    )
  );
};

/**
 * Fetch a single article by ID.
 * @param params - Object containing the article ID.
 * @returns A promise that resolves to the article content payload.
 * @throws Error with context if the fetch fails
 */
export const getArticles = <T extends GetArticlesParams>(
  params: T,
): Promise<ArticleContent> => {
  return api
    .get(`/articles/${params.articleId}`)
    .then((data) => {
      if (!isArticleContent(data)) {
        throw new Error(
          `Invalid article response for article ${params.articleId}`,
        );
      }
      return data;
    })
    .catch((error) => {
      throw new Error(
        `Failed to fetch article ${params.articleId}: ${error.message}`,
      );
    });
};

/**
 * Generate query options for react-query.
 * @param params - Object containing the article ID.
 * @returns Query options with properly typed queryKey and queryFn for react-query
 */
export const getArticlesQueryOptions = <T extends GetArticlesParams>(
  params: T,
) => {
  const queryKey = ['articles', 'article', params.articleId] as const;

  return queryOptions({
    queryKey,
    queryFn: () => getArticles(params),
  });
};
