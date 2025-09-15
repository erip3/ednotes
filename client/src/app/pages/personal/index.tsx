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

export const clientLoader = (queryClient: QueryClient) => async () => {
  // Fetch categories
  const categoriesQuery = getCategoriesQueryOptions({
    parentId: 3,
  });
  const { children } = (queryClient.getQueryData(categoriesQuery.queryKey) ??
    (await queryClient.fetchQuery(categoriesQuery))) as {
      children: Array<Category>;
    };

  // Fetch personal projects
  const projectsQuery = getProjectsQueryOptions();
  const projects = (queryClient.getQueryData(projectsQuery.queryKey) ??
    (await queryClient.fetchQuery(projectsQuery))) as {
      projects: Array<Project>;
    };

  return { children, projects };
};

const programmingLanguages = [
  'Python',
  'Java',
  'C/C++',
  'TypeScript',
  'Verilog',
];
const frameworks = ['React'];
const databases = ['SQL', 'SQLite', 'Postgres'];
const misc = ['GitHub', 'VSCode'];

const skillClass =
  'bg-green-200 rounded px-3 py-1 text-sm text-green-950 font-medium';

const PersonalPage = () => {
  const { children, projects } = useLoaderData() as {
    children: Array<Category>;
    projects: Array<Project>;
  };

  return (
    <ContentLayout title="About Me" centered={false} isArticle={false}>
      <div className="text-medium mb-6 font-medium text-primary-foreground">
        I'm a senior at Penn State majoring in Computer Science with a focus on
        software engineering and growing interest in machine learning and AI.
        I’m exploring different areas of computing to build a versatile
        foundation and apply what I learn through projects.
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

      <ProjectContainer projects={projects} />

      {/* Skills */}
      <div className="py-4">
        <h2 className="mb-2 text-xl font-semibold">Skills</h2>
        <h3 className="text-l mb-2 text-neutral-400">Programming Languages</h3>
        <ul className="mb-4 flex flex-wrap gap-2">
          {programmingLanguages.map((lang) => (
            <li key={lang} className={skillClass}>
              {lang}
            </li>
          ))}
        </ul>
        <h3 className="text-l mb-2 text-neutral-400">Frameworks</h3>
        <ul className="mb-4 flex flex-wrap gap-2">
          {frameworks.map((fw) => (
            <li key={fw} className={skillClass}>
              {fw}
            </li>
          ))}
        </ul>
        <h3 className="text-l mb-2 text-neutral-400">
          Data Tools and Databases
        </h3>
        <ul className="mb-4 flex flex-wrap gap-2">
          {databases.map((db) => (
            <li key={db} className={skillClass}>
              {db}
            </li>
          ))}
        </ul>
        <h3 className="text-l mb-2 text-neutral-400">Misc</h3>
        <ul className="mb-4 flex flex-wrap gap-2">
          {misc.map((item) => (
            <li key={item} className={skillClass}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <CategoryGrid categories={children} />
    </ContentLayout>
  );
};

export default PersonalPage;
