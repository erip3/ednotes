import { createContext } from 'react';

interface CategoryContextType {
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  selectedTopic: number | null;
  setSelectedTopic: (id: number | null) => void;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);
export type { CategoryContextType };
