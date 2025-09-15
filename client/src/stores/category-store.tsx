// Zustand store for managing the current category state

import { create } from 'zustand';

type Category = {
  id: number;
  title: string;
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
