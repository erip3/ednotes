/**
 * @module components/errors/main
 * @description Provides a unified error boundary fallback UI that handles both React Router
 * route errors and React ErrorBoundary errors. Displays user-friendly error messages with
 * recovery actions and logs errors for debugging.
 *
 * Functionality:
 * - **Dual error handling**: Works with both React Router and ErrorBoundary
 * - **Error details**: Extracts and displays status codes, messages, and error text
 * - **Recovery actions**: Provides "Try Again" button to reset or refresh
 * - **Debug logging**: Automatically logs errors to console for investigation
 *
 * @example
 * // As React Router errorElement
 * {
 *   path: '/articles',
 *   errorElement: <MainErrorFallback />
 * }
 *
 * @example
 * // In ErrorBoundary
 * <ErrorBoundary FallbackComponent={MainErrorFallback}>
 *   <App />
 * </ErrorBoundary>
 */

import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { Button } from '../ui/button';

/**
 * Props for the MainErrorFallback component.
 *
 * @remarks
 * Both props are optional:
 * - When used as React Router errorElement, props are omitted and useRouteError() is used
 * - When used in ErrorBoundary, error and resetErrorBoundary are provided by react-error-boundary
 */
type ErrorFallbackProps = {
  /** Error object from ErrorBoundary (not used with React Router errors). */
  error?: unknown;
  /** Function to reset the ErrorBoundary state and retry rendering. */
  resetErrorBoundary?: () => void;
};

/**
 * Unified error fallback component for both React Router and ErrorBoundary errors.
 *
 * Displays error screen with the error title, message, and a recovery button.
 * Automatically detects whether the error came from React Router (using useRouteError) or
 * from an ErrorBoundary (using props), prioritizing route errors when both are present.
 *
 * Features:
 * - **Route error support**: Handles React Router errors with status codes (404, 500, etc.)
 * - **Boundary error support**: Handles generic errors caught by ErrorBoundary
 * - **Error extraction**: Extracts meaningful error messages from Error objects
 * - **Console logging**: Logs full error details for debugging
 * - **Recovery button**: Allows user to reset error boundary or refresh page
 *
 * @param {ErrorFallbackProps} [props={}] - Optional props for ErrorBoundary integration.
 * @returns {JSX.Element} Full-screen error UI with title, message, and recovery button.
 *
 * @remarks
 * - Prefers React Router errors (useRouteError) over ErrorBoundary errors (props.error)
 * - For route errors, displays "Error {status}" title and statusText message
 * - For other errors, extracts message property or shows generic message
 * - Recovery button calls resetErrorBoundary if available, otherwise reloads page
 * - All errors are logged to console with "[ErrorFallback]" prefix
 *
 * @example
 * // React Router usage (no props needed)
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <HomePage />,
 *     errorElement: <MainErrorFallback />
 *   }
 * ]);
 *
 * @example
 * // ErrorBoundary usage (props provided automatically)
 * <ErrorBoundary FallbackComponent={MainErrorFallback}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export const MainErrorFallback = ({
  error: boundaryError,
  resetErrorBoundary,
}: ErrorFallbackProps = {}) => {
  const routeError = useRouteError();

  let title = 'Something went wrong...';
  let message = 'An error occurred. Try refreshing the page.';

  // Prefer React Router route errors when present
  if (isRouteErrorResponse(routeError)) {
    title = `Error ${routeError.status}`;
    message = routeError.statusText || message;
  } else {
    const err = (routeError ?? boundaryError) as any;
    if (err && typeof err === 'object' && 'message' in err) {
      message = String(err.message) || message;
    }
  }

  // Log the underlying error for easier debugging
  if (routeError || boundaryError) {
    console.error('[ErrorFallback] Caught error:', routeError ?? boundaryError);
  }

  // Recovery handler
  const handleRefresh = () => {
    if (typeof resetErrorBoundary === 'function') {
      resetErrorBoundary();
    } else {
      window.location.assign(window.location.origin);
    }
  };

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-xl text-center text-sm text-muted-foreground">
        {message}
      </p>
      <Button className="mt-4" onClick={handleRefresh}>
        Try Again
      </Button>
    </div>
  );
};
