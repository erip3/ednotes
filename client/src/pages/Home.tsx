import { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";

interface Category {
  id: number;
  name: string;
}

/**
 * Home component displays the top-level categories.
 * @returns JSX.Element
 */
function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories/top-level")
      .then((res) => (res.ok ? res.json() : Promise.reject("No response")))
      .then(setCategories)
      .catch(() => setError("Could not load categories."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>EdNotes</h1>
      <p style={{ color: "#888" }}>Choose a category to get started:</p>
      {loading && <p>Loading categories...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 24 }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} name={cat.name} />
        ))}
      </div>
    </div>
  );
}

export default Home;
