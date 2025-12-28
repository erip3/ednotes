/**
 * @module components/ui/button/button-variants
 * @description Exposes the `buttonVariants` helper to compose Tailwind classes for
 * visual variants and sizes, plus a shared `ButtonProps` type that augments native
 * button attributes with variant/size options and convenience flags.
 *
 * Variants:
 * - `default`: Primary button styling with background/foreground tokens
 * - `outline`: Bordered button on neutral background
 * - `ghost`: Subtle button with hover-only background
 * - `link`: Text-styled button with underline on hover
 *
 * Sizes:
 * - `default`: Standard control height/padding
 * - `sm`: Compact, smaller text and padding
 * - `lg`: Larger padding for emphasis
 * - `icon`: Square button sized for icon-only usage
 */

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

/**
 * Composable Tailwind class generator for button variants and sizes.
 *
 * @remarks
 * - Uses semantic color tokens defined in Tailwind config (e.g., `primary`, `muted`)
 * - Designed to be merged via `cn()` in the Button component for additional classes
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary-background text-primary-foreground shadow hover:bg-primary-background/70 hover:outline-primary-foreground/80',
        outline:
          'border bg-primary-background shadow-sm hover:bg-muted-background hover:text-muted-foreground',
        ghost: 'hover:bg-muted-background hover:text-muted-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/**
 * Shared props for button-like components using `buttonVariants`.
 *
 * @property asChild - When true, renders a polymorphic child via Radix `Slot`.
 * @property isLoading - Renders a loading spinner and disables icon/children layout.
 * @property icon - Optional icon element to render, aligned with or without children.
 */
export type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
  };
