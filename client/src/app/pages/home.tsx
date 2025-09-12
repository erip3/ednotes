import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import CategoryCard from '../components/CategoryCard/CategoryCard';
import PageLoader from '../components/PageLoader';

// Category interface represents a single category.
interface Category {
  id: number;
  name: string;
  comingSoon?: boolean;
}

/**
 * Home component displays the top-level categories.
 * @returns JSX.Element
 */
export default function Home() {
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Fetch categories from API
  const {
    data: categories,
    isLoading,
    isFetching,
    error,
  } = useQuery<Category[]>({
    queryKey: ['categories', 'top-level'],
    queryFn: async () => {
      const res = await axios.get<Category[]>('/api/categories/top-level');
      return res.data;
    },
  });

  // Find and filter out the "personal" category
  const personalCategory = categories?.find(
    (cat) => cat.name.toLowerCase() === 'personal',
  );
  const otherCategories = categories?.filter(
    (cat) => cat.name.toLowerCase() !== 'personal',
  );

  // Render loading state or categories
  return (
    <PageLoader
      loading={isLoading}
      error={error ? 'Failed to load categories.' : undefined}
      isRetrying={isFetching && !!error}
    >
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        {/* Title */}
        <h1 className="text-5xl font-bold">EdNotes</h1>
        <p className="top py-4 text-lg text-neutral-400">
          Choose a category to get started:
        </p>

        {/* Category Cards */}
        <div className="mt-6 flex flex-wrap gap-4">
          {/* Special card for "Personal" */}
          {personalCategory && (
            <CategoryCard
              key={personalCategory.id}
              name="Personal"
              comingSoon={personalCategory.comingSoon}
              onClick={() => navigate('/personal')}
            />
          )}

          {/* Render all categories except "personal" */}
          {otherCategories &&
            otherCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                comingSoon={cat.comingSoon}
                onClick={
                  cat.comingSoon
                    ? undefined
                    : () => navigate(`/category/${cat.id}`)
                }
              />
            ))}
        </div>
      </div>
    </PageLoader>
  );
}
