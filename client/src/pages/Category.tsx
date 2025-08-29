import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import ArticleListing from "../components/ArticleListing/ArticleListing";
import PageLoader from "../components/PageLoader/PageLoader";
import { categoryVisuals } from "../components/CategoryCard/categoryVisual";
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
  const { id } = useParams<{ id: string }>();
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [hasArticles, setHasArticles] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    // Fetch subcategories and articles based on category ID
    Promise.all([
      fetch(`/api/categories/${id}`).then((res) => res.json()),
      fetch(`/api/categories/${id}/children`).then((res) => res.json()),
    ])
      .then(([cat, subcats]) => {
        setCategoryName(cat.name);
        setSubcategories(subcats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching category data:", err);
      });
  }, [id]);

  return (
    <PageLoader loading={loading}>
      <div className={styles.category}>
        <div className={styles.topSection}>
          <h1>{categoryName}</h1>
          {subcategories.length > 0 && (
            <>
              <h2>Subcategories</h2>
              <div className={styles.subcategories}>
                {subcategories.map((cat) => {
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
        <div className={styles.articlesSection}>
          {hasArticles && <h2>Articles</h2>}
          <ArticleListing onHasArticles={setHasArticles} />
        </div>
      </div>
    </PageLoader>
  );
}

export default Category;
