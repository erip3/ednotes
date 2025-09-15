import { QueryClient } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { getCategoriesQueryOptions } from '@/features/categories/api/get-categories';
import { CategoryGrid } from '@/features/categories/components/category-grid';
import { Category } from '@/types/aliases';

export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getCategoriesQueryOptions({ topLevel: true });
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

const HomePage = () => {
  const categories = useLoaderData() as Array<Category>;

  return (
    <ContentLayout
      title="EdNotes"
      subtitle="Choose a subcategory to get started"
    >
      <CategoryGrid categories={categories} />
    </ContentLayout>
  );
};

export default HomePage;
