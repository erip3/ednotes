/**
 * @module features/articles/api/get-articles
 * @description Article data fetching and caching layer using TanStack Query
 *
 * This module provides type-safe functions for fetching articles from the API.
 *
 * Functionality:
 * - **Conditional typing**: Different return types based on query parameters (single vs. array)
 * - **Response validation**: Type guards validate API responses match expected structure
 * - **Error context**: Error messages with parameter information
 * - **React Query integration**: Query options generation for automatic caching and deduplication
 * - **Loader integration**: Designed for React Router loaders with queryClient
 *
 * @example
 * // Fetch a single article in a loader
 * const query = getArticlesQueryOptions({ articleId: 42 });
 * const result = await queryClient.fetchQuery(query);
 * // TypeScript knows: result.data is Article
 *
 * @example
 * // Fetch articles in a category in a loader
 * const query = getArticlesQueryOptions({ categoryId: 5 });
 * const result = await queryClient.fetchQuery(query);
 * // TypeScript knows: result.data is Article[]
 */

import { queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { Article } from '@/types/aliases';

type GetArticlesParams = { categoryId: number } | { articleId: number };

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
 * Type guard to validate if data is an array of Articles
 */
const isArticleArray = (data: unknown): data is Article[] => {
  return Array.isArray(data) && data.every(isArticle);
};

/**
 * Fetch articles by category ID or a single article by ID
 * @param params - Object containing either categoryId (returns array) or articleId (returns single article)
 * @returns A promise that resolves to articles array or single article based on params
 * @throws Error with context if the fetch fails
 */
export const getArticles = <T extends GetArticlesParams>(
  params: T,
): Promise<
  T extends { categoryId: number } ? { data: Article[] } : { data: Article }
> => {
  if ('categoryId' in params) {
    // Fetch articles by category
    return api
      .get(`/articles/category/${params.categoryId}`)
      .then((data) => {
        // API client interceptor returns response.data directly
        if (!isArticleArray(data)) {
          throw new Error(
            `Invalid articles response for category ${params.categoryId}`,
          );
        }
        return { data } as { data: Article[] };
      })
      .catch((error) => {
        throw new Error(
          `Failed to fetch articles for category ${params.categoryId}: ${error.message}`,
        );
      }) as any;
  } else if ('articleId' in params) {
    // Fetch single article by ID
    return api
      .get(`/articles/${params.articleId}`)
      .then((data) => {
        // API client interceptor returns response.data directly
        if (!isArticle(data)) {
          throw new Error(
            `Invalid article response for article ${params.articleId}`,
          );
        }
        return { data } as { data: Article };
      })
      .catch((error) => {
        throw new Error(
          `Failed to fetch article ${params.articleId}: ${error.message}`,
        );
      }) as any;
  }
  throw new Error('Invalid params for getArticles');
};

/**
 * Generate query options for react-query
 * Returns properly typed query options based on whether categoryId or articleId is provided
 * @param params - Object containing either categoryId or articleId
 * @returns Query options with properly typed queryKey and queryFn for react-query
 */
export const getArticlesQueryOptions = <T extends GetArticlesParams>(
  params: T,
) => {
  const queryKey =
    'categoryId' in params
      ? (['articles', 'category', params.categoryId] as const)
      : (['articles', 'article', params.articleId] as const);

  return queryOptions({
    queryKey,
    queryFn: () => getArticles(params),
  });
};
