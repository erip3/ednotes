import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLoadingContext } from "../context/useLoadingContext";
import PageLoader from "../components/PageLoader/PageLoader";
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
function Article() {
  const { registerLoader, setLoaderDone, isLoading } = useLoadingContext();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const loaderId = registerLoader();
    Promise.all([fetch(`/api/articles/${id}`)])
      .then(([res]) => (res.ok ? res.json() : Promise.reject("No response")))
      .then(setArticle)
      .catch((err) => console.error("Failed to load article:", err))
      .finally(() => setLoaderDone(loaderId));
  }, [id, registerLoader, setLoaderDone]);

  if (isLoading) return <PageLoader loading={isLoading} />;

  return (
    <PageLoader loading={isLoading}>
      {article && (
        <div>
          <h1>{article.title}</h1>
          <p>Published on {formatDate(article.createdAt)}</p>
          {article.updatedAt && article.updatedAt !== article.createdAt && (
            <p>Updated on {formatDate(article.updatedAt)}</p>
          )}
          <div className="article-page">
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

export default Article;
