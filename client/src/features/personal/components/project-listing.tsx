import {
  GitHubLogoIcon,
  FileTextIcon,
  ExternalLinkIcon,
} from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Project } from '@/types/aliases';

type ProjectListingProps = {
  project: Project;
};

/**
 * Component to display a project listing with optional GitHub, demo, and article links.
 * @param props Properties including the project to display.
 * @returns A styled project listing component.
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
    <div className="flex w-full items-center rounded-md border border-secondary bg-card p-4 text-left text-lg font-medium transition">
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
                className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
      {project.githubUrl && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-10 w-10"
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
          className="ml-2 h-10 w-10"
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
          className="ml-2 h-10 w-10"
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
  );
};
