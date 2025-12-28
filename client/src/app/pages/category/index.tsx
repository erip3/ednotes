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
import { getArticlesQueryOptions } from '@/features/articles/api/get-articles';
import { ArticleList } from '@/features/articles/components/article-list';
import { getCategoriesQueryOptions } from '@/features/categories/api/get-categories';
import { CategoryGrid } from '@/features/categories/components/category-grid';
import { Article, CategoriesWithParent } from '@/types/aliases';

/**
 * Loader return shape consumed by the category page component.
 * @typedef {Object} LoaderData
 * @property {CategoriesWithParent['parent']} parent - The current category being viewed.
 * @property {CategoriesWithParent['children']} children - The child categories of the current category.
 * @property {Article[]} articles - Articles that belong to the current category.
 */
type LoaderData = {
  parent: CategoriesWithParent['parent'];
  children: CategoriesWithParent['children'];
  articles: Article[];
};

/**
 * Client-side data loader for the category page.
 *
 * Fetches parent category details (and its children) along with articles for the given `categoryId`.
 * Uses React Query for caching and deduplication. Throws HTTP responses to be handled by the route's
 * `errorElement` when validation or existence checks fail.
 *
 * @param {QueryClient} queryClient - TanStack Query client used for cache and fetch operations.
 * @returns {(args: { params: { categoryId: string } }) => Promise<LoaderData>} Async loader function.
 * @throws {Response} 400 if `categoryId` is not a valid number.
 * @throws {Response} 404 if the category does not exist.
 *
 * @remarks
 * - Validates `categoryId` is a positive integer before querying.
 * - Prefers cached data via `getQueryData` and falls back to `fetchQuery` as needed.
 * - Expects categories query to return `CategoriesWithParent` with a defined `parent`.
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

    // Fetch categories (parent + children)
    const categoriesQuery = getCategoriesQueryOptions({
      parentId,
      getParentInfo: true,
    });
    const categories =
      (queryClient.getQueryData(categoriesQuery.queryKey) as
        | CategoriesWithParent
        | undefined) ??
      ((await queryClient.fetchQuery(categoriesQuery)) as CategoriesWithParent);

    if (!categories?.parent) {
      throw new Response('Category not found', { status: 404 });
    }

    // Fetch articles for this category
    const articlesQuery = getArticlesQueryOptions({ categoryId: parentId });
    const cachedArticles = queryClient.getQueryData<{ data: Article[] }>(
      articlesQuery.queryKey,
    );
    const { data: articles } =
      cachedArticles ?? (await queryClient.fetchQuery(articlesQuery));

    return {
      parent: categories.parent,
      children: categories.children ?? [],
      articles: articles ?? [],
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
  const { parent, children, articles } = useLoaderData() as LoaderData;

  return (
    <ContentLayout title={parent.title} parentId={parent.parentId ?? undefined}>
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
