import { useQuery, useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

import { useCategoryContext } from '../../context/useCategoryContext';
import PageLoader from '../PageLoader';

import SidebarArticle from './SidebarArticle';
import SubcategoryList from './SubcategoryList';

// Define types for Category and Article
interface Article {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
  children?: Category[];
  articles?: Article[];
  comingSoon?: boolean;
}

/**
 * Sidebar component for displaying categories and articles.
 * Slides in when a topic is selected, slides out when not.
 * @returns JSX.Element
 */
export default function Sidebar() {
  const { selectedTopic } = useCategoryContext(); // Get selected topic from context

  // Fetch topic name
  const {
    data: topicData,
    isLoading: isTopicLoading,
    isFetching: isTopicFetching,
    error: topicError,
  } = useQuery({
    queryKey: ['category', selectedTopic],
    queryFn: async () => {
      const res = await axios.get(`/api/categories/${selectedTopic}`);
      return res.data;
    },
    enabled: !!selectedTopic,
  });

  // Fetch subcategories
  const {
    data: subcategories = [],
    isLoading: isSubcategoriesLoading,
    isFetching: isSubcategoriesFetching,
    error: subcategoriesError,
  } = useQuery<Category[]>({
    queryKey: ['subcategories', selectedTopic],
    queryFn: async () => {
      const res = await axios.get<Category[]>(
        `/api/categories/${selectedTopic}/children`,
      );
      return res.data;
    },
    enabled: !!selectedTopic,
  });

  // Fetch articles for the topic
  const {
    data: articles = [],
    isLoading: isArticlesLoading,
    isFetching: isArticlesFetching,
    error: articlesError,
  } = useQuery<Article[]>({
    queryKey: ['articles', selectedTopic],
    queryFn: async () => {
      const res = await axios.get<Article[]>(
        `/api/articles/category/${selectedTopic}`,
      );
      return res.data;
    },
    enabled: !!selectedTopic,
  });

  // After fetching subcategories:
  const subcategoryIds = useMemo(
    () => subcategories.map((cat) => cat.id),
    [subcategories],
  );

  // Fetch articles for each subcategory using useQueries
  const subcategoryArticlesQueries = useQueries({
    queries: subcategoryIds.map((id) => ({
      queryKey: ['articles', id],
      queryFn: async () => {
        const res = await axios.get<Article[]>(`/api/articles/category/${id}`);
        return res.data;
      },
      enabled: !!id,
    })),
  });

  // Map subcategory id to its articles
  const subcategoryArticlesMap = useMemo(() => {
    const map: Record<number, Article[]> = {};
    subcategoryIds.forEach((id, idx) => {
      map[id] = subcategoryArticlesQueries[idx]?.data ?? [];
    });
    return map;
  }, [subcategoryIds, subcategoryArticlesQueries]);

  // Combine loading, fetching, and error states
  const isLoading =
    isTopicLoading || isSubcategoriesLoading || isArticlesLoading;
  const isRetrying =
    (isTopicFetching && !!topicError) ||
    (isSubcategoriesFetching && !!subcategoriesError) ||
    (isArticlesFetching && !!articlesError);
  const error =
    topicError?.message ||
    subcategoriesError?.message ||
    articlesError?.message ||
    null;

  // Sliding classes: slide in if topic selected, slide out if not
  const slideClasses = selectedTopic
    ? 'translate-x-0' // Visible (slide in from right)
    : '-translate-x-full'; // Off-screen (slide out to right)

  return (
    <aside
      className={`fixed bottom-0 left-0 top-14 w-64 transform overflow-y-auto border-r border-neutral-700 bg-neutral-900 p-4 transition-transform duration-300 ease-in-out ${slideClasses} z-20`}
    >
      {/* Loading, Error, or Content */}
      {isLoading ? (
        <div className="flex h-full items-center justify-center py-8">
          <PageLoader
            loading={true}
            error={error ?? undefined}
            isRetrying={isRetrying}
          />
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading topic: {error}</div>
      ) : (
        <>
          <h2 className="mb-4 border-b border-neutral-600 px-4 py-4 text-xl font-bold">
            {topicData?.name || 'No Topic Selected'}
          </h2>
          <div className="px-4">
            <SubcategoryList
              categories={subcategories}
              subcategoryArticlesMap={subcategoryArticlesMap}
            />

            <div className="mb-4">
              <label className="mb-2 block px-2 text-xs uppercase tracking-wider text-neutral-400">
                Articles
              </label>
              <div className="flex flex-col gap-1">
                {articles.map((article) => (
                  <SidebarArticle key={article.id} {...article} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
