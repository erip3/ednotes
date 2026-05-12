/**
 * @module lib/react-query
 * @description React Query configuration and utility types for data fetching
 *
 * Functionality:
 * - **queryConfig**: Default React Query settings for all queries
 * - **ApiFnReturnType**: Extracts return type from async API functions
 * - **QueryConfig**: Type utilities for query configuration overrides
 * - **MutationConfig**: Type utilities for mutation configuration
 *
 * Default Query Configuration:
 * - No refetch on window focus
 * - No automatic retries on failure (errors shown immediately)
 * - 1 minute stale time (data considered fresh for 60 seconds)
 *
 * @example
 * import { useQuery } from '@tanstack/react-query';
 * import type { QueryConfig } from '@/lib/react-query';
 *
 * type UseArticlesOptions = {
 *   queryConfig?: QueryConfig<typeof getArticlesQueryOptions>;
 * };
 */

import { UseMutationOptions, DefaultOptions } from '@tanstack/react-query';

/**
 * Default React Query configuration applied to all queries
 *
 * @property queries.refetchOnWindowFocus - Disable auto-refetch when window regains focus
 * @property queries.retry - Disable automatic retries (handle errors immediately)
 * @property queries.staleTime - Data is considered fresh for 1 minute (60000ms)
 *
 * @remarks
 * These defaults prioritize stability and predictability over aggressive refetching.
 * Individual queries can override these settings via QueryConfig utility type.
 */
export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

/**
 * Utility type to extract the return type from an async API function
 * Automatically unwraps Promise and awaits the result type
 *
 * @template FnType - Async function that returns a Promise
 * @returns The unwrapped return type of the function
 *
 * @example
 * type GetArticlesReturn = ApiFnReturnType<typeof getArticles>;
 * // Resolves to: { data: Article[] } | { data: Article }
 */
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

/**
 * Utility type for customizing query options while excluding standard keys
 *
 * Extracts all properties from query options except queryKey and queryFn,
 * allowing consumers to override cache behavior without redefining the query itself.
 *
 * @template T - Query options function (typically from getArticlesQueryOptions)
 *
 * @example
 * type UseArticlesConfig = QueryConfig<typeof getArticlesQueryOptions>;
 * // Allows overriding: enabled, staleTime, gcTime, etc.
 */
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

/**
 * Utility type for mutation configuration with properly typed error and variable handling
 *
 * Automatically extracts:
 * - TData: Return type from the mutation function
 * - TError: Always Error type
 * - TVariables: First parameter type from the mutation function
 *
 * @template MutationFnType - Async function that performs the mutation
 *
 * @example
 * type CreateArticleMutation = MutationConfig<typeof createArticle>;
 * // Provides typed onSuccess, onError, variables, etc.
 */
export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
