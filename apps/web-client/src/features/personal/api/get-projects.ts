/**
 * @module features/personal/api/get-projects
 * @description Fetchers and query options for personal projects, intended for React Router loaders.
 *
 * Functionality:
 * - Fetch projects from the API with runtime validation
 * - Provide typed query options for React Query
 *
 * @example
 * // In a loader
 * const query = getProjectsQueryOptions();
 * const projects = await queryClient.fetchQuery(query);
 */
import { queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { Project } from '@/types/aliases';

/**
 * Type guard to validate if data is a valid Project
 */
const isProject = (data: unknown): data is Project => {
  return (
    !!data &&
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'description' in data
  );
};

/**
 * Type guard to validate if data is an array of Projects
 */
const isProjectArray = (data: unknown): data is Project[] => {
  return Array.isArray(data) && data.every(isProject);
};

/**
 * Build a descriptive Error with context for project fetch failures.
 * @param {string} message - Base error message.
 * @returns {Error} Error with context about the projects endpoint.
 */
const toFetchError = (message: string) => new Error(`${message} (projects)`);

/**
 * Fetch projects from the API.
 *
 * @returns {Promise<Project[]>} Promise resolving to the project array.
 * @remarks The Axios API client returns `response.data` directly.
 */
export const getProjects = (): Promise<Project[]> => {
  return api
    .get('/projects')
    .then((data) => {
      if (!isProjectArray(data)) {
        throw toFetchError('Invalid projects response');
      }
      return data;
    })
    .catch((error: any) => {
      throw toFetchError(
        `Failed to fetch projects: ${error?.message ?? 'unknown error'}`,
      );
    });
};

/**
 * Generate query options for react-query to fetch projects.
 *
 * @returns {import('@tanstack/react-query').QueryOptions} Query options with queryKey and queryFn.
 */
export const getProjectsQueryOptions = () => {
  const queryKey = ['projects'];

  return queryOptions({
    queryKey,
    queryFn: getProjects,
  });
};
