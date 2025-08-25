import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

    useEffect(() => {
        fetch(`/api/articles/${id}`)
            .then((res) => (res.ok ? res.json() : Promise.reject("No response")))
            .then(setArticle)
            .catch((err) => console.error("Failed to load article:", err));
    }, [id]);

    if (!article) return <p>Loading article...</p>;

    return (
        <div>
            <h1>{article.title}</h1>
            {/* <p>By {article.author}</p> */}
            <p>Published on {formatDate(article.createdAt)}</p>
            {article.updatedAt && article.updatedAt !== article.createdAt && (
                <p>Updated on {formatDate(article.updatedAt)}</p>
            )}
            <p>{article.content}</p>
        </div>
    );
}

export default Article;