import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";

// Category interface represents a single category.
interface Category {
  id: number;
  name: string;
  comingSoon?: boolean;
}

/**
 * Home component displays the top-level categories.
 * @returns JSX.Element
 */
function Home() {
  const [categories, setCategories] = useState<Category[]>([]); // State to hold categories
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to track error messages
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Fetch categories from API
  useEffect(() => {
    fetch("/api/categories/top-level")
      .then((res) => (res.ok ? res.json() : Promise.reject("No response")))
      .then(setCategories)
      .catch(() => setError("Could not load categories."))
      .finally(() => setLoading(false));
  }, []);

  // Render loading state or categories
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh"
    }}>
      <h1>EdNotes</h1>
      <p style={{ color: "#888" }}>Choose a category to get started:</p>
      {loading && <p>Loading categories...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 24 }}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            name={cat.name}
            comingSoon={cat.comingSoon}
            onClick={cat.comingSoon ? undefined : () => navigate(`/category/${cat.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;