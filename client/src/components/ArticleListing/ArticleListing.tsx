import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLoadingContext } from "../../context/useLoadingContext";
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
export default function ArticleListing({ categoryId, onHasArticles }: ArticleListingProps) {
  const { registerLoader, setLoaderDone } = useLoadingContext();
  const [articles, setArticles] = useState<Article[]>([]); // Initialize articles state
  const onHasArticlesRef = useRef(onHasArticles);

  useEffect(() => {
    const id = Math.random();
    console.log("AL mounted", { id });
    return () => console.log("AL unmounted", { id });
  }, []);


  // Fetch articles from API
  useEffect(() => {
    if (!categoryId) return; // <-- Prevents fetch if categoryId is undefined

    console.log("Effect ran", { categoryId });
    const loaderId = registerLoader();
    fetch(`/api/navigation/article-summaries/${categoryId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject("No response")))
      .then((data) => {
        console.log("Fetched", data);
        setArticles(data);
        onHasArticlesRef.current?.(data.length > 0);
      })
      .catch((err) => console.error("Failed to load articles:", err))
      .finally(() => {
        console.log("Loader done", loaderId);
        setLoaderDone(loaderId);
      });
  }, [categoryId, registerLoader, setLoaderDone]);

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