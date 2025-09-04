import { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCategoryContext } from "../context/useCategoryContext";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import { categoryVisuals } from "../components/CategoryCard/categoryVisual";
import ArticleListing from "../components/ArticleListing/ArticleListing";
import PageLoader from "../components/PageLoader";

// Category interface represents a single category.
interface Category {
  id: number;
  name: string;
  comingSoon?: boolean;
  isTopic: boolean;
}

/**
 * Category page displays articles and subcategories for a specific category.
 * @returns JSX.Element
 */
function Category() {
  const { id } = useParams<Record<string, string>>();
  const [hasArticles, setHasArticles] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setSelectedTopic } = useCategoryContext();

  // Fetch category info
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
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
      setSelectedTopic(Number(id)); // Convert to number (context expects number)
    }
  }, [id, setSelectedTopic, categoryData]);

  // Fetch subcategories
  const {
    data: subcategories,
    isLoading: isSubcategoriesLoading,
    error: subcategoriesError,
  } = useQuery<Category[]>({
    queryKey: ["subcategories", id],
    queryFn: async () => {
      const res = await axios.get<Category[]>(`/api/categories/${id}/children`);
      return res.data;
    },
    enabled: !!id,
  });

  // Callback to handle whether articles exist in the category
  const handleHasArticles = useCallback((has: boolean) => {
    setHasArticles(has);
  }, []);

  return (
    <PageLoader loading={isCategoryLoading || isSubcategoriesLoading}>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center justify-center w-full box-border bg-inherit z-10">
          <h1 className="text-5xl font-bold">{categoryData?.name ?? ""}</h1>

          {/* If subcategories exist, display them */}
          {Array.isArray(subcategories) && subcategories.length > 0 && (
            <>
              <h2 className="text-lg text-neutral-400 top py-4">
                Subcategories
              </h2>
              <div className="flex flex-wrap gap-4 mt-6">
                {subcategories.map((cat: Category) => {
                  const visuals = categoryVisuals[cat.id] || {};
                  return (
                    <CategoryCard
                      key={cat.id}
                      name={cat.name}
                      comingSoon={cat.comingSoon}
                      icon={visuals.icon}
                      accentColor={visuals.accentColor}
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
          {hasArticles && (
            <h2 className="text-lg text-neutral-400 top py-4">Articles</h2>
          )}
          <ArticleListing
            categoryId={id ?? ""}
            onHasArticles={handleHasArticles}
          />
        </div>

        {/* Error Messages */}
        {categoryError && (
          <div className="text-red-500">Error loading category info.</div>
        )}
        {subcategoriesError && (
          <div className="text-red-500">Error loading subcategories.</div>
        )}
      </div>
    </PageLoader>
  );
}

export default Category;
