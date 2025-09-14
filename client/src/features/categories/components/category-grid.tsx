import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CategoryCard } from './category-card';

import { Category } from '@/types/aliases';

type CategoryGridProps = {
  categories: Category[];
};

export const CategoryGrid = ({ categories }: CategoryGridProps) => {
  const navigate = useNavigate();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
      <div className="grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] justify-items-center gap-3">
        {categories.map((category) =>
          category.name === 'Personal' ? (
            <CategoryCard
              key={category.id}
              name={category.name}
              onClick={() => navigate('/personal')}
            />
          ) : (
            <CategoryCard
              key={category.id}
              name={category.name}
              onClick={() => navigate(`/categories/${category.id}`)}
              comingSoon={category.comingSoon}
            />
          ),
        )}
      </div>
    </div>
  );
};
