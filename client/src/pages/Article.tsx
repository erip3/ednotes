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
  author: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

/**
 * Formats a date string into a more readable format.
 * @param dateString The date string to format.
 * @returns The formatted date string.
 */
function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
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
    error,
  } = useQuery<Article>({
    queryKey: ["article", id],
    queryFn: async () => {
      const res = await axios.get<Article>(`/api/articles/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <PageLoader loading={isLoading} />;

  return (
    <PageLoader loading={isLoading}>
      {article && !error && (
        <div>
          <h1 className="text-5xl font-bold">{article.title}</h1>
          {article.createdAt && <p>Published on {formatDate(article.createdAt)}</p>}
          {article.updatedAt && article.updatedAt !== article.createdAt && (
            <p>Updated on {formatDate(article.updatedAt)}</p>
          )}
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
