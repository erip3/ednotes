import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLoader from "../components/PageLoader/PageLoader";

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
function Article() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch(`/api/articles/${id}`)])
      .then(([res]) => (res.ok ? res.json() : Promise.reject("No response")))
      .then(setArticle)
      .catch((err) => console.error("Failed to load article:", err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PageLoader loading={loading}>
      {article && (
        <div>
          <h1>{article.title}</h1>
          <p>Published on {formatDate(article.createdAt)}</p>
          {article.updatedAt && article.updatedAt !== article.createdAt && (
            <p>Updated on {formatDate(article.updatedAt)}</p>
          )}
          <p>{article.content}</p>
        </div>
      )}
    </PageLoader>
  );
}

export default Article;
