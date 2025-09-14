import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from './pages/app/root';

import { paths } from '@/config/paths';

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./pages/home').then(convert(queryClient)),
    },
    {
      path: paths.category.path, // "/categories/:categoryId"
      lazy: () => import('./pages/category').then(convert(queryClient)),
    },
    {
      path: paths.article.path, // "/articles/:articleId"
      lazy: () => import('./pages/article').then(convert(queryClient)),
    },
    {
      path: paths.personal.path, // "/personal"
      lazy: () => import('./pages/personal').then(convert(queryClient)),
    },
    {
      path: paths.personal.projects.detail.path, // "/personal/projects/:projectId"
      lazy: () =>
        import('./pages/personal/projects/detail').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
