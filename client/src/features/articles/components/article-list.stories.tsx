import { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';

import { ArticleList } from './article-list';

const meta: Meta<typeof ArticleList> = {
  title: 'Features/Articles/ArticleList',
  component: ArticleList,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <Story />
          </div>
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ArticleList>;

const mockArticles = [
  {
    id: 1,
    title: 'Introduction to Calculus',
    content: '[]',
    categoryId: 2,
    published: true,
    order: 1,
  },
  {
    id: 2,
    title: 'Linear Algebra Basics',
    content: '[]',
    categoryId: 2,
    published: true,
    order: 2,
  },
  {
    id: 3,
    title: 'Advanced Topics in Analysis',
    content: '[]',
    categoryId: 2,
    published: false,
    order: 3,
  },
  {
    id: 4,
    title: 'Differential Equations',
    content: '[]',
    categoryId: 2,
    published: true,
    order: 4,
  },
];

export const Default: Story = {
  args: {
    articles: mockArticles,
  },
};

export const Empty: Story = {
  args: {
    articles: [],
  },
};

export const SingleArticle: Story = {
  args: {
    articles: [mockArticles[0]],
  },
};
