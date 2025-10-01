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

  return { children: children ?? [], projects: projects ?? [] };
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
  'bg-green-200 rounded px-3 py-1 text-sm text-green-950 font-medium';

const PersonalPage = () => {
  const { children, projects } = useLoaderData() as {
    children: Array<Category>;
    projects: Array<Project>;
  };

  return (
    <ContentLayout title="About Me" centered={false} isArticle={false}>
      <div className="text-medium mb-6 font-medium text-primary-foreground">
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
      </div>

      <CategoryGrid categories={children} />
    </ContentLayout>
  );
};

export default PersonalPage;
