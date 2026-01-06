import axios from "axios";

import type { Category } from "@/types/aliases";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export const fetchTopCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get<Category[]>("/categories/top-level");
  return res.data;
};

export const fetchChildCategories = async (
  parentId: number
): Promise<Category[]> => {
  const res = await apiClient.get<Category[]>(
    `/categories/${parentId}/children`
  );
  return res.data;
};
