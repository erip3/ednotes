/**
 * @module features/personal/components/project-listing
 * @description Displays a single project with optional GitHub, demo, and article links.
 *
 * Features:
 * - Responsive layout: vertical stacking on small screens, horizontal on larger screens
 * - Tech stack badges parsed from comma-separated string
 * - Icon buttons for external GitHub/demo links and internal article navigation
 * - Compact presentation with title, description, and tags
 *
 * @example
 * <ProjectListing project={project} />
 */

import {
  GitHubLogoIcon,
  FileTextIcon,
  ExternalLinkIcon,
} from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Project } from '@/types/aliases';

/**
 * Props for the ProjectListing component
 * @interface ProjectListingProps
 */
type ProjectListingProps = {
  /** The project to display */
  project: Project;
};

/**
 * Displays a project listing card with name, description, tech stack, and action buttons.
 *
 * @param props - Component props
 * @param props.project - The project object to display
 * @returns A styled project card component with interactive elements
 *
 * @remarks
 * - Tech stack is parsed from project.techStack as a comma-separated string
 * - GitHub and demo links open in new windows
 * - Article links navigate using React Router
 * - All buttons are optional and only render if the corresponding project property exists
 *
 * @example
 * const { data: project } = useProject({ projectId: 1 });
 * return <ProjectListing project={project} />;
 */
export const ProjectListing = ({ project }: ProjectListingProps) => {
  const navigate = useNavigate();

  // Parse tech stack (assume comma-separated string)
  const techStack = project.techStack
    ? project.techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="flex w-full flex-col rounded-md border bg-primary-background p-4 text-left text-lg font-medium transition sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col">
        {project.name ?? 'Untitled Project'}
        <div className="mt-1 text-sm text-muted-foreground">
          {project.description ?? 'No description available'}
        </div>
        {techStack.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded bg-muted-background px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-row gap-2 sm:ml-auto sm:mt-0">
        {project.githubUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            aria-label="View on GitHub"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.githubUrl, '_blank');
            }}
          >
            <GitHubLogoIcon width={24} height={24} />
          </Button>
        )}
        {project.demoUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            aria-label="View Demo"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.demoUrl, '_blank');
            }}
          >
            <ExternalLinkIcon width={24} height={24} />
          </Button>
        )}
        {project.articleId && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            aria-label="View article"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/articles/${project.articleId}`);
            }}
          >
            <FileTextIcon width={24} height={24} />
          </Button>
        )}
      </div>
    </div>
  );
};
