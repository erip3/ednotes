import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import styles from "./ArticleListing.module.css";

// Props for the ArticleListing component
interface ArticleListingProps {
  categoryId: string;
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
export default function ArticleListing({
  categoryId,
  onHasArticles,
}: ArticleListingProps) {
  const onHasArticlesRef = useRef(onHasArticles);

  // Fetch articles
  const {
    data: articles = [],
    isLoading,
    isError,
  } = useQuery<Article[]>({
    queryKey: ["articles", categoryId],
    queryFn: async () => {
      const res = await axios.get<Article[]>(
        `/api/navigation/article-summaries/${categoryId}`
      );
      return res.data;
    },
    enabled: !!categoryId,
  });

  // Notify parent if articles exist
  useEffect(() => {
    onHasArticlesRef.current?.(articles.length > 0);
  }, [articles]);

  if (isLoading) {
    return <div className={styles.container}>Loading articles...</div>;
  }

  if (isError) {
    return <div className={styles.container}>Failed to load articles.</div>;
  }

  // Render the article listing
  return (
    <div className={styles.container}>
      {articles.map((article) => (
        <div key={article.id} className={styles.entry}>
          <span className={styles.title}>
            <Link to={`/article/${article.id}`}>{article.title}</Link>
          </span>
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
