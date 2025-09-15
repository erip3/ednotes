import { Button } from '../ui/button';

/**
 * MainErrorFallback component displays a fallback UI when an error occurs.
 * @returns A fallback UI component to display when an error occurs.
 */
export const MainErrorFallback = () => {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Something went wrong...</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        An error occurred. Darn. Try refreshing the page.
      </p>
      <Button
        className="mt-4"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </div>
  );
};
