/**
 * @module components/ui/button
 * @description A flexible button built on top of `class-variance-authority` variants and
 * Radix `Slot` for polymorphism. Supports icon-only buttons.
 *
 * Features:
 * - **Variants/sizes**: Controlled via `buttonVariants` (default, outline, ghost, link; sm, default, lg, icon)
 * - **Polymorphic**: Render as child element using `asChild` with Radix `Slot`
 * - **Loading state**: Built-in spinner and layout handling
 * - **Icons**: Render icon-only or icon + label with consistent spacing
 *
 * @example
 * // Primary button
 * <Button>Save</Button>
 *
 * @example
 * // Outline button with icon
 * <Button variant="outline" icon={<DownloadIcon />}>Download</Button>
 *
 * @example
 * // Icon-only button
 * <Button variant="ghost" size="icon" aria-label="Close" icon={<Cross2Icon />} />
 *
 * @example
 * // Loading state
 * <Button isLoading>Submitting…</Button>
 *
 * @example
 * // Polymorphic rendering
 * <Button asChild>
 *   <a href="/docs">Read Docs</a>
 * </Button>
 */
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Spinner } from '../spinner';

import { buttonVariants } from './button-variants';

import { cn } from '@/utils/cn';

/**
 * Props for the `Button` component.
 *
 * @property asChild - When true, renders the child element via Radix `Slot` instead of a native button.
 * @property isLoading - Shows a small spinner and suppresses icon/children combo rendering.
 * @property icon - Optional icon to render before the label; when no children are provided,
 * renders as an icon-only button (use `aria-label`).
 */
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
  };

/**
 * Polymorphic Button with variant/size styles, loading state, and icon support.
 *
 * Renders either a native `button` or a child element (via `Slot`) when `asChild` is true.
 * Uses `buttonVariants` to generate Tailwind classes and `cn()` to merge custom classes.
 * The loading state displays a spinner; icon rendering gracefully handles icon-only and icon+label cases.
 *
 * @param {ButtonProps} props - Variant/size options and native button attributes.
 * @returns {JSX.Element} Styled button or polymorphic child element.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      isLoading,
      icon,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          'flex items-center justify-center', // Add this for centering
        )}
        ref={ref}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        {!isLoading && icon && !children && icon}
        {!isLoading && icon && children && (
          <>
            <span className="mr-2">{icon}</span>
            <span>{children}</span>
          </>
        )}
        {!isLoading && !icon && children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button };
