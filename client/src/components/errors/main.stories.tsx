import { Meta, StoryObj } from '@storybook/react-vite';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { MainErrorFallback } from './main';

// Storybook meta configuration
const meta: Meta = {
  title: 'Errors/MainErrorFallback',
  component: MainErrorFallback,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story for MainErrorFallback component
export const Default: Story = {
  render: () => {
    // Provide Data Router context required by useRouteError
    const router = createMemoryRouter([
      { path: '/', element: <MainErrorFallback /> },
    ]);

    return <RouterProvider router={router} />;
  },
};
