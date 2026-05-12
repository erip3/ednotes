/**
 * @module features/categories/api/get-categories
 * @description Typed fetchers and React Query helpers for navigation folder content and
 * breadcrumbs, with runtime validation via type guards and query options for loader integration.
 *
 * Functionality:
 * - Typed fetchers for folder content and breadcrumbs
 * - Runtime validation of server payloads (type guards)
 * - Typed query keys and options for cache correctness
 * - Integration with React Router loaders via queryClient
 *
 * @example
 * // In a loader
 * const query = getCategoriesQueryOptions({ topLevel: true });
 * const categories = await queryClient.fetchQuery(query);
 *
 * @remarks
 * - The Axios API client returns `response.data` directly; fetchers validate and return parsed domain objects.
 * - Query option builders maintain typed `queryKey`s based on parameters for cache isolation and correctness.
 */

import { queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import {
  ArticleSummary,
  CategorySummary,
  FolderContent,
} from '@/types/aliases';

/**
 * Request params: either top-level or children of a parent (with optional parent info)
 * @typedef {Object} GetCategoriesParams
 * @example
 * // Top-level categories
 * const params = { topLevel: true };
 *
 * @example
 * // Children only
 * const params = { parentId: 1 };
 *
 * @example
 * // Children + parent info
 * const params = { parentId: 1, getParentInfo: true };
 */
export type GetCategoriesParams = { topLevel: true } | { categoryId: number };

/**
 * Type guards to validate API responses at runtime.
 * These ensure server payloads match expected domain models before returning data.
 */
const isCategorySummary = (item: unknown): item is CategorySummary =>
  !!item && typeof item === 'object' && 'id' in item && 'title' in item;

const isCategoryArray = (data: unknown): data is CategorySummary[] =>
  Array.isArray(data) && data.every(isCategorySummary);

const isArticleSummary = (item: unknown): item is ArticleSummary =>
  !!item && typeof item === 'object' && 'id' in item && 'title' in item;

const isArticleArray = (data: unknown): data is ArticleSummary[] =>
  Array.isArray(data) && data.every(isArticleSummary);

const isFolderContent = (data: unknown): data is FolderContent =>
  !!data &&
  typeof data === 'object' &&
  'subCategories' in data &&
  'articles' in data &&
  isCategoryArray((data as FolderContent).subCategories) &&
  isArticleArray((data as FolderContent).articles);

/**
 * Build a descriptive Error with request context to aid debugging.
 * @param {string} message - Base error message describing the failure.
 * @param {GetCategoriesParams} params - Request parameters to contextualize the error.
 * @returns {Error} An Error instance annotated with request context.
 */
const toFetchError = (message: string, params: GetCategoriesParams) => {
  const ctx =
    'topLevel' in params ? 'topLevel' : `categoryId=${params.categoryId}`;
  return new Error(`${message} (navigation: ${ctx})`);
};

/**
 * Fetch folder content from the navigation API.
 * - `{ topLevel: true }` -> `Promise<FolderContent>` for root folders
 * - `{ categoryId }`     -> `Promise<FolderContent>` for a category folder
 *
 * @param {GetCategoriesParams} params - Request parameters controlling which categories to fetch.
 * @returns {Promise<FolderContent>} Promise resolving to typed folder content payload.
 * @throws {Error} When server response fails validation or the request fails.
 * @remarks
 * - The Axios client returns `response.data` directly; this function validates and returns domain types.
 * - Validation: folder content is checked via `isFolderContent`.
 */
export const getCategories = <T extends GetCategoriesParams>(
  params: T,
): Promise<FolderContent> => {
  const request =
    'topLevel' in params
      ? api.get('/navigation/roots')
      : api.get(`/navigation/categories/${params.categoryId}`);

  return request.then((data) => {
    if (!isFolderContent(data)) {
      throw toFetchError('Invalid folder content response', params);
    }
    return data as FolderContent;
  });
};

/**
 * Fetch breadcrumbs for a category.
 *
 * @param categoryId - Category ID.
 * @returns Breadcrumb path from the root to the category.
 */
export const getBreadcrumbs = (
  categoryId: number,
): Promise<CategorySummary[]> =>
  api.get(`/navigation/path/${categoryId}`).then((data) => {
    if (!isCategoryArray(data)) {
      throw new Error(
        `Invalid breadcrumbs response (categoryId=${categoryId})`,
      );
    }
    return data;
  });

/**
 * React Query options builder for categories queries.
 * Query keys:
 * - ['navigation', 'roots']
 * - ['navigation', 'categories', categoryId]
 * @param {GetCategoriesParams} params - Request parameters to construct a typed query key.
 * @returns {import('@tanstack/react-query').QueryOptions} Query options with typed `queryKey` and `queryFn`.
 * @remarks Ensures cache isolation between roots and folder queries.
 */
export const getCategoriesQueryOptions = <T extends GetCategoriesParams>(
  params: T,
) => {
  const queryKey =
    'topLevel' in params
      ? (['navigation', 'roots'] as const)
      : (['navigation', 'categories', params.categoryId] as const);

  return queryOptions({
    queryKey,
    queryFn: () => getCategories(params),
  });
};

export const getBreadcrumbsQueryOptions = (categoryId: number) =>
  queryOptions({
    queryKey: ['navigation', 'path', categoryId] as const,
    queryFn: () => getBreadcrumbs(categoryId),
  });
