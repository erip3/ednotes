import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CategoryCard } from './category-card';

import { Category } from '@/types/aliases';

type CategoryGridProps = {
  categories: Category[];
};

/**
 * CategoryGrid component displays a grid of category cards using flex layout.
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
