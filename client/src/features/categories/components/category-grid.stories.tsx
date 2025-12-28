import { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';

import { CategoryGrid } from './category-grid';

const meta: Meta<typeof CategoryGrid> = {
  title: 'Features/Categories/CategoryGrid',
  component: CategoryGrid,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="flex min-h-screen items-center justify-center p-8">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CategoryGrid>;

const mockCategories = [
  {
    id: 1,
    title: 'Personal',
    published: true,
    order: 1,
    topic: true,
  },
  {
    id: 2,
    title: 'Mathematics',
    published: true,
    order: 2,
    topic: true,
  },
  {
    id: 3,
    title: 'Computer Science',
    published: true,
    order: 3,
    topic: true,
  },
  {
    id: 4,
    title: 'Physics',
    published: false,
    order: 4,
    topic: true,
  },
  {
    id: 5,
    title: 'Chemistry',
    published: true,
    order: 5,
    topic: true,
  },
];

export const Default: Story = {
  args: {
    categories: mockCategories,
  },
};

export const Empty: Story = {
  args: {
    categories: [],
  },
};

export const SingleCategory: Story = {
  args: {
    categories: [mockCategories[0]],
  },
};
