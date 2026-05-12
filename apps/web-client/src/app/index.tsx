/**
 * @module app/index
 * @description Main application component that sets up global providers and routing.
 *
 * This component serves as the entry point for the React component tree.
 * It wraps the entire application in the AppProvider (handling global state,
 * themes, and data fetching) and renders the AppRouter to manage
 * client-side navigation.
 */

import { AppProvider } from './provider';
import { AppRouter } from './router/router';

export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
