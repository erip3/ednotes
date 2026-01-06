import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CreateOrUpdateArticleRequest {
  title: string;
  content: string; // JSON string of blocks
  categoryId?: number | null;
}

export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  categoryId?: number | null;
}

/**
 * Upload article to the database
 */
export const uploadArticle = async (
  data: CreateOrUpdateArticleRequest
): Promise<ArticleResponse> => {
  try {
    const response = await apiClient.post<ArticleResponse>("/articles", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to upload article"
      );
    }
    throw error;
  }
};

/**
 * Fetch article by ID
 */
export const fetchArticle = async (id: number): Promise<ArticleResponse> => {
  try {
    const response = await apiClient.get<ArticleResponse>(`/articles/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch article"
      );
    }
    throw error;
  }
};

/**
 * Update article
 */
export const updateArticle = async (
  id: number,
  data: CreateOrUpdateArticleRequest
): Promise<ArticleResponse> => {
  try {
    const response = await apiClient.put<ArticleResponse>(
      `/articles/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update article"
      );
    }
    throw error;
  }
};
