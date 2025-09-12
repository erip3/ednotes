import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ArticleListing from '../components/ArticleListing';
import CategoryCard from '../components/CategoryCard/CategoryCard';
import PageLoader from '../components/PageLoader';
import { useCategoryContext } from '../context/useCategoryContext';

// Category interface represents a single category.
interface Category {
  id: number;
  name: string;
  comingSoon?: boolean;
  topic: boolean;
}

interface Article {
  id: number;
  title: string;
  isPublished: boolean;
  createdAt?: string;
}

function Category() {
  const { id } = useParams<Record<string, string>>();
  const navigate = useNavigate();
  const { setSelectedTopic } = useCategoryContext();

  // Fetch category info
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isFetching: isCategoryFetching,
    error: categoryError,
  } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: async () => {
      const res = await axios.get<Category>(`/api/categories/${id}`);
      console.log('Category Data:', res.data);
      return res.data;
    },
    enabled: !!id,
  });

  // Update selectedTopic in context whenever id changes
  useEffect(() => {
    if (id && categoryData && categoryData.topic) {
      setSelectedTopic(Number(id));
    }
  }, [id, setSelectedTopic, categoryData]);

  // Fetch subcategories
  const {
    data: subcategories,
    isLoading: isSubcategoriesLoading,
    isFetching: isSubcategoriesFetching,
    error: subcategoriesError,
  } = useQuery<Category[]>({
    queryKey: ['subcategories', id],
    queryFn: async () => {
      const res = await axios.get<Category[]>(`/api/categories/${id}/children`);
      console.log('Subcategories:', res.data);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch articles for this category
  const {
    data: articles = [],
    isLoading: isArticlesLoading,
    isFetching: isArticlesFetching,
    error: articlesError,
  } = useQuery<Article[]>({
    queryKey: ['articles', id],
    queryFn: async () => {
      const res = await axios.get<Article[]>(
        `/api/navigation/article-summaries/${id}`,
      );
      return res.data;
    },
    enabled: !!id,
  });

  // Combine loading/error states
  const loading =
    isCategoryLoading || isSubcategoriesLoading || isArticlesLoading;
  const isRetrying =
    (isCategoryFetching && !!categoryError) ||
    (isSubcategoriesFetching && !!subcategoriesError) ||
    (isArticlesFetching && !!articlesError);
  const error =
    categoryError?.message ||
    subcategoriesError?.message ||
    articlesError?.message;

  return (
    <PageLoader
      loading={loading}
      error={error ?? undefined}
      isRetrying={isRetrying}
    >
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <div className="z-10 box-border flex w-full flex-col items-center justify-center bg-inherit pb-16">
          <h1 className="text-5xl font-bold">{categoryData?.name}</h1>

          {/* If subcategories exist, display them */}
          {Array.isArray(subcategories) && subcategories.length > 0 && (
            <>
              <h2 className="top py-4 text-lg text-neutral-400">
                Subcategories
              </h2>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {subcategories.map((cat: Category) => {
                  return (
                    <CategoryCard
                      key={cat.id}
                      name={cat.name}
                      comingSoon={cat.comingSoon}
                      onClick={
                        cat.comingSoon
                          ? undefined
                          : () => navigate(`/category/${cat.id}`)
                      }
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Articles Section */}
        <div className="flex flex-col items-center justify-center">
          {articles.length > 0 && (
            <h2 className="top py-4 text-lg text-neutral-400">Articles</h2>
          )}
          <ArticleListing articles={articles} />
        </div>
      </div>
    </PageLoader>
  );
}

export default Category;
