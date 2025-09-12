import { api } from '@/lib/api-client';
import { Article } from '@/types/aliases';

type GetArticlesParams = {
  categoryId: number;
};

// Fetch articles by category ID
export const getArticles = ({
  categoryId,
}: GetArticlesParams): Promise<{ data: Article[] }> => {
  return api.get('/articles', {
    params: {
      categoryId,
    },
  });
};
