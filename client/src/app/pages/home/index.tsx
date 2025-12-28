/**
 * @module app/pages/home
 * @description Entry point page that displays all top-level categories in a grid layout.
 *
 * Functionality:
 * - **Data loading**: Pre-fetches top-level categories via React Query
 * - **Presentation**: Renders categories in a grid layout
 * - **Empty state**: Shows message when no categories exist
 *
 * Data flow:
 * 1. `clientLoader` fetches top-level categories via `getCategoriesQueryOptions`
 * 2. Loader returns `Category[]` consumed by `useLoaderData()`
 * 3. Component renders `CategoryGrid` with fetched categories
 * 4. User clicks a category to navigate to its detail page
 *
 * @example
 * // In route configuration (create-router.tsx)
 * {
 *   path: '/',
 *   lazy: () => import('./pages/home').then(convert(queryClient)),
 *   errorElement: <MainErrorFallback />
 * }
 */

import { QueryClient } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { getCategoriesQueryOptions } from '@/features/categories/api/get-categories';
import { CategoryGrid } from '@/features/categories/components/category-grid';
import { Category } from '@/types/aliases';

/**
 * Client-side data loader for the home page.
 *
 * Fetches all top-level categories before the component renders.
 * Uses React Query for caching and deduplication to avoid redundant API calls.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance for cache management.
 * @returns {() => Promise<Category[]>} Async loader function that returns top-level categories.
 *
 * @remarks
 * - Prefers cached data via `getQueryData` and falls back to `fetchQuery` as needed.
 * - Expects fetcher to return `Category[]` directly (unwrapped).
 * - Always returns an array, even if fetch fails (returns empty array for graceful degradation).
 */
// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader =
  (queryClient: QueryClient) => async (): Promise<Category[]> => {
    const query = getCategoriesQueryOptions({ topLevel: true });

    // Try to get cached data first, then fetch if not present
    const result =
      queryClient.getQueryData<Category[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query));

    // Ensure we always return an array
    return Array.isArray(result) ? result : [];
  };

/**
 * HomePage component - Displays all top-level categories.
 *
 * Renders the main entry page with a grid of top-level categories.
 *
 * Functionality:
 * - **Empty state**: Displays message when no categories exist
 * - **Grid layout**: Uses `CategoryGrid` for consistent category presentation
 *
 * @returns {JSX.Element} Home page with category grid or empty state.
 *
 * @example
 * // Rendered by React Router when navigating to /
 * const categories = useLoaderData() as Category[];
 * // Component then renders CategoryGrid with the provided categories
 */
const HomePage = () => {
  const categories = useLoaderData() as Category[];
  const count = categories?.length ?? 0;
  const subtitle = 'Choose a category to get started';

  return (
    <ContentLayout title="EdNotes" subtitle={subtitle}>
      {count > 0 ? (
        <CategoryGrid categories={categories} />
      ) : (
        <div className="mt-6 text-sm text-muted-foreground">
          No categories available.
        </div>
      )}
    </ContentLayout>
  );
};

/**
 * HydrateFallback component for async route hydration.
 *
 * Displays a loading spinner during initial page load and route transitions.
 * Required by React Router v7+ for lazy-loaded routes.
 *
 * @returns {JSX.Element} Full-screen centered spinner.
 */
export const HydrateFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <Spinner size="xl" />
  </div>
);

export default HomePage;
