import React from "react";

interface PageLoaderProps {
  loading: boolean;
  children?: React.ReactNode;
}

/**
 * PageLoader component displays a loading indicator or the children content.
 * @param PageLoaderProps - Props for the component.
 * @returns JSX.Element
 */
export default function PageLoader({ loading, children }: PageLoaderProps) {
  return (
    <div
      className={`transition-opacity duration-500 ${
        loading ? "opacity-0 pointer-events-none" : "opacity-100"
      } min-h-[200px] flex items-center justify-center`}
    >
      {/* Display loading indicator or children */}
      {loading ? (
        <div className="text-gray-400 text-lg">Loading...</div>
      ) : (
        children
      )}
    </div>
  );
}
