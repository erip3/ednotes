import NotesIcon from './Icons/NotesIcon';
import { projectVisuals } from './projectVisual';

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

export default function ProjectListing(project: Project) {
  const visual = projectVisuals[project.name.toLowerCase()];
  const Icon = visual?.icon || NotesIcon;

  // Parse tech stack into array if it's a comma-separated string
  const techs = project.techStack
    ? project.techStack.split(',').map((t) => t.trim())
    : [];

  return (
    <div className="flex flex-col items-start gap-4 rounded border p-4 md:flex-row">
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.name}
          className="h-24 w-24 rounded object-cover shadow"
        />
      )}
      <div className="flex-1">
        <h3 className="mb-1 text-lg font-bold">{project.name}</h3>
        {project.description && (
          <p className="mb-2 text-sm text-neutral-600">{project.description}</p>
        )}
        {techs.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {techs.map((tech) => (
              <span
                key={tech}
                className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-950"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              Demo
            </a>
          )}
        </div>
      </div>
      {/* More Details Button */}
      <div className="ml-auto flex items-center self-stretch">
        <a
          href={`/article/${project.articleId}`}
          className="flex items-center gap-2 rounded-lg bg-neutral-700 px-6 py-3 text-lg font-semibold text-white shadow transition hover:bg-green-700"
        >
          <Icon />
          More Details
        </a>
      </div>
    </div>
  );
}
