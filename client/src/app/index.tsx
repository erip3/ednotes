import { AppProvider } from './provider';
import { AppRouter } from './router/router';

export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
