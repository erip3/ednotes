import { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { getArticlesQueryOptions } from '@/features/articles/api/get-articles';
import { ArticleList } from '@/features/articles/components/article-list';
import { getCategoriesQueryOptions } from '@/features/categories/api/get-categories';
import { CategoryGrid } from '@/features/categories/components/category-grid';
import { useCategoryStore } from '@/stores/category-store';
import { Article } from '@/types/aliases';
import { Category } from '@/types/aliases';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: { categoryId: string } }) => {
    const parentId = Number(params.categoryId);

    // Fetch categories (parent + children)
    const categoriesQuery = getCategoriesQueryOptions({
      parentId: parentId,
      getParentInfo: true,
    });
    const { parent, children } = (queryClient.getQueryData(
      categoriesQuery.queryKey,
    ) ?? (await queryClient.fetchQuery(categoriesQuery))) as {
      parent: { id: number; title: string; parentId?: number | null };
      children: Array<{ id: number; title: string; parentId?: number | null }>;
    };

    // Fetch articles for this category
    const articlesQuery = getArticlesQueryOptions({ categoryId: parentId });
    const articles =
      queryClient.getQueryData(articlesQuery.queryKey) ??
      (await queryClient.fetchQuery(articlesQuery));

    return { parent, children: children ?? [], articles };
  };

const CategoryPage = () => {
  const { parent, children, articles } = useLoaderData() as {
    parent: { id: number; title: string; parentId?: number | null };
    children: Array<Category>;
    articles: Array<Article>;
  };
  const setCurrentCategory = useCategoryStore((s) => s.setCurrentCategory);

  useEffect(() => {
    setCurrentCategory(parent);
  }, [parent, setCurrentCategory]);

  return (
    <ContentLayout
      title={parent.title}
      parentId={parent.parentId || null || undefined}
    >
      <CategoryGrid categories={children} />
      <div className="mt-8">
        {articles.length > 0 && (
          <>
            <h2 className="mb-4 text-2xl font-semibold">Articles</h2>
            <ArticleList articles={articles} />
          </>
        )}
      </div>
    </ContentLayout>
  );
};

export default CategoryPage;
