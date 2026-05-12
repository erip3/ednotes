/**
 * @module app/router/create-router
 * @description Defines the application's route map and provides a `convert` utility that injects a
 * TanStack Query `QueryClient` into lazy route modules' loaders/actions
 * @remarks This module centralizes route configuration and keeps data prefetching
 * co-located with route modules via the `clientLoader`/`clientAction` pattern.
 */

import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router';

import { MainErrorFallback } from '@/components/errors/main';
import { paths } from '@/config/paths';

/**
 * Converts a module with clientLoader and clientAction to a format compatible with React Router.
 * @param {QueryClient} queryClient - The QueryClient instance injected into loaders and actions.
 * @returns A function that takes a lazy route module and returns a converted module with integrated React Query.
 */
const convert = (queryClient: QueryClient) => (m: any) => {
  const {
    clientLoader,
    clientAction,
    default: Component,
    HydrateFallback,
    ...rest
  } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
    HydrateFallback,
  };
};

/**
 * Creates the application router with lazy-loaded routes and integrates React Query.
 * Each route uses `MainErrorFallback` as its `errorElement` for route-level errors.
 * @param {QueryClient} queryClient - The shared QueryClient instance for React Query.
 * @returns {import('react-router').Router} The created browser router instance.
 */
export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('../pages/home').then(convert(queryClient)),
      errorElement: <MainErrorFallback />,
    },
    {
      path: paths.category.path, // "/categories/:categoryId"
      lazy: () => import('../pages/category').then(convert(queryClient)),
      errorElement: <MainErrorFallback />,
    },
    {
      path: paths.article.path, // "/articles/:articleId"
      lazy: () => import('../pages/article').then(convert(queryClient)),
      errorElement: <MainErrorFallback />,
    },
    {
      path: paths.personal.path, // "/personal"
      lazy: () => import('../pages/personal').then(convert(queryClient)),
      errorElement: <MainErrorFallback />,
    },
  ]);
