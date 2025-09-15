import { FolderIcon } from 'lucide-react';
import React from 'react';

import { cn } from '@/utils/cn';

type CategoryCardProps = {
  title?: string;
  onClick?: () => void;
  published?: boolean;
};

/**
 * CategoryCard component displays a card for a category with a name, an onClick handler, and a published flag.
 * @param props - Props containing name, onClick handler, and published flag.
 * @returns JSX.Element
 */
export const CategoryCard = ({
  title,
  onClick,
  published,
}: CategoryCardProps) => {
  return (
    <div
      className={cn(
        'm-2 flex h-44 w-52 flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-card transition-transform duration-200',
        !published
          ? 'pointer-events-none bg-muted text-muted-foreground opacity-50 shadow-none'
          : 'hover:-translate-y-1 hover:scale-105 hover:shadow-card-hover active:shardow-card-active active:translate-y-0.5 active:scale-95 cursor-pointer',
      )}
      tabIndex={0}
      role="button"
      aria-disabled={published}
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!published && e.key === 'Enter' && onClick) onClick();
      }}
    >
      <div className="mb-2">
        <FolderIcon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
};
