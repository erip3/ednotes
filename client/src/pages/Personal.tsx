import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { categoryVisuals } from "../components/CategoryCard/categoryVisual";
import CategoryCard from "../components/CategoryCard/CategoryCard";

interface Category {
  id: number;
  name: string;
  comingSoon?: boolean;
  isTopic: boolean;
}

/**
 * Personal page component displaying personal subcategories.
 * @returns JSX.Element
 */
export default function Personal() {
  const navigate = useNavigate();

  // Fetch subcategories for "personal"
  const { data: subcategories } = useQuery<Category[]>({
    queryKey: ["subcategories", "personal"],
    queryFn: async () => {
      const res = await axios.get("/api/categories/3/children");
      return res.data;
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Me</h1>
      <p className="mb-6">
        I'm a senior at Penn State majoring in Computer Science with a focus on
        software engineering and growing interest in machine learning and AI.
        I’m exploring different areas of computing to build a versatile
        foundation and apply what I learn through projects.
      </p>

      {/* Resume Download */}
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mb-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        View My Resume
      </a>

      {/* Skills */}
      <h2 className="text-xl font-semibold mb-2">Skills</h2>
      <ul className="flex flex-wrap gap-2 mb-8">
        <li className="bg-gray-200 rounded px-3 py-1 text-sm">Python</li>
        <li className="bg-gray-200 rounded px-3 py-1 text-sm">React</li>
        <li className="bg-gray-200 rounded px-3 py-1 text-sm">TypeScript</li>
      </ul>

      {/* Projects */}
      <h2 className="text-xl font-semibold mb-2">Projects</h2>
      <div className="space-y-6 mb-8">
        <div className="border rounded p-4">
          <h3 className="font-bold text-lg">Project Name</h3>
          <p className="text-sm text-gray-600 mb-2">
            Short description of the project.
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
              React
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
              Node.js
            </span>
          </div>
          <a
            href="https://github.com/yourusername/project"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            View on GitHub
          </a>
        </div>
        {/* Repeat for more projects */}
      </div>

      {/* Contact */}
      <h2 className="text-xl font-semibold mb-2">Contact</h2>
      <ul className="mb-8">
        <li>
          Email:{" "}
          <a
            href="mailto:your@email.com"
            className="text-blue-600 hover:underline"
          >
            edrip222@gmail.com
          </a>
        </li>
        <li>
          LinkedIn:{" "}
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            yourprofile
          </a>
        </li>
        <li>
          GitHub:{" "}
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            yourusername
          </a>
        </li>
      </ul>
    </div>
  );
}
