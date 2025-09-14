// This file is used to setup all the context providers required by the app
// It is used in main.tsx to wrap the App component
// displays a spinner while loading

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { queryConfig } from '@/lib/react-query';
import { useThemeStore } from '@/stores/theme-store';

type AppProviderProps = {
  children: React.ReactNode;
};

/**
 * App Provider to wrap the app with all necessary context providers
 * @param AppProviderProps - children: React.ReactNode
 * @returns React component
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  // Create a single QueryClient instance
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  const { theme } = useThemeStore(); // Access theme from the store

  // Update the document class when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {import.meta.env.DEV && <ReactQueryDevtools />}
          <Notifications />
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
