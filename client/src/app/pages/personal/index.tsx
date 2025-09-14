import { QueryClient } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { getCategoriesQueryOptions } from '@/features/categories/api/get-categories';
import { getProjectsQueryOptions } from '@/features/personal/api/get-projects';
import { CategoryGrid } from '@/features/categories/components/category-grid';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: { categoryId: string } }) => {
    const parentId = Number(params.categoryId);

    // Fetch categories
    const categoriesQuery = getCategoriesQueryOptions({
      parentId: parentId,
    });
    const { children } = (queryClient.getQueryData(categoriesQuery.queryKey) ??
      (await queryClient.fetchQuery(categoriesQuery))) as {
      children: Array<{ id: number; name: string; parentId?: number | null }>;
    };

    return { children };
  };

const PersonalPage = () => {
  const categories = useLoaderData() as Array<{
    id: number;
    name: string;
    isTopic?: boolean;
  }>[];

  return (
    <ContentLayout title="Personal">
      {/* Add personal projects content here */}
      <CategoryGrid categories={categories} />
    </ContentLayout>
  );
};

export default PersonalPage;
