/**
 * @module features/categories/api/get-categories
 * @description Typed fetchers and React Query helpers for categories with conditional
 * return types (top-level, children-only, parent+children), runtime validation via type guards,
 * and query options for loader integration.
 *
 * Functionality:
 * - Conditional typing for top-level, children-only, and parent+children responses
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
import { Category, CategoriesWithParent } from '@/types/aliases';

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
export type GetCategoriesParams =
  | { topLevel: true }
  | { parentId: number; getParentInfo?: boolean };

/**
 * Type guards to validate API responses at runtime.
 * These ensure server payloads match expected domain models before returning data.
 */
const isCategory = (item: unknown): item is Category =>
  !!item &&
  typeof item === 'object' &&
  'id' in item &&
  'title' in item &&
  'topic' in item;

const isCategoryArray = (data: unknown): data is Category[] =>
  Array.isArray(data) && data.every(isCategory);

const isCategoriesWithParent = (data: unknown): data is CategoriesWithParent =>
  !!data &&
  typeof data === 'object' &&
  'parent' in data &&
  'children' in data &&
  isCategoryArray((data as CategoriesWithParent).children) &&
  isCategory((data as CategoriesWithParent).parent);

/**
 * Build a descriptive Error with request context to aid debugging.
 * @param {string} message - Base error message describing the failure.
 * @param {GetCategoriesParams} params - Request parameters to contextualize the error.
 * @returns {Error} An Error instance annotated with request context.
 */
const toFetchError = (message: string, params: GetCategoriesParams) => {
  const ctx = 'topLevel' in params ? 'topLevel' : `parentId=${params.parentId}`;
  return new Error(`${message} (categories: ${ctx})`);
};

/**
 * Fetch categories with conditional typing:
 * - `{ topLevel: true }`        -> `Promise<Category[]>`
 * - `{ parentId, getParentInfo}`:
 *     - `getParentInfo = true`  -> `Promise<CategoriesWithParent>`
 *     - otherwise               -> `Promise<Category[]>`
 *
 * @param {GetCategoriesParams} params - Request parameters controlling which categories to fetch.
 * @returns {Promise<Category[]|CategoriesWithParent>} Promise resolving to typed categories payload.
 * @throws {Error} When server response fails validation or the request fails.
 * @remarks
 * - The Axios client returns `response.data` directly; this function validates and returns domain types.
 * - Validation: arrays are checked via `isCategoryArray`, parent+children via `isCategoriesWithParent`.
 */
export const getCategories = <T extends GetCategoriesParams>(
  params: T,
): Promise<
  T extends { topLevel: true }
    ? Category[]
    : T extends { getParentInfo: true }
      ? CategoriesWithParent
      : Category[]
> => {
  // Determine the appropriate API endpoint based on params
  const request =
    'topLevel' in params
      ? api.get('/categories/top-level')
      : params.getParentInfo
        ? api.get(`/categories/${params.parentId}/with-children`)
        : api.get(`/categories/${params.parentId}/children`);

  // Our Axios client returns `response.data` directly
  // The resolved value here is the parsed data
  return request.then((data) => {
    if ('topLevel' in params) {
      if (!isCategoryArray(data))
        throw toFetchError('Invalid top-level categories response', params);
      return data as any;
    }
    if (params.getParentInfo) {
      if (!isCategoriesWithParent(data))
        throw toFetchError('Invalid parent+children response', params);
      return data as any;
    }
    if (!isCategoryArray(data))
      throw toFetchError('Invalid children response', params);
    return data as any;
  });
};

/**
 * React Query options builder for categories queries.
 * Query keys:
 * - ['categories', 'top-level']
 * - ['categories', 'parent', parentId]
 * - ['categories', 'parent', parentId, 'with-parent']
 * @param {GetCategoriesParams} params - Request parameters to construct a typed query key.
 * @returns {import('@tanstack/react-query').QueryOptions} Query options with typed `queryKey` and `queryFn`.
 * @remarks Ensures cache isolation between top-level, children-only, and parent+children queries.
 */
export const getCategoriesQueryOptions = <T extends GetCategoriesParams>(
  params: T,
) => {
  // Determine query key based on params
  const queryKey =
    'topLevel' in params
      ? (['categories', 'top-level'] as const)
      : params.getParentInfo
        ? (['categories', 'parent', params.parentId, 'with-parent'] as const)
        : (['categories', 'parent', params.parentId] as const);

  return queryOptions({
    queryKey,
    queryFn: () => getCategories(params),
  });
};
