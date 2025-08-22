import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";

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
  const [articles, setArticles] = useState<{ title: string; id: number }[]>([]);
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    // Fetch subcategories and articles based on category ID
    Promise.all([
      fetch(`/api/categories/${id}`).then((res) => res.json()),
      fetch(`/api/categories/${id}/children`).then((res) => res.json()),
      fetch(`/api/articles/category/${id}`).then((res) => res.json()),
    ])
      .then(([cat, subcats, arts]) => {
        setCategoryName(cat.name);
        setSubcategories(subcats);
        setArticles(arts);
      })
      .catch((err) => {
        console.error("Error fetching category data:", err);
      });
  }, [id]);

  return (
    <div>
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
        }}
      >
        {articles.map((article) => (
          <h3 key={article.id}>{article.title}</h3>
        ))}
      </div>
    </div>
  );
}

export default Category;
