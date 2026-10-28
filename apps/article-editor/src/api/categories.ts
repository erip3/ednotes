import axios from "axios";

import type { Category } from "@/types/aliases";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

interface FolderContent {
  subCategories?: Category[];
}

export const fetchTopCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get<FolderContent>("/navigation/roots");
  return res.data.subCategories ?? [];
};

export const fetchChildCategories = async (
  parentId: number,
): Promise<Category[]> => {
  const res = await apiClient.get<FolderContent>(
    `/navigation/categories/${parentId}`,
  );
  return res.data.subCategories ?? [];
};
