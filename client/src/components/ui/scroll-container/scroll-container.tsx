import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

import { cn } from '@/utils/cn';

const ScrollContainer = ScrollAreaPrimitive.Root;

const ScrollContainerViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={cn('h-full w-full', className)}
    {...props}
  />
));

const ScrollContainerScrollbar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex select-none touch-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb
      className={cn(
        'relative flex-1 rounded-full bg-secondary',
        'before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-2 before:bg-secondary before:rounded-full before:content-[""]',
      )}
    />
  </ScrollAreaPrimitive.Scrollbar>
));
ScrollContainerScrollbar.displayName =
  ScrollAreaPrimitive.Scrollbar.displayName;

const ScrollContainerCorner = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Corner>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Corner>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Corner
    ref={ref}
    className={cn('bg-background', className)}
    {...props}
  />
));
ScrollContainerCorner.displayName = ScrollAreaPrimitive.Corner.displayName;

export {
  ScrollContainer,
  ScrollContainerViewport,
  ScrollContainerScrollbar,
  ScrollContainerCorner,
};
