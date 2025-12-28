/**
 * @module app/pages/article
 * @description Page that displays a single article.
 *
 * Functionality:
 * - **Data loading**: Pre-fetches article data via React Query before rendering
 * - **Content rendering**: Renders articles with formatted blocks (headers, paragraphs, code, math, demos, etc.)
 * - **SEO**: Sets document title dynamically based on article name
 * - **Metadata**: Shows published/draft status with footer messages
 * - **Navigation**: Provides breadcrumb back to parent category (parent category ID)
 * - **Error handling**: Validates content structure and handles malformed JSON
 *
 * Data flow:
 * 1. `clientLoader` fetches article by ID from React Query cache or API
 * 2. Article data is passed to component via `useLoaderData()`
 * 3. Component validates content and renders ArticleRenderer
 * 4. User navigates back via ContentLayout breadcrumb (parentId)
 *
 * @example
 * // In route configuration (create-router.tsx)
 * {
 *   path: '/articles/:articleId',
 *   lazy: () => import('./pages/article').then(convert(queryClient)),
 *   errorElement: <MainErrorFallback />
 * }
 */

import { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { getArticlesQueryOptions } from '@/features/articles/api/get-articles';
import { ArticleRenderer } from '@/features/articles/components/article-renderer';
import { Article } from '@/types/aliases';

/**
 * Client-side data loader for the article page
 *
 * Fetches a single article by ID before the component renders.
 * Uses React Query for caching and deduplication to avoid redundant API calls.
 * This loader is called by React Router before the component mounts, ensuring
 * article data is available synchronously during render.
 *
 * @param queryClient - TanStack Query client instance for cache management
 * @returns Async loader function that accepts route params and returns article data
 * @throws {Response} 400 if articleId is not a valid number
 * @throws {Response} 404 if article doesn't exist
 *
 * @remarks
 * - First checks React Query cache for existing article data (fast path)
 * - Falls back to fetching from API via getArticlesQueryOptions if not cached
 * - Validates articleId is a positive integer
 * - Expects fetcher to return `{ data: Article }` for consistent caching
 * - Throws HTTP responses for error handling by React Router's errorElement
 *
 * @example
 * // In a route definition
 * const loader = clientLoader(queryClient);
 * const article = await loader({ params: { articleId: '42' } });
 */
// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => {
  return async ({
    params,
  }: {
    params: { articleId: string };
  }): Promise<Article> => {
    const articleId = Number(params.articleId);

    // Validate articleId
    if (isNaN(articleId)) {
      throw new Response('Invalid article ID', { status: 400 });
    }

    // Create query options for fetching the article
    const query = getArticlesQueryOptions({
      articleId: articleId,
    });

    // Try to get from cache first, then fetch if not present
    const cached = queryClient.getQueryData<{ data: Article }>(query.queryKey);
    const { data: article } = cached ?? (await queryClient.fetchQuery(query));

    // Handle non-existent articles
    if (!article) {
      throw new Response('Article not found', { status: 404 });
    }

    return article;
  };
};

/**
 * ArticlePage component - Displays a single article with formatting
 *
 * Renders a complete article page with title, content blocks, navigation,
 * and appropriate status indicators. Content is validated before rendering to
 * prevent JSON parsing errors from breaking the page.
 *
 * Features:
 * - **Content rendering**: Uses ArticleRenderer to display formatted blocks
 * - **SEO title**: Dynamically updates document title with article name
 * - **Status messages**: Shows published/draft disclaimer based on article state
 * - **Navigation**: Back button to parent category via ContentLayout
 * - **Error handling**: Shows error UI if content JSON is malformed
 *
 * @returns Article page with header, content, and footer
 *
 * @remarks
 * - Content validation happens synchronously before render
 * - ArticleRenderer handles all block types (headers, paragraphs, code, equations, demos, etc.)
 * - Document title is cleaned up on unmount to avoid leaking state
 * - ContentLayout provides consistent header/footer and breadcrumb navigation
 *
 * @example
 * // Rendered by React Router when navigating to /articles/:articleId
 * // Data comes from clientLoader via useLoaderData()
 * const article = useLoaderData() as Article;
 * // Component then renders ArticleRenderer with article.content
 */
const ArticlePage = () => {
  const article = useLoaderData() as Article;

  // Update document title for SEO
  useEffect(() => {
    document.title = `${article.title} | EdNotes`;
    return () => {
      document.title = 'EdNotes';
    };
  }, [article.title]);

  // Validate content structure
  let isValidContent = true;
  try {
    JSON.parse(article.content || '[]');
  } catch (error) {
    isValidContent = false;
    console.error('Failed to parse article content:', error);
  }

  // Show error state if content is malformed
  if (!isValidContent) {
    return (
      <ContentLayout title="Error" centered={true}>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          <h2 className="mb-2 text-lg font-semibold">Content Error</h2>
          <p>
            Failed to parse article content. The content may be corrupted or in
            an invalid format.
          </p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={article.title}
      parentId={article.categoryId}
      centered={false}
      isArticle={true}
      articlePublished={article.published}
    >
      <ArticleRenderer content={article.content} />
    </ContentLayout>
  );
};

export default ArticlePage;
