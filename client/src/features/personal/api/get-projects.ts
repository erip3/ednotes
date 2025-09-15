import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { Project } from '@/types/aliases';

/**
 * Fetch projects from the API.
 * @returns A promise that resolves to the fetched projects.
 */
export const getProjects = (): Promise<{ data: Project[] }> => {
  return api.get('projects');
};

/**
 * Generate query options for react-query to fetch projects.
 * @returns Query options for react-query to fetch projects.
 */
export const getProjectsQueryOptions = () => {
  const queryKey = ['projects'];

  return queryOptions({
    queryKey,
    queryFn: getProjects,
  });
};

/**
 * Custom hook to fetch projects.
 * @returns useQuery result for projects.
 */
export const useProjects = () => {
  return useQuery({
    ...getProjectsQueryOptions(),
  });
};
