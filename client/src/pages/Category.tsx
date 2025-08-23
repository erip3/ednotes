import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import ArticleListing from "../components/ArticleListing";

// Category interface represents a single category.
interface Category {
  id: number;
  name: string;
}

/**
 * Category page displays articles and subcategories for a specific category.
 * @returns JSX.Element
 */
function Category() {
  const { id } = useParams<{ id: string }>();
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <h1>{categoryName}</h1>
      <h2>Subcategories</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
        }}
      >
        {subcategories.map((cat) => (
          <CategoryCard
            key={cat.id}
            name={cat.name}
            onClick={() => navigate(`/category/${cat.id}`)}
          />
        ))}
      </div>
      <h2>Articles</h2>
      <ArticleListing />
    </div>
  );
}

export default Category;