/**
 * @module app/pages/category
 * @description Page that displays a single category with its subcategories and related articles.
 *
 * Functionality:
 * - **Data loading**: Pre-fetches parent category, children, and articles via React Query
 * - **Navigation**: Uses `ContentLayout` with breadcrumb to navigate back to parent category
 * - **Presentation**: Renders a grid of child categories and a list of articles ( @see CategoryGrid , @see ArticleList )
 * - **Error handling**: Validates category id and existence; throws HTTP responses for router error boundaries
 *
 * Data flow:
 * 1. `clientLoader` fetches `parent` + `children` via `getCategoriesQueryOptions`
 * 2. `clientLoader` fetches `articles` for the given `categoryId` via `getArticlesQueryOptions`
 * 3. Loader returns `LoaderData` consumed by `useLoaderData()` in the component
 * 4. Component renders `CategoryGrid` and `ArticleList` inside `ContentLayout`
 *
 * @example
 * // In route configuration (create-router.tsx)
 * {
 *   path: '/categories/:categoryId',
 *   lazy: () => import('./pages/category').then(convert(queryClient)),
 *   errorElement: <MainErrorFallback />
 * }
 */

import { QueryClient } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { ArticleList } from '@/features/articles/components/article-list';
import {
  getBreadcrumbsQueryOptions,
  getCategoriesQueryOptions,
} from '@/features/categories/api/get-categories';
import { CategoryGrid } from '@/features/categories/components/category-grid';
import { CategorySummary, FolderContent } from '@/types/aliases';

/**
 * Loader return shape consumed by the category page component.
 * @typedef {Object} LoaderData
 * @property {CategoriesWithParent['parent']} parent - The current category being viewed.
 * @property {CategoriesWithParent['children']} children - The child categories of the current category.
 * @property {Article[]} articles - Articles that belong to the current category.
 */
type LoaderData = {
  title: string;
  parentId?: number;
  children: NonNullable<FolderContent['subCategories']>;
  articles: NonNullable<FolderContent['articles']>;
};

/**
 * Client-side data loader for the category page.
 *
 * Fetches folder content and breadcrumbs for the given `categoryId`.
 * Uses React Query for caching and deduplication. Throws HTTP responses to be handled by the route's
 * `errorElement` when validation or existence checks fail.
 *
 * @param {QueryClient} queryClient - TanStack Query client used for cache and fetch operations.
 * @returns {(args: { params: { categoryId: string } }) => Promise<LoaderData>} Async loader function.
 * @throws {Response} 400 if `categoryId` is not a valid number.
 *
 * @remarks
 * - Validates `categoryId` is a positive integer before querying.
 * - Prefers cached data via `getQueryData` and falls back to `fetchQuery` as needed.
 * - Uses breadcrumbs to derive the current title and back-navigation target.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: { categoryId: string } }) => {
    const parentId = Number(params.categoryId);

    // Validate categoryId param
    if (Number.isNaN(parentId)) {
      throw new Response('Invalid category id', { status: 400 });
    }

    const categoriesQuery = getCategoriesQueryOptions({ categoryId: parentId });
    const breadcrumbsQuery = getBreadcrumbsQueryOptions(parentId);

    const folderContent =
      (queryClient.getQueryData(categoriesQuery.queryKey) as
        | FolderContent
        | undefined) ??
      ((await queryClient.fetchQuery(categoriesQuery)) as FolderContent);

    const breadcrumbs =
      (queryClient.getQueryData(breadcrumbsQuery.queryKey) as
        | CategorySummary[]
        | undefined) ??
      ((await queryClient.fetchQuery(breadcrumbsQuery)) as CategorySummary[]);

    if (!breadcrumbs.length) {
      throw new Response('Category not found', { status: 404 });
    }

    const current = breadcrumbs[breadcrumbs.length - 1];
    const parentIdForLayout = breadcrumbs[breadcrumbs.length - 2]?.id;

    return {
      title: current.title ?? 'Category',
      parentId: parentIdForLayout,
      children: folderContent.subCategories ?? [],
      articles: folderContent.articles ?? [],
    } satisfies LoaderData;
  };

/**
 * CategoryPage component - Displays the current category, its subcategories, and articles.
 *
 * Renders `CategoryGrid` for the list of child categories and `ArticleList` for the category's articles.
 * Uses `ContentLayout` to provide consistent page structure and breadcrumb navigation via `parentId`.
 *
 * @returns {JSX.Element} Category page with header and content sections.
 *
 * @example
 * // Rendered by React Router when navigating to /categories/:categoryId
 * const { parent, children, articles } = useLoaderData() as LoaderData;
 * // Component then renders CategoryGrid and ArticleList with the provided data
 */
const CategoryPage = () => {
  const { title, parentId, children, articles } = useLoaderData() as LoaderData;

  return (
    <ContentLayout title={title} parentId={parentId}>
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
