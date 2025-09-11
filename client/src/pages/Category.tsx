import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCategoryContext } from "../context/useCategoryContext";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import ArticleListing from "../components/ArticleListing";
import PageLoader from "../components/PageLoader";

// Category interface represents a single category.
interface Category {
  id: number;
  name: string;
  comingSoon?: boolean;
  isTopic: boolean;
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
    queryKey: ["category", id],
    queryFn: async () => {
      const res = await axios.get<Category>(`/api/categories/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Update selectedTopic in context whenever id changes
  useEffect(() => {
    if (id && categoryData && categoryData.isTopic) {
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
    queryKey: ["subcategories", id],
    queryFn: async () => {
      const res = await axios.get<Category[]>(`/api/categories/${id}/children`);
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
    queryKey: ["articles", id],
    queryFn: async () => {
      const res = await axios.get<Article[]>(
        `/api/navigation/article-summaries/${id}`
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
    articlesError?.message ||
    null;

  return (
    <PageLoader
      loading={loading}
      error={error ?? undefined}
      isRetrying={isRetrying}
    >
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center justify-center w-full box-border bg-inherit z-10 pb-16">
          <h1 className="text-5xl font-bold">{categoryData?.name ?? ""}</h1>

          {/* If subcategories exist, display them */}
          {Array.isArray(subcategories) && subcategories.length > 0 && (
            <>
              <h2 className="text-lg text-neutral-400 top py-4">
                Subcategories
              </h2>
              <div className="flex flex-wrap gap-4 mt-6 justify-center">
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
            <h2 className="text-lg text-neutral-400 top py-4">Articles</h2>
          )}
          <ArticleListing
            articles={articles}
          />
        </div>
      </div>
    </PageLoader>
  );
}

export default Category;
