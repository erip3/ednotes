/**
 * @module features/categories/components/category-grid
 * @description Renders a responsive grid of category cards. Uses React Router's
 * `useNavigate` to handle navigation to category detail routes and the personal page.
 * Returns `null` when the input list is empty.
 *
 * Layout:
 * - Outer container centers content
 * - Inner flex-wrap grid constrains max width and spaces cards
 *
 * Navigation:
 * - Title "Personal" routes to `/personal`
 * - Other categories route to `/categories/{id}`
 *
 * @example
 * const categories = [
 *   { id: 'alg', title: 'Algorithms', published: true },
 *   { id: 'pers', title: 'Personal', published: true },
 * ];
 * <CategoryGrid categories={categories} />
 */
import { useNavigate } from 'react-router-dom';

import { CategoryCard } from './category-card';

import { Category } from '@/types/aliases';

/**
 * Props for `CategoryGrid`.
 * @typedef {Object} CategoryGridProps
 * @property {Category[]} categories - Array of category items to render
 */
type CategoryGridProps = {
  categories: Category[];
};

/**
 * Displays a centered, wrapping grid of `CategoryCard` components.
 *
 * The component filters invalid input to a safe array and returns `null` when
 * no categories are available. Clicking a card navigates to the appropriate
 * route based on the category title and id.
 *
 * @component
 * @param {CategoryGridProps} props - Component props
 * @param {Category[]} props.categories - Categories to render in the grid
 * @returns {JSX.Element | null} The grid of cards or `null` when empty
 */
export const CategoryGrid = ({ categories }: CategoryGridProps) => {
  const navigate = useNavigate();
  const safeCategories = Array.isArray(categories) ? categories : [];

  if (safeCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
      <div className="flex max-w-6xl flex-wrap justify-center gap-3">
        {safeCategories.map((category) =>
          category.title === 'Personal' ? (
            <CategoryCard
              key={category.id}
              title={category.title}
              onClick={() => navigate('/personal')}
              published={category.published}
            />
          ) : (
            <CategoryCard
              key={category.id}
              title={category.title}
              onClick={() => navigate(`/categories/${category.id}`)}
              published={category.published}
            />
          ),
        )}
      </div>
    </div>
  );
};
