/**
 * @module app/router/router
 * @description Provides the RouterProvider with a memoized router instance that integrates
 * TanStack Query for data fetching. Wraps the router in Suspense to handle async route loaders
 * during navigation and initial hydration.
 *
 * Functionality:
 * - Initializes the router with QueryClient for loader data fetching
 * - Memoizes router instance to prevent unnecessary re-creation
 * - Provides Suspense boundary for route loader execution
 * - Displays loading fallback during navigation and hydration
 *
 * @example
 * // In app root (provider.tsx)
 * <QueryClientProvider client={queryClient}>
 *   <AppRouter />
 * </QueryClientProvider>
 */

import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useMemo } from 'react';
import { RouterProvider } from 'react-router/dom';

import { createAppRouter } from './create-router';

import { Spinner } from '@/components/ui/spinner';

/**
 * Fallback UI shown during route loader execution and initial hydration.
 *
 * @returns {JSX.Element} Full-screen centered loading spinner.
 */
const RouterLoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <Spinner size="xl" />
  </div>
);

/**
 * The main application router component that provides routing context.
 *
 * Initializes the router with React Query integration and wraps it in a
 * Suspense boundary to handle async route loaders during navigation and hydration.
 * The router instance is memoized to prevent unnecessary re-initializations when
 * the component re-renders.
 *
 * @returns {JSX.Element} RouterProvider wrapped in Suspense with loading fallback.
 *
 * @remarks
 * - Router is memoized based on queryClient stability
 * - Suspense fallback displays during route transitions and initial page load
 * - Each route's HydrateFallback (if exported) takes precedence over this Suspense fallback
 */
export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return (
    <Suspense fallback={<RouterLoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
