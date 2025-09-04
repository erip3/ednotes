import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import PageLoader from "../components/PageLoader";

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
export default function Home() {
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Fetch categories from API
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories", "top-level"],
    queryFn: async () => {
      const res = await axios.get<Category[]>("/api/categories/top-level");
      return res.data;
    },
  });

  // Render loading state or categories
  return (
    <PageLoader loading={isLoading}>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        {/* Title */}
        <h1 className="text-5xl font-bold">EdNotes</h1>
        <p className="text-lg text-neutral-400 top py-4">
          Choose a category to get started:
        </p>
        {error && <p className="text-red-500">Error loading categories.</p>}

        {/* Category Cards */}
        <div className="flex flex-wrap gap-4 mt-6">
          {categories &&
            categories.map((cat) => (
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
