import { Meta, StoryObj } from '@storybook/react-vite';

import { ArticleListing } from './article-listing';

const meta: Meta<typeof ArticleListing> = {
  title: 'Features/Articles/ArticleListing',
  component: ArticleListing,
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ArticleListing>;

export const Published: Story = {
  args: {
    title: 'Introduction to Calculus',
    published: true,
    onClick: () => alert('Article clicked!'),
  },
};

export const Draft: Story = {
  args: {
    title: 'Advanced Linear Algebra',
    published: false,
    onClick: () => alert('Draft article clicked!'),
  },
};

export const LongTitle: Story = {
  args: {
    title:
      'A Comprehensive Guide to Understanding Machine Learning Algorithms and Their Applications',
    published: true,
    onClick: () => alert('Article clicked!'),
  },
};
