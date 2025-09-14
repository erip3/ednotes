import { QueryClient } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { getArticlesQueryOptions } from '@/features/articles/api/get-articles';
import { ArticleRenderer } from '@/features/articles/components/article-renderer';
import { Article } from '@/types/aliases';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: { articleId: string } }) => {
    const articleId = Number(params.articleId);
    const query = getArticlesQueryOptions({
      articleId: articleId,
    });
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const ArticlePage = () => {
  const article = useLoaderData() as Article;

  return (
    <ContentLayout
      title={article.title}
      parentId={article.categoryId}
      centered={false}
    >
      <ArticleRenderer content={article.content} />
    </ContentLayout>
  );
};

export default ArticlePage;
