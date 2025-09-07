import { Link } from "react-router-dom";

// Props for the ArticleListing component
interface ArticleListingProps {
  articles: Article[];
  onHasArticles?: (has: boolean) => void;
}

// Article interface representing a blog article
interface Article {
  id: number;
  title: string;
  isPublished: boolean;
  createdAt?: string;
}

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
  articles,
}: ArticleListingProps) {

  // Render the article listing
  return (
    <div className="flex flex-col items-stretch px-6">
      {articles.map((article) => (
        <div
          key={article.id}
          className="flex flex-row items-center w-full border-b border-gray-700 py-3 gap-6"
        >
          <span className="flex-[2_1_0%] text-base font-semibold text-text min-w-[120px]">
            <Link to={`/article/${article.id}`}>{article.title}</Link>
          </span>
          <span className="flex-1 my-0 text-sm text-gray-400">
            Published on {formatDate(article.createdAt)}
          </span>
          <span className="flex-1 my-0 text-sm text-gray-400 text-right">
            {!article.isPublished && (
              <span className="inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Draft
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
