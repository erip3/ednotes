import { useCategoryContext } from "../../context/useCategoryContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import SubcategoryList from "./SubcategoryList";
import ArticleList from "./ArticleList";

interface Article {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
  children?: Category[];
  articles?: Article[];
  comingSoon?: boolean;
}

/**
 * Sidebar component for displaying categories and articles.
 * Slides in when a topic is selected, slides out when not.
 * @returns JSX.Element
 */
export default function Sidebar() {
  const { selectedTopic } = useCategoryContext();

  // Fetch topic name
  const {
    data: topicData,
    isLoading: isTopicLoading,
    error: topicError,
  } = useQuery({
    queryKey: ["category", selectedTopic],
    queryFn: async () => {
      const res = await axios.get(`/api/categories/${selectedTopic}`);
      return res.data;
    },
    enabled: !!selectedTopic,
  });

  // Fetch subcategories
  const { data: subcategories = [], isLoading: isSubcategoriesLoading } =
    useQuery<Category[]>({
      queryKey: ["subcategories", selectedTopic],
      queryFn: async () => {
        const res = await axios.get<Category[]>(
          `/api/categories/${selectedTopic}/children`
        );
        return res.data;
      },
      enabled: !!selectedTopic,
    });

  // Fetch articles
  const { data: articles = [], isLoading: isArticlesLoading } = useQuery<
    Article[]
  >({
    queryKey: ["articles", selectedTopic],
    queryFn: async () => {
      const res = await axios.get<Article[]>(
        `/api/articles/category/${selectedTopic}`
      );
      return res.data;
    },
    enabled: !!selectedTopic,
  });

  const isLoading =
    isTopicLoading || isSubcategoriesLoading || isArticlesLoading;

  // Sliding classes: slide in if topic selected, slide out if not
  const slideClasses = selectedTopic
    ? "translate-x-0" // Visible (slide in from right)
    : "translate-x-full"; // Off-screen (slide out to right)

  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 w-64 bg-bg text-text p-4 border-r border-gray-700 overflow-y-auto transition-transform duration-300 ease-in-out transform ${slideClasses} z-20`}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : topicError ? (
        <div className="text-red-500">
          Error loading topic: {topicError.message}
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4 px-4 py-4 border-b border-gray-600">
            {topicData?.name || "No Topic Selected"}
          </h2>
          <div className="px-4">
            <SubcategoryList categories={subcategories} />
            <ArticleList articles={articles} />
          </div>
        </>
      )}
    </aside>
  );
}
