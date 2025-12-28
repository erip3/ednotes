/**
 * @module features/articles/components/article-list
 * @description Displays a vertical list of article cards with click navigation.
 * Each article is rendered as an `ArticleListing` component with title,
 * publication date, and click handler for navigation to the full article.
 */

import { useNavigate } from 'react-router-dom';

import { ArticleListing } from './article-listing';

import { Article } from '@/types/aliases';

/**
 * Props for ArticleList component.
 * @typedef {Object} ArticleListProps
 * @property {Article[]} articles - Array of articles to display in the list
 */
type ArticleListProps = {
  articles: Article[];
};

/**
 * Renders a vertical list of articles with click-to-navigate functionality.
 *
 * Each article is displayed as an `ArticleListing` card showing the title and
 * publication date. Clicking an article navigates to its detail page via React Router.
 *
 * @component
 * @param {ArticleListProps} props - Component props
 * @param {Article[]} props.articles - Array of articles to render
 * @returns {JSX.Element} A flex column container with ArticleListing cards
 *
 * @example
 * // Basic usage
 * <ArticleList articles={[
 *   { id: '1', title: 'React Tips', published: '2025-01-15' },
 *   { id: '2', title: 'Web Performance', published: '2025-01-10' }
 * ]} />
 *
 * @remarks
 * - Uses `useNavigate` hook for client-side routing
 * - Navigation paths follow the pattern `/articles/{articleId}`
 */
export const ArticleList = ({ articles }: ArticleListProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 py-4">
      {articles.map((article) => (
        <ArticleListing
          key={article.id}
          title={article.title}
          published={article.published}
          onClick={() => navigate(`/articles/${article.id}`)}
        />
      ))}
    </div>
  );
};
