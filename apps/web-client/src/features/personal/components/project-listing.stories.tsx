import { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';

import { ProjectListing } from './project-listing';

const meta: Meta<typeof ProjectListing> = {
  title: 'Features/Personal/ProjectListing',
  component: ProjectListing,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="w-full max-w-3xl">
            <Story />
          </div>
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectListing>;

export const FullProject: Story = {
  args: {
    project: {
      id: 1,
      name: 'EdNotes',
      description: 'A personal knowledge base and note-taking application',
      githubUrl: 'https://github.com/user/ednotes',
      demoUrl: 'https://ednotes.demo.com',
      techStack: 'React, TypeScript, Vite, TailwindCSS',
      imageUrl: undefined,
      articleId: 5,
      order: 1,
    },
  },
};

export const NoDemo: Story = {
  args: {
    project: {
      id: 2,
      name: 'CLI Tool',
      description: 'A command-line utility for file processing',
      githubUrl: 'https://github.com/user/cli-tool',
      demoUrl: undefined,
      techStack: 'Python, Click',
      imageUrl: undefined,
      articleId: undefined,
      order: 2,
    },
  },
};

export const NoArticle: Story = {
  args: {
    project: {
      id: 3,
      name: 'Data Visualizer',
      description: 'Interactive data visualization dashboard',
      githubUrl: 'https://github.com/user/data-viz',
      demoUrl: 'https://dataviz.demo.com',
      techStack: 'D3.js, Vue, Node.js',
      imageUrl: undefined,
      articleId: undefined,
      order: 3,
    },
  },
};

export const MinimalProject: Story = {
  args: {
    project: {
      id: 4,
      name: 'Simple Script',
      description: 'Basic automation script',
      githubUrl: 'https://github.com/user/script',
      demoUrl: undefined,
      techStack: 'Bash',
      imageUrl: undefined,
      articleId: undefined,
      order: 4,
    },
  },
};
