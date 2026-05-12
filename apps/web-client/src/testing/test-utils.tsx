/**
 * Provides helper functions for rendering components in tests with proper
 * React Router and application context setup.
 *
 * Key utilities:
 * - `renderApp`: Renders a component within the full app context (router, providers)
 * - `waitForLoadingToFinish`: Waits for loading indicators to disappear
 *
 * Usage:
 *   const { getByText } = await renderApp(<MyComponent />, { url: '/categories/1' });
 */

import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router';

import { AppProvider } from '@/app/provider';

export const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByTestId(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    { timeout: 4000 },
  );

export const renderApp = async (
  ui: any,
  { url = '/', path = '/', ...renderOptions }: Record<string, any> = {},
) => {
  const router = createMemoryRouter(
    [
      {
        path: path,
        element: ui,
      },
    ],
    {
      initialEntries: url ? ['/', url] : ['/'],
      initialIndex: url ? 1 : 0,
    },
  );

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: () => {
        return (
          <AppProvider>
            <RouterProvider router={router} />
          </AppProvider>
        );
      },
      ...renderOptions,
    }),
  };

  await waitForLoadingToFinish();

  return returnValue;
};

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { userEvent, rtlRender };
