import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Category } from '@/types/aliases';

type GetCategoriesParams =
  | { parentId: number; getParentInfo?: boolean }
  | { topLevel: true };

type CategoriesWithParent = {
  parent: Category;
  children: Category[];
};

// Fetch categories by parent category ID
export const getCategories = (
  params: GetCategoriesParams,
): Promise<{ data: Category[] } | CategoriesWithParent> => {
  if ('topLevel' in params && params.topLevel) {
    return api.get('categories/top-level');
  } else if ('parentId' in params) {
    if (params.getParentInfo) {
      // Call the new backend endpoint
      return api.get(`categories/${params.parentId}/with-children`);
    }
    return api.get(`categories/${params.parentId}/children`);
  }
  throw new Error('Invalid params for getCategories');
};

// Generate query options for react-query
export const getCategoriesQueryOptions = (params: GetCategoriesParams) => {
  const queryKey =
    'topLevel' in params && params.topLevel
      ? ['categories', 'top-level']
      : 'parentId' in params
        ? ['categories', params.parentId, params.getParentInfo]
        : ['categories', undefined];

  return queryOptions({
    queryKey,
    queryFn: () => getCategories(params),
  });
};

// Options for the useCategories hook
type UseCategoriesOptions = {
  parentId?: number | null;
  getParentInfo?: boolean;
  topLevel?: boolean;
  queryConfig?: QueryConfig<typeof getCategoriesQueryOptions>;
};

// Custom hook to fetch categories
export const useCategories = ({
  parentId,
  getParentInfo,
  topLevel,
  queryConfig,
}: UseCategoriesOptions) => {
  const params: GetCategoriesParams = topLevel
    ? { topLevel: true }
    : parentId !== undefined && parentId !== null
      ? { parentId, getParentInfo }
      : (() => {
          throw new Error('Either topLevel or parentId required');
        })();

  return useQuery({
    ...getCategoriesQueryOptions(params),
    ...queryConfig,
  });
};
