import React from 'react';

import { ProjectListing } from './project-listing';

import {
  ScrollContainer,
  ScrollContainerViewport,
  ScrollContainerScrollbar,
  ScrollContainerCorner,
} from '@/components/ui/scroll-container';
import { Project } from '@/types/aliases';

type ProjectContainerProps = {
  projects: Project[];
};

/**
 * ProjectContainer component displays a scrollable container for project listings.
 * @param props - Props containing an array of projects.
 * @returns JSX.Element
 */
export const ProjectContainer: React.FC<ProjectContainerProps> = ({
  projects,
}) => {
  return (
    <ScrollContainer className="mb-8 h-96 w-full rounded-md">
      <ScrollContainerViewport>
        <div className="flex flex-col gap-4 overflow-y-auto py-2">
          {projects.map((project) => (
            <ProjectListing key={project.id} project={project} />
          ))}
        </div>
      </ScrollContainerViewport>
      <ScrollContainerScrollbar orientation="vertical"></ScrollContainerScrollbar>
      <ScrollContainerCorner />
    </ScrollContainer>
  );
};
