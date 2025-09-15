import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Spinner } from '../spinner';

import { buttonVariants } from './button-variants';

import { cn } from '@/utils/cn';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
  };

/**
 * Button component that supports various variants, sizes, loading state, and icons.
 * @param props - Props including variant, size, asChild, isLoading, icon, and other button attributes.
 * @returns A styled button component.
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
