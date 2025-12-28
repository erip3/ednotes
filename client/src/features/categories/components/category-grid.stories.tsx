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
    parentId: null,
    order: 1,
    topic: true,
    topicId: null,
  },
  {
    id: 2,
    title: 'Mathematics',
    published: true,
    parentId: null,
    order: 2,
    topic: true,
    topicId: null,
  },
  {
    id: 3,
    title: 'Computer Science',
    published: true,
    parentId: null,
    order: 3,
    topic: true,
    topicId: null,
  },
  {
    id: 4,
    title: 'Physics',
    published: false,
    parentId: null,
    order: 4,
    topic: true,
    topicId: null,
  },
  {
    id: 5,
    title: 'Chemistry',
    published: true,
    parentId: null,
    order: 5,
    topic: true,
    topicId: null,
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
