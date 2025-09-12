import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

/**
 * Simple left-arrow icon for navigation.
 */
const BackIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-icon, currentColor)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

/**
 * BackButton component navigates to the parent category, or /personal if no parent exists.
 * Supports both category and article pages.
 */
export default function BackButton() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const isPersonal = location.pathname === '/personal';
  const isArticle = location.pathname.startsWith('/article');

  // Always call hooks!
  const { data } = useQuery<{ parentId?: number; categoryId?: number }>({
    queryKey: [isArticle ? 'back-article' : 'back-category', id],
    queryFn: async () => {
      if (isArticle) {
        return await axios.get(`/api/articles/${id}`).then((res) => ({
          parentId: res.data.categoryId,
        }));
      } else {
        return await axios.get(`/api/categories/${id}`).then((res) => ({
          parentId: res.data.parentId,
        }));
      }
    },
    enabled: !!id && !isPersonal, // Don't run query on /personal
  });

  // Decide target after hooks
  let target = '/personal';
  if (isPersonal || (!data?.parentId && !isArticle)) {
    target = '/';
  } else if (data?.parentId) {
    target = `/category/${data.parentId}`;
  }

  return (
    <button
      className="mr-2 rounded p-2 transition hover:bg-gray-700"
      onClick={() => navigate(target)}
      aria-label="Back"
    >
      <BackIcon />
    </button>
  );
}
