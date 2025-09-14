// Store to manage the current category using Zustand

import { create } from 'zustand';

type Category = {
  id: number;
  name: string;
  isTopic?: boolean;
  parentId?: number | null;
} | null;

type CategoryStore = {
  currentCategory: Category;
  setCurrentCategory: (category: Category) => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  currentCategory: null,
  setCurrentCategory: (category) => set({ currentCategory: category }),
}));
