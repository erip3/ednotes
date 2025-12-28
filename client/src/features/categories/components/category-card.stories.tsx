import { Meta, StoryObj } from '@storybook/react-vite';

import { CategoryCard } from './category-card';

const meta: Meta<typeof CategoryCard> = {
  title: 'Features/Categories/CategoryCard',
  component: CategoryCard,
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CategoryCard>;

export const Published: Story = {
  args: {
    title: 'Mathematics',
    published: true,
    onClick: () => alert('Category clicked!'),
  },
};

export const Unpublished: Story = {
  args: {
    title: 'Physics',
    published: false,
    onClick: () => alert('This should not trigger'),
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Computer Science and Engineering',
    published: true,
    onClick: () => alert('Category clicked!'),
  },
};
