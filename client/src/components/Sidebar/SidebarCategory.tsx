import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface Article {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
  children?: Category[];
  articles?: Article[];
}

interface SidebarCategoryProps {
  category: Category;
  articles?: Article[];
}

/**
 * SidebarCategory component for displaying a single category and its articles.
 * @param SidebarCategoryProps - The category object to display.
 * @returns JSX.Element
 */
export default function SidebarCategory({
  category,
  articles,
}: SidebarCategoryProps) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const hasArticles = articles && articles.length > 0;
  const isActive = location.pathname.includes(`/category/${category.id}`);

  return (
    <div>
      <div className="flex items-center">
        {/* Arrow button */}
        <button
          className={`mr-1 p-1 rounded hover:bg-neutral-700 transition ${
            hasArticles
              ? ""
              : "transparent cursor-default pointer-events-none opacity-25"
          }`}
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse articles" : "Expand articles"}
          tabIndex={hasArticles ? 0 : -1}
        >
          <span
            className="inline-block transition-transform duration-500"
            style={{
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            🠞
          </span>
        </button>

        {/* Category button */}
        <Link
          to={`/category/${category.id}`}
          className={`flex-1 text-left px-3 py-2 rounded font-medium transition
            ${
              isActive
                ? "bg-green-800 text-white"
                : "bg-neutral-800 text-gray-100 hover:bg-neutral-700"
            }
          `}
        >
          {category.name}
        </Link>
      </div>

      {/* Dropdown for articles */}
      {expanded && hasArticles && (
        <div className="ml-7 mt-1 flex flex-col gap-1">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="block px-3 py-1 rounded text-sm bg-neutral-700 text-gray-100 hover:bg-green-700 hover:text-white transition"
            >
              {article.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
