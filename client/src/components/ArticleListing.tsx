import { useNavigate } from "react-router-dom";

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

/**
 * ArticleListing component displays a list of articles.
 * @returns JSX.Element
 */
export default function ArticleListing({
  articles,
}: ArticleListingProps) {
  const navigate = useNavigate();

  // Render the article listing
  return (
    <div className="flex flex-col items-stretch px-6 gap-3">
      {articles.map((article) => (
        <button
          key={article.id}
          type="button"
          onClick={() => navigate(`/article/${article.id}`)}
          className="flex flex-row items-center w-full rounded-lg bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700 border border-neutral-700 py-4 px-6 gap-6 transition-colors duration-150 shadow-sm text-left outline-none focus:ring-2 focus:ring-blue-400"
        >
          <span className="flex-[2_1_0%] text-base font-semibold text-text min-w-[120px]">
            {article.title}
          </span>
          <span className="flex-1 my-0 text-sm text-gray-400 text-right">
            {!article.isPublished && (
              <span className="inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Draft
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
