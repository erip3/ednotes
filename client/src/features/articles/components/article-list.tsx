import { useNavigate } from 'react-router-dom';

import { ArticleListing } from './article-listing';

import { Article } from '@/types/aliases';

type ArticleListProps = {
  articles: Article[];
};

/**
 * ArticleList component to display a list of articles.
 * @param props- Props containing an array of articles.
 * @returns JSX.Element
 */
export const ArticleList = ({ articles }: ArticleListProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 py-4">
      {articles.map((article) => (
        <ArticleListing
          key={article.id}
          title={article.title}
          onClick={() => navigate(`/articles/${article.id}`)}
        />
      ))}
    </div>
  );
};
