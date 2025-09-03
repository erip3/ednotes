import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import { categoryVisuals } from "../components/CategoryCard/categoryVisual";
import ArticleListing from "../components/ArticleListing/ArticleListing";
import PageLoader from "../components/PageLoader";
import styles from "./Category.module.css";

// Category interface represents a single category.
interface Category {
  id: number;
  name: string;
  comingSoon?: boolean;
}

/**
 * Category page displays articles and subcategories for a specific category.
 * @returns JSX.Element
 */
function Category() {
  const { id } = useParams<Record<string, string>>();
  const [hasArticles, setHasArticles] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch category info
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery<{ name: string }>({
    queryKey: ["category", id],
    queryFn: async () => {
      const res = await axios.get<{ name: string }>(`/api/categories/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

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
      <div className={styles.category}>
        <div className={styles.topSection}>
          <h1>{categoryData?.name ?? ""}</h1>
          
          {/* If subcategories exist, display them */}
          {Array.isArray(subcategories) && subcategories.length > 0 && (
            <>
              <h2>Subcategories</h2>
              <div className={styles.subcategories}>
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
        <div className={styles.articlesSection}>
          {hasArticles && <h2>Articles</h2>}
          <ArticleListing
            categoryId={id ?? ""}
            onHasArticles={handleHasArticles}
          />
        </div>

        {/* Error Messages */}
        {categoryError && (
          <div className={styles.error}>Error loading category info.</div>
        )}
        {subcategoriesError && (
          <div className={styles.error}>Error loading subcategories.</div>
        )}
      </div>
    </PageLoader>
  );
}

export default Category;
