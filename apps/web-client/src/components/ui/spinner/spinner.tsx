/**
 * @module components/ui/spinner
 * @description A lightweight, animated SVG spinner for indicating loading states. Supports
 * configurable sizes (sm, md, lg, xl) and color variants (light, primary).
 *
 * Features:
 * - **Flexible sizing**: sm (16px), md (32px), lg (64px), xl (96px)
 * - **Color variants**: light (white), primary (slate-600)
 *
 * @example
 * // Default medium primary spinner
 * <Spinner />
 *
 * @example
 * // Large light spinner
 * <Spinner size="lg" variant="light" />
 *
 * @example
 * // Custom color via className
 * <Spinner size="md" className="text-green-500" />
 */
import { cn } from '@/utils/cn';

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

const variants = {
  light: 'text-white',
  primary: 'text-slate-600',
};

/**
 * Props for the Spinner component.
 */
export type SpinnerProps = {
  /** Size of the spinner icon: 'sm' (16px), 'md' (32px), 'lg' (64px), 'xl' (96px). Defaults to 'md'. */
  size?: keyof typeof sizes;
  /** Color variant: 'light' (white), 'primary' (slate-600). Defaults to 'primary'. */
  variant?: keyof typeof variants;
  /** Additional Tailwind classes for customization (e.g., to override color). */
  className?: string;
};

/**
 * Loading spinner component for async operations.
 *
 * Combines Tailwind size and color tokens, and merges with `cn()` for safe class composition.
 *
 * @param {SpinnerProps} props - Size, variant, and custom className options.
 * @returns {JSX.Element} Animated spinner with accessibility text.
 *
 * @remarks
 * - Uses CSS `animate-spin` utility for the animation
 * - Size defaults to 'md' (32px), variant defaults to 'primary'
 * - Custom className is merged safely via `cn()` to override color if needed
 * - Screen reader will announce "Loading" when spinner is focused or near interactive elements
 */
export const Spinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
}: SpinnerProps) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'animate-spin',
          sizes[size],
          variants[variant],
          className,
        )}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span className="sr-only">Loading</span>
    </>
  );
};
