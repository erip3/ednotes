import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';

import { cn } from '@/utils/cn';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = AccordionPrimitive.Item;

// The header of the Accordion, usually contains the title and close button
const AccordionHeader = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Header>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Header
    ref={ref}
    className={cn('flex', className)}
    {...props}
  />
));
AccordionHeader.displayName = AccordionPrimitive.Header.displayName;

// The trigger button to open/close the Accordion
const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Trigger
    ref={ref}
    className={cn(
      // Use your theme variables and Tailwind classes
      'w-full flex items-center justify-between px-5 h-12 font-medium text-base border-b border-border bg-background text-primary-foreground transition-colors hover:bg-muted',
      'data-[state=open]:bg-muted',
      className,
    )}
    {...props}
  />
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

// The content area of the Accordion, where the main content goes
const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      // Use your theme variables and Tailwind classes
      'overflow-hidden text-base text-foreground bg-background transition-all data-[state=closed]:max-h-0 data-[state=open]:max-h-96 accordion-content',
      className,
    )}
    {...props}
  >
    <div className="px-5 py-4">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// The root Accordion component that wraps everything
const AccordionRoot = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children }) => (
  <AccordionPrimitive.Root
    type="multiple"
    className="w-[300px] rounded-lg border border-border bg-background shadow-lg"
  >
    {children}
  </AccordionPrimitive.Root>
));

export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  AccordionRoot,
};
