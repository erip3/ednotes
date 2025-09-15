import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RouterProvider } from 'react-router/dom';

import { createAppRouter } from './create-router';

/**
 * The main application router component that provides routing context.
 * It initializes the router with React Query integration.
 * @returns The RouterProvider component with the configured router.
 */
export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
