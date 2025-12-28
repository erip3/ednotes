/**
 * @module app/pages/personal
 * @description Page with personal info
 *
 * Functionality:
 * - **Data loading**: Pre-fetches personal subcategories and projects via React Query
 * - **Content**: Displays background, projects, skills, etc.
 * - **Resume**: Provides downloadable PDF resume link
 * - **Related content**: Displays subcategories under the Personal root category
 *
 * Data flow:
 * 1. `clientLoader` fetches subcategories of Personal root (ID=1)
 * 2. `clientLoader` fetches all projects via `getProjectsQueryOptions`
 * 3. Loader returns `{ categories, projects }` consumed by `useLoaderData()`
 * 4. Component renders bio, projects, skills, and category grid
 *
 * @example
 * // In route configuration (create-router.tsx)
 * {
 *   path: '/personal',
 *   lazy: () => import('./pages/personal').then(convert(queryClient)),
 *   errorElement: <MainErrorFallback />
 * }
 */

import { QueryClient } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';

import resumePdf from '@/assets/resume.pdf';
import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { getCategoriesQueryOptions } from '@/features/categories/api/get-categories';
import { CategoryGrid } from '@/features/categories/components/category-grid';
import { getProjectsQueryOptions } from '@/features/personal/api/get-projects';
import { ProjectContainer } from '@/features/personal/components/project-container';
import { Project } from '@/types/aliases';
import { Category } from '@/types/aliases';

/**
 * Client-side data loader for the personal page.
 *
 * Fetches subcategories under the Personal root category (ID=1) and all personal projects.
 * Uses React Query for caching and deduplication to avoid redundant API calls.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance for cache management.
 * @returns {() => Promise<{ categories: Category[], projects: Project[] }>} Async loader function
 * that returns categories and projects data.
 *
 * @remarks
 * - Hardcodes Personal root category ID as 1 (matches database).
 * - Prefers cached data via `getQueryData` and falls back to `fetchQuery` as needed.
 * - Always returns objects with array defaults.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => async () => {
  const PERSONAL_CATEGORY_ID = 1;

  // Fetch subcategories under the Personal root
  const categoriesQuery = getCategoriesQueryOptions({
    parentId: PERSONAL_CATEGORY_ID,
  });
  const categories =
    (queryClient.getQueryData(categoriesQuery.queryKey) as
      | Array<Category>
      | undefined) ??
    ((await queryClient.fetchQuery(categoriesQuery)) as Array<Category>);

  // Fetch personal projects
  const projectsQuery = getProjectsQueryOptions();
  const cachedProjects = queryClient.getQueryData<{ data: Project[] }>(
    projectsQuery.queryKey,
  );
  const { data: projects } =
    cachedProjects ?? (await queryClient.fetchQuery(projectsQuery));

  return { categories: categories ?? [], projects: projects ?? [] };
};

const programmingLanguages = [
  'Python',
  'Java',
  'C/C++',
  'TypeScript',
  'Verilog',
];
const frameworks = ['React', 'Spring Boot'];
const databases = ['SQL', 'SQLite', 'PostgreSQL'];

const skillClass =
  'bg-primary-background rounded px-3 py-1 text-sm text-primary-foreground font-medium';

/**
 * PersonalPage component - Displays personal information, projects, skills, and related categories.
 *
 * @returns {JSX.Element} Personal page with bio, projects, skills, and categories.
 *
 * @example
 * // Rendered by React Router when navigating to /personal
 * const { categories, projects } = useLoaderData();
 * // Component then renders all sections with the provided data
 */
const PersonalPage = () => {
  const { categories, projects } = useLoaderData() as {
    categories: Array<Category>;
    projects: Array<Project>;
  };

  return (
    <ContentLayout title="About Me" centered={false} isArticle={false}>
      {/* About Me */}
      <div className="text-medium mb-6 font-medium text-foreground">
        <p className="mb-4">
          I'm a senior at Penn State majoring in Computer Science. I'm primarily
          interested in software engineering, but I also enjoy exploring broader
          areas of computing, including embedded systems, low-level programming,
          artificial intelligence, and computer vision. I'm planning to pursue a
          Master’s degree in Software Engineering after graduation.
        </p>
        <p className="mb-4">
          I’ve gained hands-on experience through my coursework and projects.
          Right now, I’m building EdNotes to act as my personal website and as a
          platform for sharing notes on different topics. I've also had the
          opportunity to intern with Internal Audit at ATI, where I developed a
          Python tool with Pandas and SQL to identify duplicate payments using
          invoice data. I've included a listing of my projects and skills below.
        </p>
      </div>

      {/* Resume Download */}
      <div className="flex justify-center pb-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.open(resumePdf, '_blank')}
        >
          View My Resume
        </Button>
      </div>

      {/* Projects */}
      <div className="py-4">
        <h2 className="mb-2 text-xl font-semibold">Projects</h2>
      </div>
      <ProjectContainer projects={projects} />

      {/* Skills */}
      <div className="py-4 text-foreground">
        <h2 className="mb-2 text-xl font-semibold">Skills</h2>
        <h3 className="text-l mb-2">Programming Languages</h3>
        <ul className="mb-4 flex flex-wrap gap-2">
          {programmingLanguages.map((lang) => (
            <li key={lang} className={skillClass}>
              {lang}
            </li>
          ))}
        </ul>
        <h3 className="text-l mb-2">Frameworks</h3>
        <ul className="mb-4 flex flex-wrap gap-2">
          {frameworks.map((fw) => (
            <li key={fw} className={skillClass}>
              {fw}
            </li>
          ))}
        </ul>
        <h3 className="text-l mb-2">Data Tools and Databases</h3>
        <ul className="mb-4 flex flex-wrap gap-2">
          {databases.map((db) => (
            <li key={db} className={skillClass}>
              {db}
            </li>
          ))}
        </ul>
      </div>

      {/* More */}
      {categories.length > 0 && (
        <div className="py-4">
          <h2 className="mb-2 text-xl font-semibold">More</h2>
          <CategoryGrid categories={categories} />
        </div>
      )}
    </ContentLayout>
  );
};

export default PersonalPage;
