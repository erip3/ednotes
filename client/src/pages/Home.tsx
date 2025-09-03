import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingContext } from "../context/useLoadingContext";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import PageLoader from "../components/PageLoader/PageLoader";

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
  const { registerLoader, setLoaderDone, isLoading } = useLoadingContext();
  const [categories, setCategories] = useState<Category[]>([]); // State to hold categories
  const [error, setError] = useState<string | null>(null); // State to track error messages
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Fetch categories from API
  useEffect(() => {
    const loaderId = registerLoader();
    fetch("/api/categories/top-level")
      .then((res) => (res.ok ? res.json() : Promise.reject("No response")))
      .then(setCategories)
      .catch(() => setError("Could not load categories."))
      .finally(() => setLoaderDone(loaderId));
  }, [registerLoader, setLoaderDone]);

  // Render loading state or categories
  return (
    <PageLoader loading={isLoading}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <h1>EdNotes</h1>
        <p style={{ color: "#888" }}>Choose a category to get started:</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 24 }}
        >
          {categories.map((cat) => (
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
          ))}
        </div>
      </div>
    </PageLoader>
  );
}

export default Home;
