/**
 * @module features/personal/components/project-container
 * @description Renders a vertical list of projects inside a hover-revealed scrollbar. Uses
 * the shared `ScrollContainer` components to provide consistent scroll styling across the app.
 *
 * Notes:
 * - `ScrollContainer` uses `type="hover"` so the scrollbar appears when the pointer is inside
 * - The viewport owns scrolling; avoid applying overflow to inner content
 * - The container height (h-96) creates overflow so the scrollbar can render
 */
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
    <ScrollContainer type="hover" className="mb-8 h-96 w-full rounded-md">
      <ScrollContainerViewport className="h-full w-full pr-1">
        <div className="flex flex-col gap-4 py-2 pr-1">
          {projects.map((project) => (
            <ProjectListing key={project.id} project={project} />
          ))}
        </div>
      </ScrollContainerViewport>
      <ScrollContainerScrollbar orientation="vertical" />
      <ScrollContainerCorner />
    </ScrollContainer>
  );
};
