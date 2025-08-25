import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import ArticleListing from "../components/ArticleListing";
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
      })
      .catch((err) => {
        console.error("Error fetching category data:", err);
      });
  }, [id]);

  return (
    <div className={styles.category}>
      <h1>{categoryName}</h1>
      {subcategories.length > 0 && (
        <>
          <h2>Subcategories</h2>
          <div className={styles.subcategories}>
            {subcategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                comingSoon={cat.comingSoon}
                onClick={cat.comingSoon ? undefined : () => navigate(`/category/${cat.id}`)}
              />
            ))}
          </div>
        </>
      )}
      {hasArticles && <h2>Articles</h2>}
      <ArticleListing onHasArticles={setHasArticles} />
    </div>
  );
}

export default Category;