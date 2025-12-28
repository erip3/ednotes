/**
 * @module components/ui/scroll-container
 * @description Provides a scroll area with viewport and scrollbar. Use the
 * `ScrollContainer` as the root, place your content in `ScrollContainerViewport`, and render
 * one or both `ScrollContainerScrollbar` components (vertical/horizontal). The optional
 * `ScrollContainerCorner` fills the corner when both scrollbars are visible.
 *
 * Usage pattern:
 * <ScrollContainer className="h-64 w-full">
 *   <ScrollContainerViewport>
 *     <!-- Scrollable content here -->
 *   </ScrollContainerViewport>
 *   <ScrollContainerScrollbar />
 *   <ScrollContainerScrollbar orientation="horizontal" />
 *   <ScrollContainerCorner />
 * </ScrollContainer>
 *
 * Notes:
 * - Ensure the root has a constrained height/width so overflow occurs
 * - The root adds `relative overflow-hidden` to keep scrollbars anchored
 */
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

import { cn } from '@/utils/cn';

/**
 * Root scroll area container. Adds relative positioning and overflow clipping.
 */
const ScrollContainer = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, type = 'hover', ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    type={type}
    className={cn('relative overflow-hidden max-w-full', className)}
    {...props}
  />
));
ScrollContainer.displayName = ScrollAreaPrimitive.Root.displayName;

/**
 * Scrollable viewport that renders child content. Should be a direct child of the root.
 */
const ScrollContainerViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={cn('h-full w-full max-w-full', className)}
    {...props}
  />
));
ScrollContainerViewport.displayName = 'ScrollContainerViewport';

/**
 * Scrollbar with track and thumb. Render at least one; support vertical or horizontal.
 * @param orientation - 'vertical' (default) or 'horizontal'
 * @param forceMount - Pass through to Radix if you want the thumb always rendered
 */
const ScrollContainerScrollbar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex select-none touch-none transition-colors bg-background/70',
      orientation === 'vertical' && 'absolute right-0 top-0 h-full w-3 p-[2px]',
      orientation === 'horizontal' &&
        'absolute bottom-0 left-0 h-3 w-full p-[2px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb
      className={cn(
        'relative flex-1 rounded-full bg-muted-foreground',
        'before:absolute before:inset-0 before:m-auto before:h-full before:min-h-[12px] before:w-full before:min-w-[12px] before:rounded-full before:content-[""]',
      )}
    />
  </ScrollAreaPrimitive.Scrollbar>
));
ScrollContainerScrollbar.displayName =
  ScrollAreaPrimitive.Scrollbar.displayName;

/**
 * Optional corner element shown when both scrollbars are visible.
 */
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
