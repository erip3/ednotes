import { projectVisuals } from "./projectVisual";
import NotesIcon from "./Icons/NotesIcon";

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
    ? project.techStack.split(",").map((t) => t.trim())
    : [];

  return (
    <div className="border rounded p-4 flex flex-col md:flex-row gap-4 items-start">
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-24 h-24 object-cover rounded shadow"
        />
      )}
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-1">{project.name}</h3>
        {project.description && (
          <p className="text-sm text-neutral-600 mb-2">{project.description}</p>
        )}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {techs.map((tech) => (
              <span
                key={tech}
                className="bg-green-100 text-green-950 px-2 py-0.5 rounded text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-4 items-center">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline text-sm"
            >
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline text-sm"
            >
              Demo
            </a>
          )}
        </div>
      </div>
      {/* More Details Button */}
      <div className="flex items-center self-stretch ml-auto">
        <a
          href={`/article/${project.articleId}`}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-700 text-white rounded-lg text-lg font-semibold shadow hover:bg-green-700 transition"
        >
          <Icon />
          More Details
        </a>
      </div>
    </div>
  );
}
