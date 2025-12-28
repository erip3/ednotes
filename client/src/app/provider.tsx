/**
 * @module app/provider
 * @description Wraps the application with all necessary context providers including TanStack Query,
 * error boundaries, theme management, and notifications.
 *
 * Functionality:
 * - **React Query**: Provides QueryClient with default configuration for data fetching
 * - **Error handling**: Global error boundary with MainErrorFallback
 * - **Theme management**: Syncs theme store with document dark mode class
 * - **Notifications**: Global notification system for user feedback
 * - **Dev tools**: React Query DevTools in development mode
 * - **Loading state**: Suspense boundary with spinner for lazy-loaded components
 *
 * @example
 * // In main.tsx
 * root.render(
 *   <AppProvider>
 *     <AppRouter />
 *   </AppProvider>
 * );
 */

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

/**
 * Props for the AppProvider component.
 */
type AppProviderProps = {
  /** Child components to be wrapped by all providers. */
  children: React.ReactNode;
};

/**
 * App Provider to wrap the app with all necessary context providers.
 *
 * Sets up the application's global context including React Query for data fetching,
 * error boundaries for error handling, theme synchronization with the DOM, and
 * notification management. The QueryClient is memoized to maintain cache stability
 * across re-renders.
 *
 * Features:
 * - **QueryClient**: Singleton instance with default query configuration
 * - **Theme sync**: Automatically applies dark mode class to document root
 * - **Error boundary**: Catches unhandled errors and displays fallback UI
 * - **Dev tools**: React Query DevTools for debugging queries in development
 * - **Suspense**: Loading fallback for code-split routes and lazy components
 *
 * @param {AppProviderProps} props - Component props containing children to wrap.
 * @returns {JSX.Element} Application wrapped with all necessary providers.
 *
 * @remarks
 * - QueryClient uses React.useState to ensure only one instance is created
 * - Theme changes automatically update the document's dark mode class
 * - ErrorBoundary catches errors from children and displays MainErrorFallback
 * - Suspense fallback shows while lazy routes/components load
 *
 * @example
 * // Typical usage in main.tsx
 * <AppProvider>
 *   <AppRouter />
 * </AppProvider>
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
