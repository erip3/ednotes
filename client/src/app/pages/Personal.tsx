import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import PageLoader from '../components/PageLoader';
import ProjectListing from '../components/ProjectListing/ProjectListing';

interface Project {
  id: number;
  name: string;
  description?: string;
  techStack?: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  articleId: number;
  order: number;
}

/**
 * Personal page component displaying personal projects.
 * @returns JSX.Element
 */
export default function Personal() {
  // Fetch projects table data
  const {
    data: projects,
    isLoading,
    isFetching,
    error,
  } = useQuery<Project[]>({
    queryKey: ['projects', 'personal'],
    queryFn: async () => {
      const res = await axios.get('/api/projects');
      return res.data;
    },
  });

  return (
    <PageLoader
      loading={isLoading}
      error={error ? 'Failed to load data.' : undefined}
      isRetrying={isFetching && !!error}
    >
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">About Me</h1>
        <p className="mb-6">
          I'm a senior at Penn State majoring in Computer Science with a focus
          on software engineering and growing interest in machine learning and
          AI. I’m exploring different areas of computing to build a versatile
          foundation and apply what I learn through projects.
        </p>

        {/* Resume Download */}
        <div className="flex justify-center">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 inline-block rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            View My Resume
          </a>
        </div>

        {/* Projects */}
        <h2 className="mb-2 text-xl font-semibold">Projects</h2>
        <div className="relative mb-8 rounded border-2 border-neutral-400 bg-neutral-800">
          <div className="scroll-fade-container max-h-96 space-y-6 overflow-y-auto p-4 shadow">
            {projects &&
              projects.length > 0 &&
              [...projects]
                .sort((a, b) => a.order - b.order)
                .map((project: Project) => (
                  <ProjectListing key={project.id} {...project} />
                ))}
          </div>
        </div>

        {/* Skills */}
        <h2 className="mb-2 text-xl font-semibold">Skills</h2>
        <h3 className="text-l mb-2 text-neutral-400">Programming Languages</h3>
        <ul className="mb-4 flex flex-wrap gap-2 text-green-950">
          <li className="rounded bg-green-200 px-3 py-1 text-sm">Python</li>
          <li className="rounded bg-green-200 px-3 py-1 text-sm">Java</li>
          <li className="rounded bg-green-200 px-3 py-1 text-sm">C/C++</li>
          <li className="rounded bg-green-200 px-3 py-1 text-sm">TypeScript</li>
        </ul>
        <h3 className="text-l mb-2 text-neutral-400">Frameworks</h3>
        <ul className="mb-4 flex flex-wrap gap-2 text-green-950">
          <li className="rounded bg-green-200 px-3 py-1 text-sm">React</li>
        </ul>
        <h3 className="text-l mb-2 text-neutral-400">
          Data Tools and Databases
        </h3>
        <ul className="mb-4 flex flex-wrap gap-2 text-green-950">
          <li className="rounded bg-green-200 px-3 py-1 text-sm">SQL</li>
          <li className="rounded bg-green-200 px-3 py-1 text-sm">SQLite</li>
          <li className="rounded bg-green-200 px-3 py-1 text-sm">Postgres</li>
        </ul>
        <h3 className="text-l mb-2 text-neutral-400">Misc</h3>
        <ul className="mb-4 flex flex-wrap gap-2 text-green-950">
          <li className="rounded bg-green-200 px-3 py-1 text-sm">GitHub</li>
          <li className="rounded bg-green-200 px-3 py-1 text-sm">VSCode</li>
        </ul>

        {/* Contact */}
        <h2 className="mb-2 text-xl font-semibold">Contact</h2>
        <ul className="mb-8">
          <li>
            Email:{' '}
            <a
              href="mailto:edrip222@gmail.com"
              className="text-green-600 hover:underline"
            >
              edrip222@gmail.com
            </a>
          </li>
          <li>
            LinkedIn:{' '}
            <a
              href="https://www.linkedin.com/in/eddie-ripple-96068826b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              Eddie Ripple
            </a>
          </li>
          <li>
            GitHub:{' '}
            <a
              href="https://github.com/erip3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              erip3
            </a>
          </li>
        </ul>
      </div>
    </PageLoader>
  );
}
