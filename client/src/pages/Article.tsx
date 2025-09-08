import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../components/PageLoader";
import ContentRenderer from "../components/ContentRenderer/ContentRenderer";

// Article interface represents the structure of an article object.
interface Article {
  id: number;
  title: string;
  content: string;
  isPublished: boolean;
}

/**
 * Article component displays a single article.
 * @returns JSX.Element
 */
export default function Article() {
  const { id } = useParams<{ id: string }>();

  // Fetch article data
  const {
    data: article,
    isLoading,
    isFetching,
    error,
  } = useQuery<Article>({
    queryKey: ["article", id],
    queryFn: async () => {
      const res = await axios.get<Article>(`/api/articles/${id}`);
      return res.data;
    },
  });

  return (
    <PageLoader
      loading={isLoading}
      error={error ? "Failed to load data. Retrying..." : undefined}
      isRetrying={isFetching && !!error}
    >
      {article && !error && (
        <div className="max-w-3xl mx-auto my-8 px-4">
          <h1 className="text-5xl font-bold pb-4">{article.title}</h1>
          <div className="py-8">
            <ContentRenderer
              blocks={
                typeof article.content === "string"
                  ? JSON.parse(article.content)
                  : article.content
              }
            />
          </div>
        </div>
      )}
    </PageLoader>
  );
}
