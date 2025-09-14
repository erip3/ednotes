import { ArchiveIcon } from '@radix-ui/react-icons';
import React from 'react';

import { cn } from '@/utils/cn';

type CategoryCardProps = {
  name?: string;
  onClick?: () => void;
  comingSoon?: boolean;
};

export const CategoryCard = ({
  name,
  onClick,
  comingSoon,
}: CategoryCardProps) => {
  return (
    <div
      className={cn(
        'm-2 flex h-44 w-52 flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-card transition-transform duration-200',
        comingSoon
          ? 'pointer-events-none bg-muted text-muted-foreground opacity-50 shadow-none'
          : 'hover:-translate-y-1 hover:scale-105 hover:shadow-card-hover active:shardow-card-active active:translate-y-0.5 active:scale-95 cursor-pointer',
      )}
      tabIndex={0}
      role="button"
      aria-disabled={comingSoon}
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!comingSoon && e.key === 'Enter' && onClick) onClick();
      }}
    >
      <div className="mb-2">
        <ArchiveIcon />
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
    </div>
  );
};
