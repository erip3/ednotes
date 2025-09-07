import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
 * BackButton component navigates to the parent category or home if no parent exists.
 * @returns JSX.Element
 */
export default function BackButton() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch parentId for current category
  const { data } = useQuery<{ parentId?: number }>({
    queryKey: ["category", id],
    queryFn: async () => (await axios.get(`/api/categories/${id}`)).data,
    enabled: !!id,
  });

  const target = data?.parentId ? `/category/${data.parentId}` : "/";

  return (
    <button
      className="mr-2 p-2 rounded hover:bg-gray-700 transition"
      onClick={() => navigate(target)}
      aria-label="Back to parent category"
    >
      <BackIcon />
    </button>
  );
}
