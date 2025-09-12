import { useNavigate } from 'react-router-dom';

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
export default function ArticleListing({ articles }: ArticleListingProps) {
  const navigate = useNavigate();

  // Render the article listing
  return (
    <div className="flex flex-col items-stretch gap-3 px-6">
      {articles.map((article) => (
        <button
          key={article.id}
          type="button"
          onClick={() => navigate(`/article/${article.id}`)}
          className="flex w-full flex-row items-center gap-6 rounded-lg border border-neutral-700 bg-neutral-800 px-6 py-4 text-left shadow-sm outline-none transition-colors duration-150 hover:bg-neutral-700 focus:bg-neutral-700 focus:ring-2 focus:ring-blue-400"
        >
          <span className="text-text min-w-[120px] flex-[2_1_0%] text-base font-semibold">
            {article.title}
          </span>
          <span className="my-0 flex-1 text-right text-sm text-gray-400">
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
