import { Link, useLocation } from "react-router-dom";

interface SidebarArticleProps {
  id: number;
  title: string;
}

export default function SidebarArticle({ id, title }: SidebarArticleProps) {
  const location = useLocation();
  const isActive = location.pathname === `/article/${id}`;

  return (
    <div className="flex items-center">
      {/* Empty span for arrow alignment, if needed */}
      <span className="inline-block w-5" />
      <Link
        to={`/article/${id}`}
        className={`flex-1 text-left px-3 py-2 rounded font-medium transition
          ${
            isActive
              ? "bg-green-800 text-white"
              : "bg-neutral-800 text-gray-100 hover:bg-neutral-700"
          }
        `}
      >
        {title}
      </Link>
    </div>
  );
}
