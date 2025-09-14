import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Article } from '@/types/aliases';

type GetArticlesParams = { categoryId: number } | { articleId: number };

// Fetch articles by category ID or a single article by ID
export const getArticles = (
  params: GetArticlesParams,
): Promise<{ data: Article[] } | { data: Article }> => {
  if ('categoryId' in params) {
    return api.get(`/articles/category/${params.categoryId}`);
  } else if ('articleId' in params) {
    return api.get(`/articles/${params.articleId}`);
  }
  throw new Error('Invalid params for getArticles');
};

// Generate query options for react-query
export const getArticlesQueryOptions = (params: GetArticlesParams) => {
  const queryKey =
    'categoryId' in params
      ? ['articles', 'category', params.categoryId]
      : 'articleId' in params
        ? ['articles', 'article', params.articleId]
        : ['articles', 'unknown'];

  return queryOptions({
    queryKey,
    queryFn: () => getArticles(params),
  });
};

// Options for the useArticles hook
type UseArticlesOptions =
  | {
      parentId: number;
      articleId?: never;
      queryConfig?: QueryConfig<typeof getArticlesQueryOptions>;
    }
  | {
      parentId?: never;
      articleId: number;
      queryConfig?: QueryConfig<typeof getArticlesQueryOptions>;
    };

// Custom hook to fetch articles
export const useArticles = ({
  parentId,
  articleId,
  queryConfig,
}: UseArticlesOptions) => {
  const params =
    typeof parentId === 'number'
      ? { categoryId: parentId }
      : typeof articleId === 'number'
        ? { articleId }
        : (() => {
            throw new Error('Either parentId or articleId required');
          })();

  return useQuery({
    ...getArticlesQueryOptions(params),
    ...queryConfig,
  });
};
