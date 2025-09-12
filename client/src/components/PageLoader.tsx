import React from 'react';

// Props for the PageLoader component
interface PageLoaderProps {
  loading: boolean;
  error?: string | null;
  isRetrying?: boolean;
  children?: React.ReactNode;
}

/**
 * Spinner component displays a loading spinner.
 * @returns A simple spinner component.
 */
function Spinner() {
  return (
    <svg className="h-24 w-24 animate-spin text-gray-400" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

/**
 * PageLoader component displays a loading indicator, error message, or the children content.
 * @param PageLoaderProps - Props for the component.
 * @returns JSX.Element
 */
export default function PageLoader({
  loading,
  error,
  isRetrying,
  children,
}: PageLoaderProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative flex flex-1 flex-col items-center justify-center">
        {loading ? (
          <>
            <Spinner />
            {error && (
              <div className="mt-4 max-w-xs text-center text-red-500">
                {error}
                {isRetrying && (
                  <div className="mt-2 text-sm text-gray-400">Retrying...</div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-in w-full opacity-100 transition-opacity duration-500">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
