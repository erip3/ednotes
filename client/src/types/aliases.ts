import type { components } from '@/types/api';

export type Article = components['schemas']['Article'];
export type Category = components['schemas']['Category'];
export type Project = components['schemas']['Project'];

// Compound type returned when requesting parent info with children
export type CategoriesWithParent = {
  parent: Category;
  children: Category[];
};
