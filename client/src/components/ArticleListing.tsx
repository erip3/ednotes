import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./ArticleListing.module.css";

// Props for the ArticleListing component
interface ArticleListingProps {
  onHasArticles?: (has: boolean) => void;
}

// Article interface representing a blog article
interface Article {
  id: number;
  title: string;
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
 * ArticleListing component displays a list of articles.
 * @returns JSX.Element
 */
function ArticleListing({ onHasArticles }: ArticleListingProps) {
  const { id: categoryId } = useParams<{ id: string }>();
  const [articles, setArticles] = useState<Article[]>([]); // Initialize articles state
  const [loading, setLoading] = useState(true);

  // Fetch articles from API
  useEffect(() => {
    setLoading(true);
    fetch(`/api/navigation/article-summaries/${categoryId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject("No response")))
      .then((data) => {
        setArticles(data);
        onHasArticles?.(data.length > 0);
      })
      .catch((err) => console.error("Failed to load articles:", err))
      .finally(() => setLoading(false));
  }, [categoryId, onHasArticles]);

  if (loading) return <p>Loading articles...</p>;

  // Render the article listing
  return (
    <div className={styles.container}>
      {articles.map((article) => (
        <div key={article.id} className={styles.entry}>
          <span className={styles.title}>
            <Link to={`/article/${article.id}`}>{article.title}</Link>
          </span>
          {/* <span className={styles.author}>{article.author}</span> */}
          <span className={styles.date}>
            Published on {formatDate(article.createdAt)}
            {article.updatedAt && article.updatedAt !== article.createdAt
              ? ` (Updated ${formatDate(article.updatedAt)})`
              : ""}
          </span>
          <span className={styles.status}>
            {!article.isPublished && (
              <span className={styles["draft-label"]}>Draft</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ArticleListing;