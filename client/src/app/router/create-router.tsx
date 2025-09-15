import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router';

import { MainErrorFallback } from '@/components/errors/main';
import { paths } from '@/config/paths';

/**
 * Converts a module with clientLoader and clientAction to a format compatible with React Router.
 * @param queryClient - The QueryClient instance to be used for loaders and actions.
 * @returns A function that takes a module and returns a new module with integrated React Query.
 */
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

/**
 * Creates the application router with lazy-loaded routes and integrates React Query.
 * @param queryClient - The QueryClient instance for React Query.
 * @returns The created router instance.
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
